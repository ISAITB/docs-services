The ``receive`` operation is used by the Test Bed when it needs to receive a message from an external system. In test case terms, this would appear as a
simulated actor receiving a message from a SUT or another simulated actor. The parameters received through the call are:

    * A list of inputs to potentially consider.
    * The name of the "from" actor.
    * The session identifier.
    * A call identifier to identify a thread in case of a test case with parallel threads.

As described earlier the Test Bed receives messages through asynchronous call-backs (see :ref:`messaging__callbacks`). The ``receive`` operation is called by the Test Bed to let the 
service know it is expecting a message and to potentially pass information pertinent to the expected message. Given that messages will be received 
asynchronously, any such information would need to be stored in the relevant session for later use.

One special case of such information is the **call identifier** mentioned above. This is used only when a test case defines a `receive`_ step within 
a `flow`_ step. The `flow`_ step is used to run sequences of test steps in parallel meaning that the Test Bed may be blocked for a message on 
any of the parallel threads. The call identifier provides the means by which the Test Bed can determine the specific `receive`_ step the message refers
to. It is expected to be stored in the session in an appropriate way so that it can be matched when a message is received and provided back to the 
Test Bed. Note that by default, if no call identifier is provided in the call-back, the test session will unblock any and all blocked `receive`_ steps.

Apart from the complexity of handling the call identifier (applicable only if you use `receive`_ within a `flow`_), the ``receive`` operation is 
often left empty:

.. code-block:: java

    public Void receive(ReceiveRequest parameters) {
        /*
         * Before returning you may also want to:
         * - Process and record any inputs (through parameters.getInput())
         * - Record the session ID this "receive" refers to (through parameters.getSessionId())
         * - Record the call ID  if this "receive" is part of a "flow" step's threads (through parameters.getCallId())
         */
        return new Void();
    }

In case you need to process inputs provided you need to follow the common approach of extracting them, verifying them and determining their value 
(see :ref:`common__using_inputs` and :ref:`common__interpreting_input` for details).

.. index:: notifyForMessage

What is important to discuss is the approach through which messages sent by the remote system will be actually received by the messaging service and 
provided back to the Test Bed. This approach is purely domain-specific and is determined by your specific communication protocol. In effect you will 
need within the messaging service to implement the API foreseen by your specifications that your remote system will be calling. Examples of this could 
be a SOAP web service, a REST interface or even a polling approach driven by the messaging service to detect messages delivered to a separate platform.

What is common in all cases is that once a message is received you need to match it against one of your active sessions through appropriate correlation
data that is also domain-specific in nature. Once a match is found you use the call-back address for the Test Bed (typically also stored in the session)
and call its ``notifyForMessage`` operation. See :ref:`messaging__callbacks` for a summary of the steps you need to follow.

The following example (using the `Spring framework`_) illustrates how communication received through a REST service can be processed and transferred to the Test Bed. For
the sake of completeness, this examples also handles call identifiers, even though this is entirely optional if outside the context of a `flow`_ step:

.. code-block:: java

    @RestController
    public class ServiceInputController {

        /** Logger. */
        private static final Logger LOG = LoggerFactory.getLogger(ServiceInputController.class);

        @Autowired
        private SessionManager sessionManager = null;

        @RequestMapping(value = "/input", method = RequestMethod.GET)
        public void receiveMessage(@RequestParam(value="message") String message) {
            // Determine the session ID based on the message's contents.
            String sessionId = determineSessionId(message);
            // Determine the call ID based on the message's contents. Needed only if using "receive" in "flow" steps.
            String callId = determineCallId(message, sessionId);
            // Input for the Test Bed is provided by means of a report.
            TAR notificationReport = createReport(TestResultType.SUCCESS);
            // The report can include any properties and with any nesting (by nesting list of map types). In this case we add a simple string.
            notificationReport.getContext().getItem().add(createAnyContent("receivedContent", message, ValueEmbeddingEnumeration.STRING));
            // Notify the Test Bed.
            notifyTestBed(sessionId, callId, notificationReport);
        }

        private String determineSessionId(String message) {
            // Determine the relevant session ID.
            ...
        }

        private String determineCallId(String message, String sessionId) {
            // Determine the relevant call ID for the session (in case of "receive" within a "flow").
            ...
        }

        private void notifyTestBed(String sessionId, String callId, TAR report){
            String callback = (String)getSessionInfo(sessionId, SessionData.CALLBACK_URL);
            if (callback == null) {
                LOG.warn("Could not find callback URL for session [{}]", sessionId);
            } else {
                try {
                    LOG.info("Notifying Test Bed for session [{}] and call [{}]", sessionId, callId);
                    callTestBed(sessionId, callId, report, callback);
                } catch (Exception e) {
                    LOG.warn("Error while notifying Test Bed for session [{}] and call [{}]", sessionId, callId, e);
                    callTestBed(sessionId, Utils.createReport(TestResultType.FAILURE), callback);
                    throw new IllegalStateException("Unable to call callback URL ["+callback+"] for session ["+sessionId+"] and call ["+callId+"]", e);
                }
            }
        }

        private void callTestBed(String sessionId, String callId, TAR report, String callbackAddress) {
            /*
             * First setup the service client. This is not created once and reused since the address to call
             * is determined dynamically from the WS-Addressing information (passed here as the callback address).
             */
            JaxWsProxyFactoryBean proxyFactoryBean = new JaxWsProxyFactoryBean();
            proxyFactoryBean.setServiceClass(MessagingClient.class);
            proxyFactoryBean.setAddress(callbackAddress);
            MessagingClient serviceProxy = (MessagingClient)proxyFactoryBean.create();
            Client client = ClientProxy.getClient(serviceProxy);
            HTTPConduit httpConduit = (HTTPConduit) client.getConduit();
            httpConduit.getClient().setAutoRedirect(true);
            // Make the call.
            NotifyForMessageRequest request = new NotifyForMessageRequest();
            // Set the session ID to tell the Test Bed which session this refers to.
            request.setSessionId(sessionId);
            // Set the call ID to tell the Test Bed which specific call within the session this refers to (only needed if "flow" steps are used).
            request.setCallId(callId);
            // Set the report with the outcome result and data.
            request.setReport(report);
            serviceProxy.notifyForMessage(request);
        }

Key points for you to consider with respect to this example are:

    * The API implemented by this component has nothing to do with the GITB specifications or the Test Bed. It is an implementation of the API that your remote 
      system is expected to call. The GITB-specific part of the implementation is where it notifies the Test Bed for a given test session.
    * The way to determine the session identifier (and if needed the call identifier) from the received message. For this you will need to determine the appropriate metadata that you will first
      store in the session and then lookup for a match (illustrated here with methods ``determineSessionId()``, ``determineCallId()``).
    * The message received might need processing before being returned to the Test Bed. Consider that you may want to return it as-is but also 
      return e.g. its length, mime types, etc. As another example consider that often when dealing with SOAP content you would want to return the complete envelope
      and also a separate output element containing only the business payload. 

.. note::
    **Session management simplification:** In simple scenarios, typically when the messaging service acts a mock simulator without an actual remote system,
    the session management mechanism can be simplified. In the ``receive`` implementation you may immediately call the ``notifyForMessage``
    operation using the session identifier from the ``receive`` parameters and a pre-configured call-back endpoint address. This removes the need to keep the 
    Test Bed's address information in sessions and potentially sessions altogether. One point to take care of however is to ensure that the ``notifyForMessage``
    call occurs once the ``receive`` call is complete to ensure the Test Bed is expecting a message. One way of achieving this would be with asynchronous
    job scheduling (to allow ``receive`` to complete) with a sufficient execution delay (to ensure the Test Bed is actually waiting for a ``notifyForMessage``
    call).
