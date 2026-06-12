Unexpected service errors can be handled in two ways:

    * They can be simply left uncaught, resulting in a SOAP fault.
    * They can be caught and signalled by returning the output ``TAR`` report with result ``TestResultType.FAILURE``.

Both approaches will result in the Test Bed displaying the relevant GITB TDL step as failed. The approach of returning a ``TAR`` report with a ``TestResultType.FAILURE`` result
could be interesting if you want to return additional information regarding the error. This approach is possible for services linked to GITB TDL steps that are visually presented, 
i.e. those of validation and messaging services.

.. _common__logging:

Contributing to test session logs
---------------------------------

Test services, apart from :ref:`returning outputs<common__returning_output>` and :ref:`reports<common__tar>` to test sessions, can also contribute entries 
to their **log outputs**. Each test session generates a log consisting of progress messages that complement its test execution diagram as a means of providing
additional feedback to testers. Logged messages are generated automatically by the Test Bed but can also be explicitly added by means of the 
`GITB TDL log step`_. All messages come with a severity level, ranging from debug and information messages to warnings and errors.

As an alternative or complement to using the `GITB TDL log step`_ you can also have your custom test services contribute log entries. This could be done to 
add additional information on processing taking place within the test service, or to provide feedback to the user in case the test execution
diagram is not sufficient. Contributing log entries is supported for all types of custom test services (:ref:`validation<validation>`, :ref:`messaging<messaging>` and 
:ref:`processing<processing>` services) and is achieved by making a web service call on the **log operation** of the Test Bed's SOAP API.

The **log operation**, is separately defined per type of service but in all cases expects as parameters:

    * The **session ID** for which the log entry is to be added.
    * The **message** to add as a text.
    * The message's severity **level** (``ERROR``, ``WARNING``, ``INFO`` or ``DEBUG``).

It is important to note that the session ID is not necessarily the ID of the test session as defined within the Test Bed, but rather the session ID that the
test service uses to manage its state. Specifically, this is:

    * For :ref:`validation services<validation>` the actual test session ID used in the Test Bed.
    * For :ref:`messaging services<messaging>` the session ID returned with the output of the :ref:`initiate<messaging__operations__initiate>` operation.
    * For :ref:`processing services<processing>` the session ID returned with the output of the :ref:`beginTransaction<processing__operations__beginTransaction>` operation.

This session ID is included in all calls made by the Test Bed to the test service, allowing the test service to use it when making the call to add log entries
to the test session. It is the Test Bed that then maps these session IDs to the test sessions that are to be updated.

Regarding the content log message to add, this is a simple text that will be added as-is to the test session log. It is interesting to note that when using the 
`GITB TDL log step`_ within a test case, you can use `expressions`_ to dynamically produce the log entry, referring for example to variables recorded in the test
session's context. Using similar expressions in logging via test services is not supported. In other words, the provided message is considered as a simple text, 
not as an expression to evaluate.

Finally, it is important to explain how to determine the address of the Test Bed's endpoint that receives log contents. The test service needs to determine this
given that log entries are not communicated as synchronous responses to received Test Bed calls. In fact, log entries should ideally be handled in an asynchronous
manner to avoid blocking the service's main processing (e.g. the validation of inputs for a validation service). The approach followed to determine the Test Bed's
logging endpoint is to use `WS-Addressing`_ whereby the Test Bed includes a specific SOAP header with a reply address whenever it calls the test service. When 
developing the test service you thus have two approaches available to determine the Test Bed's endpoint address:

    * Lookup the `WS-Addressing`_ header and use its value as the endpoint address.
    * Skip the dynamic lookup by simply adding the Test Bed's endpoint address to the service's configuration.

Using `WS-Addressing`_ makes this process transparent and never needs updates for address changes. In addition, it permits the same test service instance to be 
used at the same time by multiple Test Bed instances if this is needed. If you choose to simply define the Test Bed callback address as part of the service's
configuration, you need to ensure that the configured value is the final address to be used by the service, catering for things such as reverse proxies and Docker
container names. Assuming the Test Bed is running without a proxy, on your localhost and with default port mappings (i.e. its a development instance) the default
endpoints are:

    * http://localhost:8080/itbsrv/ValidationClient when called from a validation service.
    * http://localhost:8080/itbsrv/MessagingClient when called from a messaging service.
    * http://localhost:8080/itbsrv/ProcessingClient when called from a processing service.

In case your test service is not of a single service type (e.g. it is used both for validation and messaging, implementing both service APIs) you can use any
of these endpoints to send log messages. You need to make sure however that the endpoint you use corresponds to the operation for which you are adding a log entry
and the session ID communicated as input to that operation. For example, if you want to log something relevant to a validation call you should use the session ID
received in the validation call's inputs and pass it to the Test Bed's endpoint for validation services. Not doing so, e.g. using the validation input's session ID
with the Test Bed's endpoint for messaging services, will most likely result in the log message being ignored due to the target test session not being found.

.. note::
    Using `WS-Addressing`_ to determine the Test Bed's endpoint address is also done when :ref:`messaging services<messaging>` make 
    :ref:`asynchronous callbacks<messaging__callbacks>` to signal received messages to test sessions.

Illustrating the above, the following example considers a processing service for which we log the requested operations of **process** calls. 

.. code-block:: java

    private static final QName REPLY_TO_QNAME = new QName("http://www.w3.org/2005/08/addressing", "ReplyTo");

    @Resource
    private WebServiceContext wsContext;

    public ProcessResponse process(ProcessRequest request) {
        // Log the requested operation in the test session log.
        String message = "Service carrying out " + request.getOperation() + " operation...";
        log(message, LogLevel.INFO, request.getSessionId())
        // Prepare the response.
        ProcessResponse response = new ProcessResponse();
        // ...
        return response;
    }

    private void log(String message, LogLevel level, String sessionId) {
        LogRequest logRequest = new LogRequest();
        logRequest.setSessionId(sessionId);
        logRequest.setMessage(message);
        logRequest.setLevel(level);
        // Use WS Addressing to determine the endpoint address.
        String callbackAddress = getReplyToAddress();
        createClient(callbackAddress).log(logRequest);
    }

    private String getReplyToAddress() {
        List<Header> headers = (List<Header>) wsContext.getMessageContext().get(Header.HEADER_LIST);
        for (Header header: headers) {
            if (header.getName().equals(REPLY_TO_QNAME)) {
                String replyToAddress = ((Element)header.getObject()).getTextContent().trim();
                if (!replyToAddress.toLowerCase().endsWith("?wsdl")) {
                    replyToAddress += "?wsdl";
                }
                return replyToAddress;
            }
        }
        return null;
    }

    private ProcessingClient createClient(String callbackAddress) {
        JaxWsProxyFactoryBean proxyFactoryBean = new JaxWsProxyFactoryBean();
        proxyFactoryBean.setServiceClass(ProcessingClient.class);
        proxyFactoryBean.setAddress(callbackAddress);
        ProcessingClient serviceProxy = (ProcessingClient)proxyFactoryBean.create();
        return serviceProxy;
    }

.. index:: TestSessionIdentifier
.. index:: TestCaseIdentifier
.. index:: TestStepIdentifier
.. index:: TestEngineVersion
.. _common__session_metadata:

Retrieving test session metadata
--------------------------------

Calls made by the Test Bed to test services take place in the context of test sessions. In all service calls the
Test Bed includes metadata on the relevant test session as **SOAP header elements**, making it available to the service
in case this is needed. Information on the test session is included in the SOAP header to avoid overburdening the operations'
inputs, given that test session information is typically not needed in most scenarios.

All metadata elements included in the SOAP header are simple text values and use the namespace ``http://www.gitb.com``.
The included elements are as follows:

* ``TestSessionIdentifier``: The session identifier as defined within the Test Bed. For :ref:`messaging<messaging>` 
  and :ref:`processing<processing>` services, this will likely differ from the session identifier included as input in
  operations given that the value of this is generated by the service itself.
* ``TestCaseIdentifier``: The identifier of the test case that relates to the test session that can serve to
  uniquely identify the test case in its test suite. Note that across test suites and specifications, this identifier
  is not guaranteed to be unique.
* ``TestStepIdentifier``: The value of the ``id`` attribute of the test step that triggered the service call (e.g. the 
  `verify step <https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#verify>`_ that resulted in a 
  :ref:`validation service's<validation>` :ref:`validate<validation__operations__validate>` call). 
* ``TestEngineVersion``: The version number of the test engine, matching the version number of the `GITB TDL <https://www.itb.ec.europa.eu/docs/tdl/latest/>`_
  and the GITB test services' APIs.

.. note::
    The ``TestStepIdentifier`` is not present in service calls occurring outside the scope of a test step. This is the case for a
    :ref:`messaging service's<messaging>` :ref:`initiate<messaging__operations__initiate>` and :ref:`finalize<messaging__operations__finalize>` operations,
    or for all services' :ref:`getModuleDefinition<messaging__operations__getModuleDefinition>` operation.

The use cases for such metadata are varied. For example using the ``TestSessionIdentifier`` could be interesting for
logging purposes if you would want to match the identifiers used within the Test Bed itself. On the other hand using 
the ``TestCaseIdentifier`` and ``TestStepIdentifier`` could prove useful if your service uses them to determine the
operations to carry out (e.g. a data generation template defined as a resource within the test service).

To illustrate how this information is passed in service calls, consider the following sample payload of a messaging service's
:ref:`receive<messaging__operations__receive>` operation. The highlighted section corresponds to the included test session metadata:

.. code-block:: xml
    :emphasize-lines: 9-12

    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header>
        <Action xmlns="http://www.w3.org/2005/08/addressing">http://gitb.com/MessagingService/receive</Action>
        <MessageID xmlns="http://www.w3.org/2005/08/addressing">urn:uuid:6884ceea-80fd-4566-9317-9848ff8e68c4</MessageID>
        <To xmlns="http://www.w3.org/2005/08/addressing">http://localhost:8001/oop/services/messaging</To>
        <ReplyTo xmlns="http://www.w3.org/2005/08/addressing">
            <Address>http://localhost:8080/itbsrv/MessagingClient</Address>
        </ReplyTo>
        <gitb:TestSessionIdentifier xmlns:gitb="http://www.gitb.com">0f8f5da0-3a6b-4adb-9b5a-c5383c000178</gitb:TestSessionIdentifier>
        <gitb:TestCaseIdentifier xmlns:gitb="http://www.gitb.com">testCase1</gitb:TestCaseIdentifier>
        <gitb:TestStepIdentifier xmlns:gitb="http://www.gitb.com">receiveMessage1</gitb:TestStepIdentifier>
        <gitb:TestEngineVersion xmlns:gitb="http://www.gitb.com">1.18.1</gitb:TestEngineVersion>
    </soap:Header>
    <soap:Body>
        <ns4:ReceiveRequest xmlns:ns2="http://www.gitb.com/core/v1/" xmlns:ns3="http://www.gitb.com/tr/v1/" xmlns:ns4="http://www.gitb.com/ms/v1/">
        <sessionId>9ff2d8e1-fc5e-4892-a711-05bdc42238f7</sessionId>
        <callId>5b69d251-06d2-4e28-afc8-7c54a0c9c89a</callId>
        <input embeddingMethod="STRING" name="inputMessage" type="string">
            <ns2:value>Input text</ns2:value>
        </input>
        </ns4:ReceiveRequest>
    </soap:Body>
    </soap:Envelope>

How this information is accessed within your test service depends on the language and framework used to implement the given test service.
If using the `Spring Framework <https://spring.io/projects/spring-framework>`_ as the other code samples here, you would extend the class
implementing your service's operations as as follows:

.. code-block:: java

    @Component
    public class MessagingServiceImpl implements MessagingService {

        private static final QName TEST_STEP_ID_QNAME = new QName("http://www.gitb.com", "TestStepIdentifier", "gitb");
        private static final QName TEST_SESSION_ID_QNAME = new QName("http://www.gitb.com", "TestSessionIdentifier", "gitb");
        private static final QName TEST_CASE_ID_QNAME = new QName("http://www.gitb.com", "TestCaseIdentifier", "gitb");
        private static final QName TEST_ENGINE_VERSION_QNAME = new QName("http://www.gitb.com", "TestEngineVersion", "gitb");

        @Resource
        private WebServiceContext wsContext;

        /**
        * Extract a value from the SOAP headers.
        * 
        * @param name The name of the header to locate.
        * @param valueExtractor The function used to extract the data.
        * @return The extracted data.
        * @param <T> The type of data extracted.
        */
        private <T> T getHeaderValue(QName name, Function<Header, T> valueExtractor) {
            return ((List<Header>) wsContext.getMessageContext().get(Header.HEADER_LIST))
                    .stream()
                    .filter(header -> name.equals(header.getName())).findFirst()
                    .map(valueExtractor).orElse(null);
        }

        /**
        * Get the specified header element as a string.
        * 
        * @param name The name of the header element to lookup.
        * @return The text value of the element.
        */
        private String getHeaderAsString(QName name) {
            return getHeaderValue(name, (header) -> ((Element) header.getObject()).getTextContent().trim());
        }

        @Override
        public SendResponse send(SendRequest parameters) {
            // Log the session's metadata relevant to this service call.
            LOG.info("Called send from test session {}. Test case is {} and step is {}.",
                getHeaderAsString(TEST_SESSION_ID_QNAME),
                getHeaderAsString(TEST_CASE_ID_QNAME),
                getHeaderAsString(TEST_STEP_ID_QNAME)
            );
            // Proceed with the operation's implementation.
            ...
        }

    }

.. note::
    **Accessing metadata within test cases:** The Test Bed also makes accessible test session metadata directly in test cases.
    The test session identifier, test case identifier and test engine version can also be
    `accessed through the test session context <https://www.itb.ec.europa.eu/docs/tdl/latest/expressions/index.html#accessing-test-session-metadata>`_.
