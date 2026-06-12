The ``TAR`` report (short for "Test Assertion Report") is a class used to return the result of processing along with a "success" or 
"failure" indication. This is used:

    * By validation services to return the validation result from the :ref:`validation__operations__validate` operation (the GITB TDL `verify`_ step).
    * By messaging services to return output from the :ref:`messaging__operations__send` operation (the GITB TDL `send`_ step) as well as the asynchronously returned 
      content relevant to the `receive`_ and `listen`_ steps, returned to the Test Bed through the ``notifyForMessage`` call-back operation
      (see :ref:`messaging__callbacks`).
    * By processing services to return a "success" or "failure" status from the :ref:`processing__operations__process` operation (the GITB TDL `process`_ step).

The information included in the ``TAR`` report can be split in three main sections:

    * The ``context``, where arbitrary data can be added to be returned to the Test Bed.
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
    **Highlighting a report item's location in the Test Bed:** When displaying a `verify`_ step's result, the GITB Test Bed leverages the ``location`` property of a 
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

    public AnyContent createAnyContent(String name, String value, ValueEmbeddingEnumeration embeddingMethod) {
        AnyContent input = new AnyContent();
        input.setName(name);
        input.setValue(value);
        input.setType("string");
        input.setEmbeddingMethod(embeddingMethod);
        return input;
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

In this example we pass back the message received to the Test Bed along with an overall "success" result and timestamp. The test session will show the corresponding GITB TDL step 
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
