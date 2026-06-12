The ``initiate`` operation is called when a test case has been selected for execution and a new test session is being initialised. At the point it is called the 
test session is created but has not actually started yet to go through the test case's steps. The purpose of this operation is to:

    * Create a messaging session.
    * Record the Test Bed's call-back address.
    * Receive configuration properties from the Test Bed.
    * Provide configuration properties to the Test Bed.

As explained in the overview section, messaging services typically need sessions to manage state in order to store configuration, message correlation data,
as well as the call-back address for the Test Bed to signal received messages (see :ref:`messaging__callbacks`). The ``initiate`` operation is expected to create such a session,
assign it a unique identifier, and return the identifier as part of the operation's response. This identifier is then returned by the Test Bed on all 
subsequent calls, thus allowing the service to correctly distinguish and handle concurrently executing test sessions. The service needs to ensure that the 
identifier is stored in a construct that will allow state to be associated with it, making it possible to subsequently read it and (most likely) update it. In terms 
of implementation it needs to be thread-safe as you may have numerous concurrent sessions and can range from something as simple as an in-memory concurrent
map to a database.

The initial data to store in the session are:

    * The generated session identifier (to enable subsequent lookups).
    * The Test Bed's call-back address.

The following example illustrates an ``initiate`` implementation (using the `Spring framework`_) that uses a separate component to manage session state:

.. code-block:: java

    private static final QName WSA_REPLYTO_QNAME = new QName("http://www.w3.org/2005/08/addressing", "ReplyTo");
    @Autowired
    private SessionManager sessionManager = null;
    @Resource
    private WebServiceContext wsContext = null;

    public InitiateResponse initiate(InitiateRequest parameters) {
        InitiateResponse response = new InitiateResponse();
        // Get the ReplyTo address for the Test Bed call-backs based on WS-Addressing.
        String replyToAddress = getReplyToAddress();
        // Create a session and return its identifier.
        String sessionId = sessionManager.createSession(replyToAddress);
        response.setSessionId(sessionId);
        return response;
    }

    private String getReplyToAddress() {
        // Get the list of headers from the request.
        List<Header> headers = (List<Header>) wsContext.getMessageContext().get(Header.HEADER_LIST);
        for (Header header: headers) {
            // Find the "ReplyTo" header.
            if (header.getName().equals(WSA_REPLYTO_QNAME)) {
                // Extract and return the address to the call-back endpoint's WSDL.
                String replyToAddress = ((Element)header.getObject()).getTextContent().trim();
                if (!replyToAddress.toLowerCase().endsWith("?wsdl")) {
                    replyToAddress += "?wsdl";
                }
                return replyToAddress;
            }
        }
        return null;
    }    

.. note::
    **Session management simplification:** As of release 1.15.0 returning a session ID in the ``InitiateResponse`` is optional.
    In this case the Test Bed will use the overall test session ID (as opposed to a generated messaging session ID) in all 
    subsequent calls. The difference in this case is that you will not be aware of this ID before it is referred to in e.g. 
    a `send`_ or `receive`_ call. As such, if you want to track sessions, your service implementation should be adapted to record 
    a new session when a session ID is first encountered.

Extraction of the "ReplyTo" header in ``getReplyToAddress()`` is critical as it is this address that allows the service to provide received messages to the
Test Bed. You could skip this if the service is only ever going to be used to send messages (i.e. the relevant test cases never contain a `receive`_ step).
Alternatively you could configure a fixed value for the call-back address although this is a bad practice: it ties the service to a specific Test Bed instance
and it does not automatically handle address changes. With respect to session management, the above example uses a custom ``SessionManager`` component, the main code of 
which is provided in the following code block:

.. code-block:: java

    @Component
    public class SessionManager {

        // Use a thread-safe construct to store sessions.
        private Map<String, Map<String, Object>> sessions = new ConcurrentHashMap<>();

        public String createSession(String callbackURL) {
            if (callbackURL == null) {
                throw new IllegalArgumentException("A callback URL must be provided");
            }
            // Generate a unique session ID.
            String sessionId = UUID.randomUUID().toString();
            // The information of a session is stored in a map.
            Map<String, Object> sessionInfo = new HashMap<>();
            // Add the call-back URL to the session data.
            sessionInfo.put("CALLBACK_URL", callbackURL);
            sessions.put(sessionId, sessionInfo);
            return sessionId;
        }

        public void destroySession(String sessionId) {
            sessions.remove(sessionId);        
        }

        public Object getSessionInfo(String sessionId, String infoKey) {
            Object value = null;
            if (sessions.containsKey(sessionId)) {
                value = sessions.get(sessionId).get(infoKey);
            }
            return value;
        }

        public void setSessionInfo(String sessionId, String infoKey, Object infoValue) {
            sessions.get(sessionId).put(infoKey, infoValue);
        }
    }

Decoupling session management into a separate component is a good practice as it allows session state to be accessed by any component involved in the
service's processing. In addition, it hides implementation details allowing e.g. a switch to using a database to take place without impacting other code.
A fully functioning implementation of call-back and session management is provided through the available template messaging service (see :ref:`templates`).

The second main concern of the ``initiate`` operation is the management of **configuration** to address values received from the Test Bed and also 
provided to the Test Bed as a response. To understand how configuration is managed you need to be familiar with the GITB concepts of **actors** and **endpoints**
which are discussed in detail in the GITB TDL documentation on `Test Suites`_ and `Test Cases`_. In summary, what you need to know is the following:

    * Test cases are based on interactions between one or more **actors** (e.g. a "Client" and a "Server"), one of which will always be the SUT
      (System Under Test) whereas the others are simulated.
    * Messaging services are defined as the **handler** of communication between a "from" actor and a "to" actor and act as the implementation of the 
      simulated one(s).
    * Actors may define configuration properties grouped in a named set called an **endpoint**.
    * For the **SUT actor** (i.e. the actual system we are testing), properties are provided by the Test Bed user before starting the test session.
    * For **simulated actors** (i.e. the ones implemented by the messaging service), properties are provided by the messaging service.
    * The ``initiate`` operation call provides the SUT actor configuration to the service and returns the generated configuration (if any).

To illustrate this process consider the following example:

.. code-block:: java

    public InitiateResponse initiate(InitiateRequest parameters) {
        // Handle call-back address and session creation.
        String sessionId = createSession();
        // Process (if needed) the configuration received from the Test Bed. 
        processReceivedConfiguration(parameters.getActorConfiguration());
        // Generate configuration to return to the Test Bed.
        ActorConfiguration configForSut = new ActorConfiguration();
        // Set the name of the simulated actor this service implements.
        configForSut.setActor("Server");
        // Set the name of the endpoint expected by the SUT actor.
        configForSut.setEndpoint("serverAddressInformation");
        // Build the configuration entry for the "address" property.
        Configuration entry = new Configuration();
        entry.setName("address");
        entry.setValue("an_address");
        configForSut.getConfig().add(entry);
        // Construct and return response.
        InitiateResponse response = new InitiateResponse();
        response.setSessionId(sessionId);
        response.getActorConfiguration().add(configForSut);
        return response;
    }

This example assumes a test case with two actors:

    * Actor "Client" that has the role of SUT. This defines an endpoint named "serverAddressInformation" as a placeholder for the configuration to receive.
    * Actor "Server" that is simulated. The messaging service here returns as configuration the address at which the "Client" needs to make calls on. This 
      is set with endpoint name "serverAddressInformation" to match the expected placeholder of the "Client" actor.

The result of this implementation will be twofold:

    * Before the test session starts, the user will be presented the "address" configuration value returned by the simulated "Server" actor. This is done in case the user needs 
      to configure this address in the actual system that will be tested.
    * The "address" configuration value will be subsequently accessible in the test session through the expression ``$Client{Server}{address}``
      (i.e. ``$SUT_ACTOR_ID{SIMULATED_ACTOR_ID}{PARAMETER_NAME}``).

Finally, note that when calling the ``initiate`` operation, the Test Bed passes the configuration properties defined for the other test case actors. These
include properties configured in the test case and also entered by the Test Bed user for the SUT actor. This allows the messaging service implementation to
both consider them before returning its own configuration values and also to record them in the session for subsequent use.
