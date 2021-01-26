.. _common:

Common service concepts
=======================

The available test service types (validation, messaging and processing) differ significantly on their purpose and use. Nonetheless they share certain common 
concepts that make their use by the test bed consistent. The following points summarise the high-level concepts that are common across service types:

* All services are **triggered by test bed calls** that are captured with appropriate GITB TDL steps.
* A service is identified by setting in the test case its **WSDL URL in a handler attribute**.
* All services are capable of receiving **input** in the form of parameters and configuration and returning arbitrary **output**.
* All service APIs foresee a ``getModuleDefinition`` operation that is used to **document the services' use**, notably how to call them and what they return.
* All services can be called **through the test bed** or **directly via a SOAP web service client**.
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

The ``getModuleDefinition`` operation of each service is used to primarily define the inputs the service expects as well as its outputs. Of these, defining 
the input parameters is of most importance as this determines how the service should be called and, in case it is called by the test bed, serves to proactively
check for missing required input. The following example illustrates a service where two inputs are defined:

.. code-block:: java

    public GetModuleDefinitionResponse getModuleDefinition(Void parameters) {
        GetModuleDefinitionResponse response = new GetModuleDefinitionResponse();
        response.setModule(new MessagingModule());
        ...
        response.getModule().setInputs(new TypedParameters());
        response.getModule().getInputs().getParam().add(createParameter("messageToSend", "string", UsageEnumeration.O, ConfigurationType.SIMPLE, "The message to send."));
        response.getModule().getInputs().getParam().add(createParameter("confirmationCode", "string", UsageEnumeration.O, ConfigurationType.SIMPLE, "The received confirmation code."));
        return response;
    }

    private TypedParameter createParameter(String name, String type, UsageEnumeration use, ConfigurationType kind, String description) {
        TypedParameter parameter =  new TypedParameter();
        parameter.setName(name);
        parameter.setType(type);
        parameter.setUse(use);
        parameter.setKind(kind);
        parameter.setDesc(description);
        return parameter;
    }

Parameters are defined using the ``TypedParameter`` class which in the example is created using a helper method (``createParameter()``). The information needed to define
a parameter is summarised in the following table.

.. csv-table::
    :header: "Property", "Description"

    name, The name of the parameter. This will be used to identify it both when calling via the test bed as well as in standalone calls.
    type, The type of the parameter corresponding to one of the `GITB types`_ that can be used in test cases.
    use, Whether or not the parameter is required (``UsageEnumeration.R``) or optional (``UsageEnumeration.O``).
    kind, The way in which the input parameter is configured. This can always be set to ``ConfigurationType.SIMPLE``.
    desc, The description of the parameter to be displayed in the result of a ``getModuleDefinition`` call.

Finally, note that output parameters may also be defined in ``getModuleDefinition`` using the same construct. This however is purely done for documentation purposes as there is
no automatic type checking or verification. Unless you want to fully document a service's outputs you can skip their definition.

.. note::
    **Defining list inputs:** When defining an input of type ``list`` a good practice is to also specify the expected contained type (i.e. the type of its elements).
    Do this by setting the type of the input in the ``getModuleDefinition`` response using the form ``list[string]`` rather than ``list`` (which however also works).

.. index:: ValueEmbeddingEnumeration
.. index:: AnyContent
.. _common__using_inputs:

Using inputs
------------

All service types expect inputs to be passed to them. Inputs are used in the following operations:

  * Operation :ref:`validation__operations__validate` of validation services.
  * Operations :ref:`messaging__operations__send` and :ref:`messaging__operations__receive` of messaging services.
  * Operation :ref:`processing__operations__process` of processing services.

In each case inputs are received as a ``List`` of ``AnyContent`` objects. The ``AnyContent`` class provides a representation of the passed input including the 
metadata needed to determine its value. It includes the following properties:

.. csv-table::
    :header: "Property", "Description"
    :delim: ~

    name~ The name of the input, matching the documented name from the ``getModuleDefinition`` operation.
    value~ The value of the input as a ``String`` in case this is a simple input (not a ``map`` or a ``list``).
    embeddingMethod~ The way to process the value property (``ValueEmbeddingEnumeration.STRING``, ``ValueEmbeddingEnumeration.BASE64`` or ``ValueEmbeddingEnumeration.URI``).
    type~ The `GITB type`_ that corresponds to this input value.
    encoding~ The encoding to consider in case the value is a BASE64 string representing bytes.
    item~ A nested ``List`` of ``AnyContent`` objects in case this input is a ``map`` or a ``list``.

As you see, regarding ``list`` and ``map`` types, the ``value`` property is empty, giving place to the ``item`` which contains the list of contained values. In case of
a ``map`` the contained ``AnyContent`` objects' ``name`` property corresponds to their ``map`` key value. No ``name`` is present for the objects of a ``list``. Note that
``map`` objects may contain further ``list`` and ``map`` objects at an arbitrary depth using the approach explained. This structure is reflected when 
calling a service with ``map`` or ``list`` inputs in a standalone manner (i.e. using a SOAP client) as illustrated in the following example.

.. code-block:: xml

  <?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.gitb.com/vs/v1/" xmlns:v11="http://www.gitb.com/core/v1/">
    <soapenv:Header/>
    <soapenv:Body>
        <v1:ValidateRequest>
          <sessionId>12345</sessionId>
          <!-- A simple string input. -->
          <input name="aSimpleInput" embeddingMethod="STRING">
            <v11:value>a_value</v11:value>
          </input>
          <!-- A list input containing two strings. -->
          <input name="aListInput">
            <v11:item embeddingMethod="STRING">
                <v11:value>value1</v11:value>
            </v11:item>
            <v11:item embeddingMethod="STRING">
                <v11:value>value2</v11:value>
            </v11:item>
          </input>
          <!-- 
            A map input containins a string for key "key1" and a nested map for key "key2".
            The nested map contains a single string entry under key "SubKey1".
          -->
          <input name="aMapInput">
            <v11:item name="key1" embeddingMethod="STRING">
                <v11:value>value1</v11:value>
            </v11:item>
            <v11:item name="key2">
                <v11:item name="Subkey1">
                    <v11:value>subValue2</v11:value>
                </v11:item>
            </v11:item>
          </input>
        </v1:ValidateRequest>
    </soapenv:Body>
  </soapenv:Envelope>

.. index:: AnyContent
.. index:: ValueEmbeddingEnumeration
.. _common__interpreting_input:

Interpreting an input value
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The value of a simple input (i.e. not a ``list`` or ``map``) is provided through the ``value`` property of its ``AnyContent`` object. In order to determine how 
this value should be considered you need to make use of the ``embeddingMethod`` (enumeration ``ValueEmbeddingEnumeration``) and ``encoding`` properties as follows:

    * ``STRING``: The input to consider is the ``value`` property as-is. It is already directly provided.
    * ``BASE64``: The ``value`` property is a sequence of bytes provided as an escaped BASE64 string. This needs to be decoded to retrieve the actual byte content.
    * ``URI``: The ``value`` property is a reference to a remote resource that is provided as a URI. This needs to be looked up to obtain the actual input to process.

In both the ``BASE64`` and ``URI`` cases the ``encoding`` property should be used to determine how to consider the input's bytes when converting to a character stream.
The default encoding if none is provided is assumed to be UTF-8.

.. note::
    **Simplified input handling:** Supporting all types of embedding methods increases the usage flexibility of your service. In cases where this is not necessary you 
    can of course simply assume the use of a single embedding method for an input and process it accordingly. If for example you are defining a validation service with 
    one input for the content and another for the type of validation to perform you may always assume that the content is provided as ``BASE64`` whereas the validation type 
    is always a ``STRING``. If you choose to do so make sure you document this appropriately in the inputs' description in the ``getModuleDefinition`` operation. If you 
    don't specify this it may be assumed that the input in question may be provided using any of the supported embedding methods.

.. index:: ValueEmbeddingEnumeration
.. index:: TAR
.. index:: AnyContent
.. _common__returning_output:

Returning outputs
-----------------

All services are used to return outputs to the test session that is calling them. Specifically:

  * Validation services return a validation report from their :ref:`validation__operations__validate` operation that may contain an arbitrary set of outputs as its context (see :ref:`common__tar`).
  * Processing services receive input and produce output through their :ref:`processing__operations__process` operation.
  * Messaging services return output in the case of the :ref:`messaging__operations__send` operation for any information that is useful to report (e.g. the message sent, a synchronous response).
    The :ref:`messaging__operations__receive` operation does not return output itself but received content is returned to the test bed asynchronously through the ``notifyForMessage`` call-back (see :ref:`messaging__callbacks`).

Service outputs are provided using the same ``AnyContent`` class used to process inputs (see :ref:`common__using_inputs`). In the case of processing services this is a ``List`` of ``AnyContent``
objects that is provided directly on the ``ProcessResponse`` class, whereas for messaging and validation services ``AnyContent`` objects are passed through the ``TAR``
report's ``context`` property (see :ref:`common__tar`).

The most flexible way of returning output is by defining a first ``AnyContent`` object of type ``map``. This acts as a root under which you can add additional arbitrary named 
values with one or more outputs you want to return. Moreover, this map can contain nested ``AnyContent`` objects of type ``list`` or ``map`` allowing you to organise and group outputs
as you wish. Constructing each ``AnyContent`` object follows the same principles in terms of e.g. values and embedding methods as described in the case of inputs (see :ref:`common__using_inputs`).

The following example illustrates the construction of a complex output structure, including a simple output string and a ``map`` with two properties:

.. code-block:: java

    // Create output parameter named "output1" which a simple string value.
    AnyContent output1 = new AnyContent();
    output1.setName("output1");
    output1.setValue("A value");
    output1.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Create a first string property named "property1".
    AnyContent output2Property1 = new AnyContent();
    output2Property1.setName("property1");
    output2Property1.setValue("Value1");
    output2Property1.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Create a second string property named "property2".
    AnyContent output2Property2 = new AnyContent();
    output2Property2.setName("property2");
    output2Property2.setValue("Value2");
    output2Property2.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Add the "property1" and "property2" values under a map named "output2".
    AnyContent output2 = new AnyContent();
    output2.setName("output2");
    output2.getItem().add(output2Property1);
    output2.getItem().add(output2Property2);

    // Add both the "output1" and "output2" properties as top-level output items.
    AnyContent output = new AnyContent();
    output.getItem().add(output1);
    output.getItem().add(output2);

    // Construct the TAR report and set the outputs as the report's context.
    TAR report = new TAR();
    report.setContext(output);

Note that the final part of this example (setting the report's context) applies to validation and messaging services. In the case of processing services, the 
``output`` object would be set directly on the ``ProcessResponse`` class.

.. note::
    **Validation service outputs:** When used in GITB test cases, the output of validation services will by default not be recorded
    in the test session context (recording only a ``boolean`` flag instead). To have additional output recorded you would need to set
    the optional ``output`` property (see :ref:`validation__using_test_case__output` for details).

.. _common__using_output:

Using service outputs in a test session
---------------------------------------

The previous section deals with the implementation needed on the side of the service to return one or more output values. The current section deals with how
these output values can be used in the calling test session. In terms of usable output:

    * The output values of processing and messaging services can be fully leveraged in the test session after the relevant service call.
    * The output values of a validation service are used only for display purposes. What can be leveraged is the service's true/false validation outcome.

In all cases a service call's output is stored in the test session context, with a key value that matches the corresponding 
test case step's ``id`` attribute. Specifically:

    * **Validation services:** The overall true/false validation result of the `verify`_ step is stored as a ``boolean`` value.
    * **Processing services:** The output of the `process`_ step is stored as a ``map``.
    * **Messaging services:** The output of the `send`_, `receive`_ and `listen`_ steps is stored as a ``map``.

The following code sample illustrates a case where a file is received through a messaging service, processed through a processing service and then validated
using a validation service:

.. code-block:: xml

    ...
    <!-- Receive the file. -->
    <receive id="receiveOutput" desc="Receive file" from="Sender" to="Receiver" txnId="mt1"/>
    <!-- Process the file using the "convert" operation. -->
    <process id="processOutput" txnId="pt1">
        <operation>convert</operation>
        <input name="inputFile">$receiveOutput{data}</input>
    </process>
    <!-- Validated the converted file. -->
    <verify handler="..." desc="Validate file">
        <input name="inputFile" embeddingMethod="BASE64">$processOutput{convertedData}</input>
    </verify>
    ...

In this example the `receive`_ step results in the test bed being notified by the relevant messaging service. This service has returned as output a ``map`` with one 
element named "data" that contains the file bytes. Given that the `receive`_ step has an ``id`` of "receiveOutput" the test session context now includes a key
with this value that refers to the returned output. In the subsequent `process`_ step the file content is referred to with the ``$receiveOutput{data}`` expression (see 
the `GITB TDL expression documentation`_ for details) when this is passed as the "inputFile" input of the "convert" operation. The result of the `process`_ step, in this case a ``map``
with a key "convertedData" pointing to the converted bytes, is stored in the test session context under key "processOutput" (the ``id`` of the `process`_ step). Finally, 
this converted data is used in the `verify`_ step where using the expression ``$processOutput{convertedData}`` it is passed as the expected "inputFile" input.

.. index:: TestResultType
.. index:: TAR
.. index:: BAR
.. index:: ObjectFactory 
.. index:: TestAssertionReportType
.. index:: JAXBElement<TestAssertionReportType>
.. _common__tar:

Constructing a validation report (TAR)
--------------------------------------

The ``TAR`` report (short for "Test Assertion Report") is a class used to return the result of processing along with a "success" or 
"failure" indication. This is used:

    * By validation services to return the validation result from the :ref:`validation__operations__validate` operation (the GITB TDL `verify`_ step).
    * By messaging services to return output from the :ref:`messaging__operations__send` operation (the GITB TDL `send`_ step) as well as the asynchronously returned 
      content relevant to the `receive`_ and `listen`_ steps, returned to the test bed through the ``notifyForMessage`` call-back operation
      (see :ref:`messaging__callbacks`).
    * By processing services to return a "success" or "failure" status from the :ref:`processing__operations__process` operation (the GITB TDL `process`_ step).

The information included in the ``TAR`` report can be split in three main sections:

    * The ``context``, where arbitrary data can be added to be returned to the test bed.
    * The ``reports``, containing individual items for errors, warnings and information messages (if applicable).
    * The general information on the report's ``date``, overall ``result`` and report ``counters`` (the latter if applicable).

The following table documents each of these properties:

.. csv-table::
    :header: "Property", "Description"
    :delim: ~

    counters.nrOfAssertions~ The number of information-level findings resulting from a validation.
    counters.nrOfWarnings~ The number of warning-level findings resulting from a validation.
    counters.nrOfErrors~ The number of error-level findings resulting from a validation. If at least one such finding exists the overall report should be marked as failed.
    reports.infoOrWarningOrError~ A ``List`` of ``JAXBElement<TestAssertionReportType>`` objects, one per validation finding. In total these must match the sum of ``nrOfAssertions``, ``nrOfWarnings`` and ``nrOfErrors``.
    context~ A ``AnyContent`` object that can be set to return arbitrary output to the caller (see :ref:`common__returning_output`).
    date~ The timestamp of the report's creation.
    result~ The overall result of the service call which can be ``TestResultType.SUCCESS``, ``TestResultType.WARNING``, ``TestResultType.FAILURE`` or ``TestResultType.UNDEFINED``.

Overall when creating a ``TAR`` instance the properties you must always populate are the ``date`` and ``result``. The ``result`` may at first inspection seem applicable only to
validation services, however it is useful also in the case of messaging and processing services as it allows an error to be immediately signalled. An example of this
could be a failure in the communication between a messaging service and a remote system which can be caught, reported as a result of type ``TestResultType.FAILURE``
and further documented using values returned in the ``context`` property.

For validation services, the ``infoOrWarningOrError`` list is of special importance as it presents to users the detailed validation results, along with the corresponding 
summary counters in the ``nrOfAssertions``, ``nrOfWarnings`` and ``nrOfErrors`` properties. Constructing each element of the ``infoOrWarningOrError`` list is achieved by:

    #. Creating the report item's content as an instance of class ``BAR``.
    #. Creating a wrapper for this instance using the GITB JAXB ``ObjectFactory`` that identifies it as an info, warning or error message:

        * ``objectFactory.createTestAssertionGroupReportsTypeInfo()`` for information messages.
        * ``objectFactory.createTestAssertionGroupReportsTypeWarning()`` for warning messages.
        * ``objectFactory.createTestAssertionGroupReportsTypeError()`` for error messages.

When constructing the ``BAR`` instance for a report item you can set the properties as defined in the following table:

.. csv-table::
    :header: "Property", "Required?", "Description"

    description, yes, The message to display in the report as the report item's description.
    test, no, The test that resulted in this report item (e.g. a regular expression or a Schematron assertion).
    location, no, An indication of the relevant location in the validated content to highlight in relation to the report item. This is an arbitrary text that should make sense to the validation client.

.. note::
    **Highlighting a report item's location in the test bed:** When displaying a `verify`_ step's result, the GITB test bed leverages the ``location`` property of a 
    report item to open a code editor at the specified location with the relevant message displayed in-lined. This is possible for text-based validated content, for which 
    you need to do the following:

        #. Include the content to highlight (typically the validation input) as a property in the ``TAR`` report's ``context`` with a given name (e.g. "INPUT").
        #. Set the report item's ``location`` property with a string of the format "NAME:LINE:COLUMN" where "NAME" is the name of the report's context item, "LINE" is the line number and "COLUMN" is the column.
           Setting this for example to "INPUT:100:0" will link to line 100 of the "INPUT" content.

The following code sample provides an example populating a report for a validation service's :ref:`validation__operations__validate` output:

.. code-block:: java

    private TAR createValidationReport(List<String> errorMessages, String validatedContent) throws Exception {
        TAR report = new TAR();
        // Add the current timestamp to the report.
        GregorianCalendar calendar = new GregorianCalendar();
        report.setDate(DatatypeFactory.newInstance().newXMLGregorianCalendar(calendar));
        // Add the detailed report items.
        report.setReports(new TestAssertionGroupReportsType());
        for (String errorMessage: errorMessages) {
            BAR itemContent = new BAR();
            itemContent.setDescription(errorMessage);
            report.getReports().getInfoOrWarningOrError().add(objectFactory.createTestAssertionGroupReportsTypeError(itemContent));
        }
        // Add the report item counters.
        report.setCounters(new ValidationCounters());
        report.getCounters().setNrOfAssertions(BigInteger.valueOf(0));
        report.getCounters().setNrOfWarnings(BigInteger.valueOf(0));
        report.getCounters().setNrOfErrors(BigInteger.valueOf(errorMessages.size()));
        // Add the input received in the report's context to be reported back to the client.
        report.setContext(new AnyContent());
        report.getContext().getItem().add(createAnyContent("INPUT", validatedContent, ValueEmbeddingEnumeration.STRING));
        // Determine the overall result to report based on the validation results.
        if (errorMessages.isEmpty()) {
            report.setResult(TestResultType.FAILURE);
        } else {
            report.setResult(TestResultType.SUCCESS);
        }
        return report;
    }

This method would be called in a validation service to create a ``TAR`` object to return from the :ref:`validation__operations__validate` operation. The method is assumed to be called
after validation has taken place in order to build the report. Only error messages are considered for simplicity whereas the report items included contain the minimum description.
Note how the validated content is also returned in the report's ``context``. This is not required but provides an example of how arbitrary data can be returned. Moreover, this would
be especially useful if each error item also included its relevant ``location``.

This example shows construction of the report after the actual validation has taken place. Decoupling domain-specific logic (i.e. the validation) from GITB-related code is a
good practice as the GITB service API may only be one facade of many. In practice however it could be more tricky to achieve as report construction is often done in parallel to the validation
(e.g. via error listener constructs). Whether you choose to enforce a full decoupling of domain-specific code from GITB code is a design choice you will need to make.

To present a simpler case of report construction you can consider the following example from a messaging service:

.. code-block:: java

    private TAR createNotificationReport(String receivedContent) throws Exception {
        TAR report = new TAR();
        // Set the step result.
        report.setResult(TestResultType.SUCCESS);
        // Set the date.
        report.setDate(DatatypeFactory.newInstance().newXMLGregorianCalendar(new GregorianCalendar()));
        // Add the received content to the report's context to return it.
        report.setContext(new AnyContent());
        AnyContent messageOutput = new AnyContent();
        messageOutput.setName("MESSAGE");
        messageOutput.setValue(receivedContent);
        messageOutput.setEmbeddingMethod(embeddingMethod);
        report.getContext().getItem().add(messageOutput);
        return report;
    }

In this example we pass back the message received to the test bed along with an overall "success" result and timestamp. The test session will show the corresponding GITB TDL step 
as successful and will expose the received content in the test session context for subsequent use (see :ref:`common__using_output` for details).

Finally, the simplest kind of report is the one returned from reporting services as in this case the report itself is not used to return output. In this case the only requirements
for the report are to complete its ``result`` and ``date``.

.. code-block:: java

    private TAR createProcessingReport() throws Exception {
        TAR report = new TAR();
        // Set the step result.
        report.setResult(TestResultType.SUCCESS);
        // Set the date.
        report.setDate(DatatypeFactory.newInstance().newXMLGregorianCalendar(new GregorianCalendar()));
        return report;
    }

.. index:: TestResultType
.. _common__errors:

Reporting service errors
------------------------

Unexpected service errors can be handled in two ways:

    * They can be simply left uncaught, resulting in a SOAP fault.
    * They can be caught and signalled by returning the output ``TAR`` report with result ``TestResultType.FAILURE``.

Both approaches will result in the test bed displaying the relevant GITB TDL step as failed. The approach of returning a ``TAR`` report with a ``TestResultType.FAILURE`` result
could be interesting if you want to return additional information regarding the error. This approach is possible for services linked to GITB TDL steps that are visually presented, 
i.e. those of validation and messaging services.

.. _verify: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#verify
.. _process: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#process
.. _send: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#send
.. _receive: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#receive
.. _listen: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#listen
.. _GITB types: https://www.itb.ec.europa.eu/docs/tdl/latest/types/
.. _GITB type: https://www.itb.ec.europa.eu/docs/tdl/latest/types/
.. _GITB TDL expression documentation: https://www.itb.ec.europa.eu/docs/tdl/latest/expressions/