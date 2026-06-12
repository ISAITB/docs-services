Use of a processing service in a test case is achieved with the `process`_ step. In case the service foresees transactions, the `process`_ step
will be complemented by the `bptxn`_ and `eptxn`_ steps to start or stop respectively a processing transaction. The following example illustrates
use of a transaction-aware processing service to read a ZIP archive:

.. code-block:: xml

    <!--
        Create a processing transaction named "t1".
    -->
    <bptxn txnId="t1" handler="https://ZIP_PROCESSING_SERVICE?wsdl"/>
    <!-- 
        Call the "initialize" operation to pass the archive to the service.
        The service handler can read and cache the archive for the transaction.
    -->
    <process id="init" txnId="t1">
        <operation>initialize</operation>
        <input name="zip">$zipContent</input>
    </process>
    <!-- 
        Call the "checkExists" operation to see if a given entry exists.
    -->
    <process id="exists" txnId="t1">
        <operation>checkExists</operation>
        <input name="path">'file1.xml'</input>
    </process>
    <!-- 
        Call the "extract" operation to get an entry.
    -->
    <process id="output" txnId="t1">
        <operation>extract</operation>
        <input name="path">'file1.xml'</input>
    </process>
    <!--
        End the transaction.
        The service handler can remove the archive.
    -->
    <eptxn txnId="t1"/>

In terms of mapping GITB TDL steps to service calls the following take place:

  #. The `bptxn`_ step results in constructing a client for the service based on the WSDL provided through the ``handler`` attribute. The 
     :ref:`processing__operations__beginTransaction` operation is subsequently called to create a new processing transaction/session.
  #. The `process`_ steps each trigger a :ref:`processing__operations__process` operation call, passing each time the operation name as well as the expected inputs.
     The output of each call is stored in the test session context using the step's ``id`` value as a reference key.
  #. The `eptxn`_ step results in the :ref:`processing__operations__endTransaction` operation to be called to clean-up the service's session state.

In case your processing service **is stateless** you have no need for the `bptxn`_ and `eptxn`_ steps, neither for the ``txnId`` attribute
on the `process`_ step. In this case however you will need to set directly on the step the ``handler`` implementation. The following example illustrates use 
of a stateless service to perform string manipulations:

.. code-block:: xml

    <!-- Call the processing service without a transaction. -->
    <process id="lowercaseStep" handler="https://ZIP_PROCESSING_SERVICE?wsdl">
        <operation>lowercase</operation>
        <input name="input">$aString</input>
    </process>
    <!-- Access the result. We assume here that the relevant result is named "output". -->
    <log>$lowercaseStep{output}</log>

In the examples listed above you see that the `process`_ step foresees the relevant operation and inputs to be provided by means of child elements. An alternative
to this is to make use of attributes which reduce the amount of XML you need to write for simple operations. Specifically:

    * You can use the ``operation`` attribute instead of the similarly named element to identify the operation to perform.
    * You can use the ``input`` attribute in case your service defines a single input or, in case of multiple inputs, defines a single *required* input.

Considering the use of attributes we can revisit our last example to illustrate a less verbose but otherwise identical call:

.. code-block:: xml

    <!-- Call the processing service without a transaction. -->
    <process id="lowercaseStep" handler="https://ZIP_PROCESSING_SERVICE?wsdl" operation="lowercase" input="$aString"/>
    <!-- Access the result. We assume here that the service's result is named "output". -->
    <log>$lowercaseStep{output}</log>

.. note::
    **Processing outputs:** Check :ref:`common__using_output` for details on how to leverage your service's outputs.

.. _processing__using_test_case__visible_context:

Returning context information for visible process steps
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When used in test cases via the `process`_ step, the service's operation would typically be part of internal processing that would not be
presented to users. It could nonetheless be interesting to make certain processing steps visible in case sharing their output would provide
useful information to the user. This is possible by defining in the relevant `process`_ step the ``hidden`` attribute as ``false`` (it's
considered by default as ``true``).

.. code-block:: xml

    <!--
        The process step will be visible given that "hidden" is set to false. Note how in this case we also specify
        a description ("desc") to be displayed for the step.
    -->
    <process id="output" hidden="false" desc="Process the input file" handler="$DOMAIN{processingServiceAddress}">
        <input name="path">$inputFile</input>
    </process>

By default when a `process`_ step is made visible it will display as its output the step's overall result (e.g. "SUCCESS")
alongside the processing date/time. You can extend this information with any arbitrary data added as *context* to the
returned report. For example you could return the service's inputs and outputs but also any other information that would be useful.

Returning such additional information is done by :ref:`adding context data to the TAR report<common__returning_output>`. The following
example adds to the service's report a text value corresponding to the service's output:

.. code-block:: java

    public ProcessResponse process(ProcessRequest processRequest) {
        ProcessResponse response = new ProcessResponse();
        // Carry out the service's processing ...
        String outputValue = ...;
        AnyContent output = createAnyContent("output", outputValue, ValueEmbeddingEnumeration.STRING);
        // Add the output to the service's output data.
        response.getOutput().add(output);
        response.setReport(createReport(TestResultType.SUCCESS));
        // Add also to the resulting report for display purposes.
        response.getReport().getContext().getItem().add(output)
        // Return the result.
        return response;
    }

Notice that the output value to return (wrapped in ``output`` in the example) is added both to the response's *output* as well as its
*report*. The output is the actual data that will be recorded and used in the test session. The report's context on the other hand is
not subsequently used, except for the purpose of being displayed to the user. As you are developing the service you have full flexibility
to display the service's output to users (i.e. replicating it in the report's context) or return any information you consider appropriate.
