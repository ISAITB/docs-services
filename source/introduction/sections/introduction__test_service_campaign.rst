To better understand how test services fit within the Test Bed it is useful to consider how they would be approached as part of the overall setup of a project's 
testing campaign. From a high-level perspective, setting up the conformance testing for a project would involve the following steps:

  #. Create and customise the project's domain, specification(s) and community in the Test Bed (see the `domain management`_ and `community management`_ user guide sections for details).
  #. Determine what the project's users are expected to test for. This will help identify the specification actors and notably the actors to be simulated and 
     the one(s) representing the System Under Test (SUT).
  #. Determine the overall structure of test cases (e.g. what messaging is involved, what is validated), the different types of test cases (e.g. tests where the SUT
     sends messages versus tests where it receives them) and their organisation in test suites.
  #. Check the existing capabilities of the Test Bed and the GITB TDL (by consulting the `available TDL constructs`_ and `embedded service handlers`_) to see if all identified testing needs can be covered.
  #. Address missing capabilities by designing GITB-compliant test services. Implement and test these services to ensure they fully match the project's testing needs and
     actual specifications.
  #. Develop the GITB TDL test cases making use of the implemented test services and deploy them to the Test Bed in appropriate test suites.
  #. Create organisation accounts for the project's users to begin testing.

It is important to consider test services as a tool rather than a requirement. The fact that a project foresees the exchange of messages between different parties does not
mean that it needs a custom-built messaging service. If your project uses an already supported messaging protocol such as SOAP web service calls where a `SoapMessaging`_
messaging handler would be used then you don't need to implement your own. Similarly if your validation needs are limited to e.g. XML validation, you could use
the existing `XSDValidator`_ and `SchematronValidator`_ in validation steps.

A similar argument could however also be made in the other direction. Even if an existing embedded service handler is available, you could opt to implement a custom replacement
if it facilitates testing for you and your users. As an example consider validation of XML content that includes validation against a XSD file and separate
validations against multiple Schematron files. Using existing embedded validators you would need to add multiple `verify`_ steps to your test case: one for the XSD
validation and one per Schematron file. You could choose to replace these with a single custom validator that would display a single validation step to your users and allow
easier updating of the validation artefacts through the single centralised service.

.. note::
    **XML validation:** Given the frequent need of validating XML content using XSDs and Schematrons (and the frequent mistakes that come up in custom validator implementations),
    the Test Bed offers an existing GITB-compliant XML validation service that can be easily setup to cover your needs. More information on setting up this service and a
    comparison with the embedded `XSDValidator`_ and `SchematronValidator`_ are available in the Test Bed's `XML validation guide`_.
