Apart from fully implementing the expected web service operations, the validation service needs to correctly publish its service endpoint. Specifically:

  * The name of the service must be "ValidationService".
  * The name of the service port must be "ValidationServicePort".
  * The namespace must be set to "http://www.gitb.com/vs/v1/".

Failure to do so will result in the Test Bed not being able to correctly lookup the endpoint to call. The following example illustrates how this 
could be done in a `Spring`_ implementation using `CXF`_:

.. code-block:: java

    @Configuration
    public class ValidationServiceConfig {
        @Bean
        public Endpoint validationService(Bus cxfBus, ValidationServiceImpl validationServiceImplementation) {
            EndpointImpl endpoint = new EndpointImpl(cxfBus, validationServiceImplementation);
            endpoint.setServiceName(new QName("http://www.gitb.com/vs/v1/", "ValidationService"));
            endpoint.setEndpointName(new QName("http://www.gitb.com/vs/v1/", "ValidationServicePort"));
            endpoint.publish("/validation");
            return endpoint;
        }
    }

.. note::

    **Default service address:** Using the above displayed endpoint mapping, and considering (a) no app context path,
    (b) the default port mapping of 8080, and (c) the default CXF root of ``/services``, the full WSDL address would be:
    ``http://localhost:8080/services/validation?wsdl``
