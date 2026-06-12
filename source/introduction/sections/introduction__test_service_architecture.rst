A good way of better understanding how GITB test services are used is to consider the Test Bed as a *test-oriented Enterprise Service Bus (ESB)*. 
This is illustrated in the following diagram:

.. figure:: SOA.png
  :align: center
  :figclass: no-bottom-margin

  Use of test services by the Test Bed

Testers use the Test Bed through its user interface to lookup and execute one or more test cases. These test cases are authored in the `GITB TDL`_
and capture the testing logic as a sequence of steps, certain of which may need validation, processing or messaging that is not natively supported by 
the Test Bed. The test case developer may delegate the implementation of such a step to an external service that implements the relevant interface by
providing the service's WSDL file address as the value for the step's ``handler`` attribute.

.. code-block:: xml

    <!--
      Validation using an embedded validation handler.
      Lookup "StringValidator" as an embedded validator component within the Test Bed.
    -->
    <verify handler="StringValidator" desc="Check string">
        <input name="actualstring">$aString</input>
        <input name="expectedstring">'expected_string'</input>
    </verify>
    <!--
      Validation using a remote validation handler.
      Lookup the validator as a remote SOAP web service based on its WSDL file.
    -->
    <verify handler="https://SERVICE_ADDRESS?WSDL" desc="Validate content">
        <input name="contentToValidate">$content</input>
    </verify>

From the test case's perspective there is no difference between an embedded and remote handler apart from the value for the ``handler`` attribute.
The actions to prepare, call, and post-process the relevant step (`verify`_ in the above example) are identical. The only difference is 
that the Test Bed, when executing the step, calls the same method signatures replacing what would be local method invocations with remote SOAP web 
service calls.

Decoupled test services are ideally suited to bring domain-specific logic to the Test Bed and also to extend its capabilities without impacting its operation.
Simply put, if you need to perform arbitrary processing on content and then validate it in a specific way, you can set this up in services that the Test Bed can 
immediately start using. The Test Bed acts as the orchestrator of service calls and other test case steps, following the description laid out in the GITB TDL test case
it is executing. In addition, it adds the test session context as an overarching construct that brings meaning and a persistent conversional state to otherwise 
one-off service calls: you can process content in one step, save the result in the test session context, and then several steps later you can retrieve it to use for
further processing, messaging of validation. In short:

  * The **Test Bed** executes test sessions, orchestrates service calls and adds context over steps.
  * **Test services** add new capabilities on-the-fly to cover domain-specific needs.
