The chapters that follow this introduction provide details for each service type, specifically on their purpose, concepts, implementation and use:

  * :ref:`validation` to validate arbitrary content.
  * :ref:`messaging` to send and receive messages or simulate communication.
  * :ref:`processing` to process input and produce output.

The :ref:`common` chapter complements the above by documenting common concepts that are shared across all service types. Finally, the :ref:`templates` chapter 
provides information on the available templates that facilitate the creation of new service instances and serve as rich working examples.

.. note::
    **Code samples:** The code samples included in this documentation are written in `Java`_ and use the `Spring framework`_, with web service 
    implementations specifically using `Apache CXF`_. Moreover, the available :ref:`templates` are themselves designed as `Spring Boot`_ 
    applications, based on the same technology stack.

    This design choice reflects a popular Industry approach but is by no means binding. You may choose to use the development framework and language 
    of your choice as long as it supports the implementation of SOAP web services.

.. _Java: https://www.java.com
.. _Spring framework: https://spring.io/
.. _Apache CXF: https://cxf.apache.org/
.. _Spring Boot: https://spring.io/projects/spring-boot
.. _GITB project: http://www.cen.eu/work/areas/ict/ebusiness/pages/ws-gitb.aspx
.. _Interoperability Test Bed Team: https://joinup.ec.europa.eu/solution/interoperability-test-bed/about
.. _GITB TDL: https://www.itb.ec.europa.eu/docs/tdl/latest/
.. _GITB TDL documentation: https://www.itb.ec.europa.eu/docs/tdl/latest/handlers/
.. _domain management: https://www.itb.ec.europa.eu/docs/itb-ca/latest/domainDashboard/
.. _community management: https://www.itb.ec.europa.eu/docs/itb-ca/latest/communityDashboard/
.. _available TDL constructs: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/
.. _embedded service handlers: https://www.itb.ec.europa.eu/docs/tdl/latest/handlers/index.html#embedded-handlers
.. _SoapMessaging: https://www.itb.ec.europa.eu/docs/tdl/latest/handlers/index.html#soapmessaging
.. _XSDValidator: https://www.itb.ec.europa.eu/docs/tdl/latest/handlers/index.html#xsdvalidator
.. _SchematronValidator: https://www.itb.ec.europa.eu/docs/tdl/latest/handlers/index.html#schematronvalidator
.. _verify: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#verify
.. _XML validation guide: https://www.itb.ec.europa.eu/docs/guides/latest/validatingXML/
