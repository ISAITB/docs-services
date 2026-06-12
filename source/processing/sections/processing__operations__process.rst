The ``process`` operation represents the core of any processing service as it is where its processing is triggered. Although processing logic is domain-specific,
all implementations follow a common sequence of steps:

    #. Retrieve and validate the name of the operation to execute.
    #. [Optional] Retrieve the session identifier to lookup existing session information.
    #. Verify the received operation's inputs to ensure processing can proceed.
    #. Extract the values of the inputs.
    #. Execute the operation.
    #. [Optional] Update the session's state with new information.
    #. [Optional] Enrich the produced status report with additional context information.
    #. Return the result including the status report and produced outputs.

These steps are illustrated in the following code example:

.. code-block:: java

    public ProcessResponse process(ProcessRequest processRequest) {
        // Retrieve the operation's input.
        List<AnyContent> input = getInput(processRequest.getInput(), "INPUT");
        if (input.size() != 1) {
            throw new IllegalArgumentException("No input provided");
        }
        // Extract the input's value.
        String inputValue = getInputValue(input);
        // Retrieve the name of the operation to execute.
        String operation = processRequest.getOperation();
        String result;
        // Execute the operation. Could also be decoupled in a separate component.
        switch (operation) {
            case "uppercase":
                result = inputValue.toUpperCase();
                break;
            case "lowercase":
                result = inputValue.toLowerCase();
                break;
            default:
                // Fail for an unknown operation name.
                throw new IllegalArgumentException(String.format("Unexpected operation [%s]. Expected [%s] or [%s].", operation, "uppercase", "lowercase"));
        }
        ProcessResponse response = new ProcessResponse();
        // Construct a successful status report.
        response.setReport(createReport(TestResultType.SUCCESS));
        // Return the result.
        response.getOutput().add(createAnyContent("OUTPUT", result, ValueEmbeddingEnumeration.STRING));
        return response;
    }

The above example illustrates key steps that are taking place but decouples certain actions into separate methods. These are specifically:

  * The extraction of the input parameter in method ``getInput()``. Multiple input parameters may be present including ones with the same name. See :ref:`common__using_inputs` on
    what you should consider when looking up your inputs.
  * The retrieval of the input value(s) to process in method ``getInputValue()``. An input parameter offers a string value that may initially seem to be the 
    one to use. This however could be BASE64 content or a remote URL that points to the actual content. See :ref:`common__interpreting_input` on what you should consider when retrieving 
    an input's value.
  * The generation of the ``TAR`` status report in method ``createReport()``. For details on how the report should be created check :ref:`common__tar`.
    This report can be used to also :ref:`include context information<processing__using_test_case__visible_context>` that will be presented to users when 
    :ref:`using the service through a test case<processing__using_test_case>`.
  * The generation of the output parameter using method ``createAnyContent()``. For details on how output values are represented check :ref:`common__returning_output`.

Another point to consider from this example is that the actual processing operations (simple string manipulations in this case) are taking place within the
implementation of the ``process`` operation. A cleaner approach for non-trivial cases would be to decouple the processing into a separate component that is not
aware of the GITB service API or constructs, especially considering that the GITB service API may be only one of the service's available interfaces. This is a
design choice that you will need to consider when implementing your processing service.

In case session state is meaningful for your service the ``process`` operation would be the place you would be leveraging it. As an example consider the 
previously mentioned ZIP archive processing service. From a high-level perspective an implementation of this could be as follows:

.. code-block:: java

    public ProcessResponse process(ProcessRequest processRequest) {
        // Get the name of the operation to execute.
        String operation = processRequest.getOperation();
        // Get the current session's ID.
        String sessionId = processRequest.getSessionId();
        ProcessResponse response = new ProcessResponse();
        switch (operation) {
            case "initialise":
                /*
                 * In the "initialise" operation we only receive and cache the archive's bytes.
                 */
                // Extract the archive's bytes from the operation's inputs.
                byte[] archiveBytes = getInput("archive", processRequest);
                // Store the reference to the archive in the session's state.
                sessionManager.set(sessionId, "archive", archiveBytes);
                break;
            case "extract":
                /*
                 * In the "extract" operation we receive the file path to extract but not the full archive.
                 * This operation may be called multiple times.
                 */
                // Extract the value of the file path input parameter.
                String filePath = getInput("filePath", processRequest);
                // Lookup the archive from the session's state and read it using a separate component.
                byte[] fileBytes = zipReader.read(filePath, sessionManager.get(sessionId, "archive"));
                // Add the file's bytes as BASE64 content in the output.
                response.getOutput().add(createAnyContent("FILE", fileBytes, ValueEmbeddingEnumeration.BASE64));
                break;
            default:
                // Fail for an unknown operation name.
                throw new IllegalArgumentException(String.format("Unexpected operation [%s]. Expected [%s] or [%s].", operation, "initialise", "extract"));
        }
        // Construct a successful status report.
        response.setReport(createReport(TestResultType.SUCCESS));
        // Return the result.
        return response;
    }

Parts of this implementation are abstracted (e.g. the session management details, the reading of ZIP entries through a ``zipReader`` component) but the use of 
sessions should be clear. Basically in each ``process`` call you receive the session identifier that you can leverage to associate different calls and to cache shared
state. Finally, note that in such a session-aware service it would be important to have a correct implementation of the :ref:`processing__operations__endTransaction` operation to correctly
clear obsolete state.
