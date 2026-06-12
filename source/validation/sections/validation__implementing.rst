A GITB validation service is a web application that at least exposes a web service implementing the `GITB validation service API`_.
The easiest way to get up and running is to use the template validation service available as a Maven Archetype (see :ref:`templates`).

Once you have answered the prompts you will have a fully functioning GITB validation service implemented using the `Spring Boot`_ framework
that you can adapt to your specific needs. Alternatively of course you can implement the service from scratch in any way and technology stack you prefer.
In this case a very useful resource is the ``gitb-types`` library that includes classes for all GITB types, service interfaces and service clients. This 
is available on `Maven Central`_ and can be added as a Maven dependency as follows:

.. code-block:: xml

  <dependency>
      <groupId>eu.europa.ec.itb</groupId>
      <artifactId>gitb-types-jakarta</artifactId>
      <version>1.29.4</version>
  </dependency>

.. note::

  The ``gitb-types`` library is also available in a variant with classes using the Javax APIs. See :ref:`common__gitb-types` for details.

Check the :ref:`templates` description for more details on the content and use of the sample validation service. In terms of its initial definition,
a validation service needs to be defined as an implementation of the ``com.gitb.vs.ValidationService`` interface:

.. code-block:: java

    @Component
    public class ValidationServiceImpl implements com.gitb.vs.ValidationService {
        ...
    }

The :ref:`following sections <validation__operations>` cover the service's operations, whereas as the final step you will also need to
:ref:`register the service endpoint <validation__configuring>` as part of your configuration.

.. _validation__operations:

Service operations
------------------

.. note::
    **Service WSDLs and XSDs:** The WSDL and XSD for validation services are listed in the :ref:`specification reference section<introduction__specification_links>`.

The following figure illustrates the operations that a validation service needs to implement and their use by the Test Bed.

.. figure:: ValidationService.png
  :align: center
  :figclass: no-bottom-margin

  Use of the validation service operations
