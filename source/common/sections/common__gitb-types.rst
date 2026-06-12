The ``gitb-types`` library is a Java library maintained by the Test Bed team and published on `Maven Central <https://search.maven.org/artifact/eu.europa.ec.itb/gitb-types>`_.
It includes the GITB specification resources (its :ref:`XSDs and WSDLs<introduction__specification_links>`) as well as ready-to-use generated classes 
to be used by test developers. Using the library in test services is not mandatory (one can generate their own classes or skip using classes
altogether), but it is typically simpler to reuse it as-is.

Three variants of the library are available for test developers depending on your needs:

* `gitb-types-specs <https://search.maven.org/search?q=a:gitb-types-specs>`_: Contains only the specification XSDs and WSDLs without any class definitions.
* `gitb-types <https://search.maven.org/search?q=a:gitb-types>`_: Defines classes generated from the specifications and annotated using javax APIs for use in Java EE (pre-Jakarta) projects.
* `gitb-types-jakarta <https://search.maven.org/search?q=a:gitb-types-jakarta>`_. Defines classes generated from the specifications annotated using Jakarta APIs for use in Jakarta EE projects.

For your development you would typically use either the ``gitb-types`` or ``gitb-types-jakarta`` library. Which one you choose depends on your 
technology stack and specifically on whether you use JAXB (Java to/from XML conversion) and JAX-WS (Java SOAP services) via the javax (``javax.*``)
or Jakarta (``jakarta.*``) APIs. These are used in annotations in the library's generated classes to allow automated (de)serialisations and service
documentation. The implementations of such APIs are typically defined in the framework you use for web development, and need to remain consistent
across your libraries.

.. note::
    The :ref:`archetypes for template services<templates>` define the ``gitb-types-jakarta`` library as a dependency. Currently the Jakarta API variant
    is used as this aligns with the included version of CXF and Spring Boot.

.. _WS-Addressing: https://www.w3.org/Submission/ws-addressing/
.. _verify: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#verify
.. _process: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#process
.. _send: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#send
.. _receive: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#receive
.. _listen: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#listen
.. _GITB types: https://www.itb.ec.europa.eu/docs/tdl/latest/types/
.. _GITB type: https://www.itb.ec.europa.eu/docs/tdl/latest/types/
.. _GITB TDL expression documentation: https://www.itb.ec.europa.eu/docs/tdl/latest/expressions/
.. _mime type: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
.. _templates: https://www.itb.ec.europa.eu/docs/tdl/latest/expressions/index.html#expressions-and-templates
.. _GITB TDL log step: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#log
.. _expressions: https://www.itb.ec.europa.eu/docs/tdl/latest/expressions/index.html
