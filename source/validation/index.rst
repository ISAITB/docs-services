.. _validation:

Validation services
===================

**GITB validation services** are used to validate input and produce a validation report. They are arguably the simplest type
of test service given their specific use which is reflected in the limited operations such a service needs to implement. 
Considering their focus on validation and the simplicity of their API, validation services are also easily used as standalone
services for one-off validation calls.

.. _validation__implementing:

Implementing the service
------------------------

.. include:: /validation/sections/validation__implementing.rst

.. index:: getModuleDefinition (Validation)
.. _validation__operations__getModuleDefinition:

getModuleDefinition
~~~~~~~~~~~~~~~~~~~

.. include:: /validation/sections/validation__operations__getModuleDefinition.rst

.. index:: TAR
.. index:: validate
.. _validation__operations__validate:

validate
~~~~~~~~

.. include:: /validation/sections/validation__operations__validate.rst

.. _validation__configuring:

Configuring the web service endpoint
------------------------------------

.. include:: /validation/sections/validation__configuring.rst

.. _validation__using_test_case:

Using the service through a test case
-------------------------------------

.. include:: /validation/sections/validation__using_test_case.rst

.. _validation__using_standalone:

Using the service standalone
----------------------------

.. include:: /validation/sections/validation__using_standalone.rst
