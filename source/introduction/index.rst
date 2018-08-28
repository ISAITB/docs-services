Introduction
============

The purpose of the current documentation is to explain the purpose of GITB test services and to help creating
your own. The goal is to provide you both with a comprehensive reference but also with an easy to follow guide
to get started.
 
What are the GITB service specifications?
-----------------------------------------

The `GITB project`_ represents a CEN standardisation initiative funded by the European Commission’s DG GROW 
to provide the specifications for a generic interoperability test bed and their implementation in the form 
of the GITB test bed software. The focus of these specifications and software is not any kind of testing 
(e.g. performance, regression, penetration) but rather conformance and interoperability testing. Simply
put, *conformance testing* verifies that the requirements of a given specification are met, whereas
*interoperability testing* comes as a second step to verify that two or more parties can interact as expected.
Furthermore, the focus here is on technical specifications related to e.g. messaging protocols or content,
whereas the parties previously mentioned would typically be software components.

A key element of the GITB specifications is the set of **GITB test service APIs**. These are SOAP web service
interfaces (defined using WSDLs and XSDs) that allow extension of the core GITB test bed software by means of
decoupled components that offer domain-specific capabilities. Such capabilities may be specific to a given 
project's testing needs and are not offered by the test bed out of the box, such as the handling of a custom 
communication protocol or the validation of arbitrary content. The purpose of the GITB test service APIs is to 
define a common interface between such components and the test bed so that they can interact in a consistent 
manner as part of test cases.

Currently three types of services are defined:

  * **Validation services:** Used to validate content and produce a validation report.
  * **Messaging services:** Used to send and receive content to and from the test bed using an arbitrary communication protocol.
  * **Processing services:** Used as utility functions to process input and produce output.

.. _GITB project: http://www.cen.eu/work/areas/ict/ebusiness/pages/ws-gitb.aspx

Where are they used?
~~~~~~~~~~~~~~~~~~~~

The GITB test services are primarily used by the GITB test bed software (or another test bed implementation that uses its 
specifications) to extend its capabilities.

Keep in mind however that these test services are simply SOAP web services that use a specific API. As such, they could be
used independently of the test bed by any SOAP client; the use of consistent APIs serves in this case to allow service
calls to be consistent and share the same semantics. In practice, messaging and processing services are not typically
used in a standalone manner as they are really focused on making additional capabilities available to test sessions. However,
validation services, given also the simplicity of the involved API, are good candidates for independent use. It is often
the case that validation services are used as part of unit testing processes.

How are they maintained?
~~~~~~~~~~~~~~~~~~~~~~~~

Following the initial work from the CEN GITB workgroup, the maintenance and evolution of GITB specifications has been taken over 
by the European Commission, specifically the `Interoperability Test Bed Action`_ of DIGIT ISA. The Action foresees the 
maintenance of the GITB software and specification based on the needs of the testing community and carries out evolutive
maintenance with regular releases. Regarding the GITB test service specifications, effort is made to always introduce changes 
in a backwards-compatible manner, adding capabilities rather than changing existing ones. Releases of the GITB service specifications 
and its version numbers currently follow the versioning of the GITB software.

.. _Interoperability Test Bed Action: https://joinup.ec.europa.eu/solution/interoperability-test-bed/about

Core concepts
-------------

Before diving into GITB service specifications it is important to be aware of certain core concepts.

.. index:: Test case

Test case
~~~~~~~~~

A **test case** represents a set of steps and assertions that form a cohesive scenario for testing purposes. 
These are captured as as a single XML file authored using `GITB TDL`_ constructs.

.. _GITB TDL: https://www.itb.ec.europa.eu/docs/tdl/latest/

.. index:: Test suite

Test suite
~~~~~~~~~~

A **test suite** is used to group together related test cases into a cohesive set. A test suite can include
metadata such a name and description that provide useful context to understand the purpose of its contained
tests. A test suite is expressed as an XML file and is bundled in a ZIP archive along with its contained 
test cases and the resources they use.

.. index:: Test session

Test session
~~~~~~~~~~~~

A **test session** represents a single execution of a test case. It typically involves the provision of
configuration from the user starting the test, goes through the steps the test case foresees and eventually
completes providing the session's overall result.

.. index:: Test session context
.. index:: Session context

Test session context
~~~~~~~~~~~~~~~~~~~~

The **test session context** can be considered a persistent store specific to a given test session that is used to record
values. These values can either be configuration parameters provided before the test session starts, configuration parameters
generated during the test session's initiation, or values that are added dynamically during the session as a result of the 
ongoing test steps. The test session context is very important in that it gives a level of control above individual test 
steps that allow the testing of complete conversations. In addition, its ability to store and lookup arbitrary content dynamically
makes it possible to implement complex flows and control logic.

The test session context can be viewed as a map or keys to values, where each key is a string identifier and the value can be 
any type supported by GITB, including additional nested maps.

.. index:: Actor
.. index:: SUT (System Under Test)

Actor
~~~~~

An **actor**, from the perspective of GITB, represents a party involved in the overall process that the test cases
aim to test. What exactly is an actor depends fully on the tests or the specification they relate to. Here are
some examples:

* A specification that foresees sending a message from one party to another could define a "Sender" and "Receiver" 
  actor to represent the involved parties.
* A solution that foresees a central EU portal exchanging information with national endpoints could define the "Portal" 
  and "National endpoint" as actors.
* A content specification (e.g. XML-based) for which we simply want to allow users to upload samples for validation 
  could define a "User" actor to represent this role in test cases.

Once actors are defined they play an important role in the testing process as follows:

* They define properties relevant to the testing (think of them as actor-specific configuration elements). Such properties
  are grouped into **endpoints**, named configuration sets that can be referenced in test cases.
* Each test case foresees that actors are either simulated by the test bed or are the focus of the test. In the latter case
  they are referred to as having a role of **SUT** (System Under Test).

.. index:: Messaging handlers
.. _introduction-concepts-messaging-handlers:

Service handlers
~~~~~~~~~~~~~~~~

**Service handlers** are effectively synonymous to the GITB test services. They represent from the perspective of a given test case
the implementation to carry out specific validation, messaging or processing steps. The distinction here is that the implementation of 
these handlers could also be a component, embedded within the test bed software itself, that implements the same operations but is 
called locally. Such embedded implementations are of course limited to truly generic capabilities that are commonly required.

More information on service handlers and embedded ones in particular can be looked up in the `GITB TDL documentation`_.

.. _GITB TDL documentation: https://www.itb.ec.europa.eu/docs/tdl/latest/handlers/

Test service architecture
-------------------------

A good way of better understanding how GITB test services are used is to consider the test bed as a *test-oriented Enterprise Service Bus (ESB)*. 
This is illustrated in the following diagram:

.. figure:: SOA.png
  :align: center

  Use of test services by the test bed

Testers use the test bed through its user interface to lookup and execute one or more test cases. These test cases are authored in the GITB TDL [REF]
and capture the testing logic as a set of steps, certain of which may need to perform actions that are not natively supported by the test bed. 
In such a case the test case developer may specify as the handler implementation of a validation [REF], messaging [REF] or processing [REF] step 
the URL to a WSDL file for a corresponding test service. When the test case is executed, local operations are replaced with SOAP web service
calls.

Decoupled test services are ideally suited in bringing domain-specific logic to the test bed and also in extending its capabilities without impacting its operation.
Simply put, if you need to perform some arbitrary processing on content and then validate it in a specific way, you can setup this in services that the test bed can 
immediately start using. The test bed acts as an orchestrator of service calls and other test case steps, following the description laid out in the GITB TDL test case
it is executing. In addition, it adds the test session context as an overarching concept that can brings meaning and a persistent conversional state to otherwise 
atomic service calls: you can process content in one step, save the result in the test session context, and then several steps later you can retrieve it to use for
further processing, messaging of validation. In short responsibilities are split as follows:

* The **test bed** manages users, specifications, tests, reporting and orchestration of test case steps in a consistent manner.
* **Test services** extend the test bed on-the-fly with domain-specific capabilities.

Specification links
-------------------

The following table provides the links to access the latest version of the GITB specifications. These include the WSDLs for 
messaging, processing and validation services as well as the XSDs for all GITB type definitions.

.. csv-table::
  :header: "Specification", "Description", "Link"

  GITB core elements, The XSD defining core elements used in other GITB XSDs, https://www.itb.ec.europa.eu/specs/latest/gitb_core.xsd
  GITB test description language (TDL), The XSD defining the types used when defining TDL test suites and test cases, https://www.itb.ec.europa.eu/specs/latest/gitb_tdl.xsd
  GITB test presentation language (TPL), The XSD defining types used to report on the status of a test session, https://www.itb.ec.europa.eu/specs/latest/gitb_tpl.xsd
  GITB test reporting language (TRL), The XSD defining the types used to report step output, https://www.itb.ec.europa.eu/specs/latest/gitb_tr.xsd
  GITB messaging service API, The WSDL defining messaging service operations, https://www.itb.ec.europa.eu/specs/latest/gitb_ms.wsdl
  GITB messaging service types, The XSD defining the messaging service message types, https://www.itb.ec.europa.eu/specs/latest/gitb_ms.xsd
  GITB validation service API, The WSDL defining validation service operations, https://www.itb.ec.europa.eu/specs/latest/gitb_vs.wsdl
  GITB validation service types, The XSD defining the validation service message types, https://www.itb.ec.europa.eu/specs/latest/gitb_vs.xsd
  GITB processing service API, The WSDL defining processing service operations, https://www.itb.ec.europa.eu/specs/latest/gitb_ps.wsdl
  GITB processing service types, The XSD defining the processing service message types, https://www.itb.ec.europa.eu/specs/latest/gitb_ps.xsd
  GITB test bed service API, The WSDL defining test bed service operations, https://www.itb.ec.europa.eu/specs/latest/gitb_tbs.wsdl
  GITB test bed service types, The XSD defining the test bed service message types, https://www.itb.ec.europa.eu/specs/latest/gitb_tbs.xsd

The complete set of latest GITB specifications can be downloaded from https://www.itb.ec.europa.eu/specs/latest/gitb_all.zip.

The final GITB workgroup report can be downloaded here [:download:`CEN_WS_GITB3_CWA_Final.pdf`].