.. _processing:

Processing services
===================

**GITB processing services** are used to extend the capabilities of the Test Bed with domain-specific processing functions.
If a utility function is needed that is not supported natively or is too complex to realise with existing GITB TDL 
constructs, you can add it to the Test Bed on-the-fly by means of a processing service. Their purpose is to receive inputs and produce outputs
through one or more defined operations.

Processing services foresee the definition of **processing transactions**, which can be considered as potentially long-running
conversations that provide context to individual operations. These transactions allow processing services to maintain state relevant to 
a given session through which they can build upon previous work or implement important performance benefits. As an example consider a 
processing service used to selectively retrieve the contents of a ZIP archive. If each interaction with the service was isolated, the 
full ZIP archive would need to be passed to the service with each call and the service implementation would need to extract and read it
for every file access. By maintaining state with processing transactions the service can be provided with the ZIP archive as part of one
operation and then reuse it when looking up individual files. The processing service API foresees appropriate lifecycle operations to signal 
the creation of a new transaction and the finalisation of an existing one (for e.g. clean-up purposes).

Note that support for transactions is **optional** and in cases where it is not needed can be fully skipped. This would be interesting for 
processing actions that are inherently stateless, such as utility functions to generate or manipulate data where each operation is independent. 

The above description mentions the concept of **processing operations**. This is the way in which processing services organise
their work, by defining a set of supported operations, each with distinct inputs and outputs, that form a cohesive whole. You may thus consider
a processing service as a utility library of related operations that can be called as part of a specific transaction (when state is important) or independently. 
Continuing the previous example of a ZIP archive processing service, potential operations could be "initialise" to pass the archive to process, "checkExists" to check if a 
given file exists (but not actually return it), "extract" to lookup and return a file, and "printContents" to return a representation of the archive's contents. 
For an operation to take place a processing transaction must first be established although whether this is actually handled within the service to 
manage session state is up to you.

.. note::
    **Displaying processing steps:** Processing operations used in GITB TDL test cases are by default hidden as they are considered internal
    actions. You may however choose to make such a step visible and return custom information for display to users. See :ref:`processing__using_test_case__visible_context`
    for more details.

.. _processing__implementing:

Implementing the service
------------------------

.. include:: /processing/sections/processing__implementing.rst

.. index:: ProcessingOperation
.. index:: getModuleDefinition (Processing)
.. _processing__operations__getModuleDefinition:

getModuleDefinition
~~~~~~~~~~~~~~~~~~~

.. include:: /processing/sections/processing__operations__getModuleDefinition.rst

.. index:: beginTransaction (Processing)
.. _processing__operations__beginTransaction:

beginTransaction
~~~~~~~~~~~~~~~~

.. include:: /processing/sections/processing__operations__beginTransaction.rst

.. index:: process
.. _processing__operations__process:

process
~~~~~~~

.. include:: /processing/sections/processing__operations__process.rst

.. index:: endTransaction (Processing)
.. _processing__operations__endTransaction:

endTransaction
~~~~~~~~~~~~~~

.. include:: /processing/sections/processing__operations__endTransaction.rst

.. _processing__configuring:

Configuring the web service endpoint
------------------------------------

.. include:: /processing/sections/processing__configuring.rst

.. _processing__using_test_case:

Using the service through a test case
-------------------------------------

.. include:: /processing/sections/processing__using_test_case.rst

.. _processing__using_standalone:

Using the service standalone
----------------------------

.. include:: /processing/sections/processing__using_standalone.rst
