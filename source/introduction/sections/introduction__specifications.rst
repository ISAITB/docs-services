The `GITB project`_ represents a CEN standardisation initiative funded by the European Commission’s DG GROW 
to provide the specifications for a generic interoperability Test Bed and their implementation in the form 
of the GITB Test Bed software. The focus of these specifications and software is not any kind of testing 
(e.g. performance, regression, penetration) but rather conformance and interoperability testing. Simply
put, *conformance testing* verifies that the requirements of a given specification are met, whereas
*interoperability testing* comes as a second step to verify that two or more parties can interact as expected.
Furthermore, the focus here is on technical specifications related to e.g. messaging protocols or content,
whereas the parties previously mentioned would typically be software components.

A key element of the GITB specifications is the set of **GITB test service APIs**. These are SOAP web service
interfaces (defined using WSDLs and XSDs) that allow extension of the core GITB Test Bed software by means of
decoupled components that offer domain-specific capabilities. Such capabilities may be specific to a given 
project's testing needs and would not be offered by the Test Bed out of the box, such as the handling of a custom 
communication protocol or the validation of arbitrary content. The purpose of the GITB test service APIs is to 
define a common interface between such components and the Test Bed so that they can interact in a consistent 
manner as part of test cases.

Currently three types of services are defined:

  * **Validation services:** Used to validate content and produce a validation report.
  * **Messaging services:** Used to send and receive content to and from the Test Bed using an arbitrary communication protocol.
  * **Processing services:** Used as utility functions to process input and produce output.

.. note::
    **GITB-compliant service:** A service implemented to conform to a GITB test service API may also be referred to as a
    *GITB-compliant service* of the specific type. For example, if the service in question implements the GITB validation 
    service API it would be termed a *GITB-compliant validation service*.

.. _introduction__specifications__usage:

Where are they used?
~~~~~~~~~~~~~~~~~~~~

The short answer is that the GITB test services are used by the GITB Test Bed software (or another Test Bed implementation 
based on its specifications) to extend its capabilities.

Keep in mind however that these test services are simply SOAP web services that use a specific API. As such, they could be
used independently of the Test Bed by any SOAP client; the use of a common API serves in this case to allow service
calls to be consistent and share the same semantics. In practice, messaging and processing services are not typically
used in a standalone manner as they are really focused on making additional capabilities available to test sessions. Validation 
services however, given also the simplicity of the involved API, are good candidates for independent use. It is often
the case that validation services are used as part of unit testing processes.

.. _introduction__specifications__maintenance:

How are they maintained?
~~~~~~~~~~~~~~~~~~~~~~~~

Following the initial work from the CEN GITB workgroup, the maintenance and evolution of the GITB specifications has been taken over 
by the European Commission, specifically the `Interoperability Test Bed Team`_ of DIGIT B.2. DIGIT B.2 maintains the GITB software
and specifications based on the needs of the testing community and carries out evolutive
maintenance with regular releases. Regarding the GITB test service specifications, effort is made to always introduce changes 
in a backwards-compatible manner, adding capabilities rather than changing existing ones. Releases of the GITB service specifications 
and their version numbers currently follow the releases and versioning of the GITB software.
