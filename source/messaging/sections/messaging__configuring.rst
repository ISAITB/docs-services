Apart from implementing the expected web service operations, the messaging service needs to correctly publish its service endpoint. Specifically:

  * The name of the service must be "MessagingServiceService".
  * The name of the service port must be "MessagingServicePort".
  * The namespace must be set to "http://www.gitb.com/ms/v1/".

Failure to do so will result in the Test Bed not being able to correctly lookup the endpoint to call. The following example illustrates how this 
could be done in a `Spring`_ implementation using `CXF`_:

.. code-block:: java

    @Configuration
    public class MessagingServiceConfig {
        @Bean
        public Endpoint messagingService(Bus cxfBus, MessagingServiceImpl messagingServiceImplementation) {
            EndpointImpl endpoint = new EndpointImpl(cxfBus, messagingServiceImplementation);
            endpoint.setServiceName(new QName("http://www.gitb.com/ms/v1/", "MessagingServiceService"));
            endpoint.setEndpointName(new QName("http://www.gitb.com/ms/v1/", "MessagingServicePort"));
            endpoint.publish("/messaging");
            return endpoint;
        }
    }

.. note::

    **Default service address:** Using the above displayed endpoint mapping, and considering (a) no app context path,
    (b) the default port mapping of 8080, and (c) the default CXF root of ``/services``, the full WSDL address would be:
    ``http://localhost:8080/services/messaging?wsdl``
