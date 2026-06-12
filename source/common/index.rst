.. _common:

Common service concepts
=======================

The available test service types (validation, messaging and processing) differ significantly on their purpose and use. Nonetheless they share certain common 
concepts that make their use by the Test Bed consistent. The following points summarise the high-level concepts that are common across service types:

* All services are **triggered by Test Bed calls** that are captured with appropriate GITB TDL steps.
* A service is identified by setting in the test case its **WSDL URL in a handler attribute**.
* All services are capable of receiving **input** in the form of parameters and configuration and returning arbitrary **output**.
* All service APIs foresee a ``getModuleDefinition`` operation that is used to **document the services' use**, notably how to call them and what they return.
* All services can be called **through the Test Bed** or **directly via a SOAP web service client**.
* Services are **web applications** that can be as simple or as complicated as needed.
* **Template services** exist per case to facilitate service development (see :ref:`templates`).

The sub-sections that follow address additional common concerns of a more detailed nature.

.. index:: UsageEnumeration
.. index:: ConfigurationType
.. index:: getModuleDefinition
.. index:: TypedParameter
.. _common__documenting_input_output:

Documenting input and output parameters 
---------------------------------------

.. include:: /common/sections/common__documenting_input_output.rst

.. index:: ValueEmbeddingEnumeration
.. index:: AnyContent
.. _common__using_inputs:

Using inputs
------------

.. include:: /common/sections/common__using_inputs.rst

.. index:: ValueEmbeddingEnumeration
.. index:: TAR
.. index:: AnyContent
.. _common__returning_output:

Returning outputs
-----------------

.. include:: /common/sections/common__returning_output.rst

.. _common__using_output:

Using service outputs in a test session
---------------------------------------

.. include:: /common/sections/common__using_output.rst

.. index:: TestResultType
.. index:: TAR
.. index:: BAR
.. index:: ObjectFactory 
.. index:: TestAssertionReportType
.. index:: JAXBElement<TestAssertionReportType>
.. _common__tar:

Constructing a validation report (TAR)
--------------------------------------

.. include:: /common/sections/common__tar.rst

.. index:: TestResultType
.. _common__errors:

Reporting service errors
------------------------

.. include:: /common/sections/common__errors.rst

.. index:: gitb-types
.. index:: gitb-types-jakarta
.. index:: gitb-types-specs
.. index:: jakarta
.. index:: javax
.. index:: jaxb
.. index:: jaxws

.. _common__gitb-types:

Using the gitb-types library
----------------------------

.. include:: /common/sections/common__gitb-types.rst
