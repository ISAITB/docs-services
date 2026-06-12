The ``validate`` operation is used to carry out the validation that this service is meant to perform. The specific validation logic is 
entirely domain-specific, however all ``validate`` implementations follow a common sequence of steps:

  #. Verify the received inputs to ensure validation can proceed.
  #. Extract the values of the inputs.
  #. Run the validation.
  #. Construct the validation report (also adding custom output values to its context if desired).
  #. Return the result.

These steps are illustrated in the following code example:

.. code-block:: java

    public ValidationResponse validate(ValidateRequest parameters) {
        // First extract the parameters and check to see if they are as expected.
        List<AnyContent> input = getInput(parameters);
        if (input.size() != 1) {
            throw new IllegalArgumentException(String.format("This service expects one input to be provided named '%s'", INPUT1_NAME));
        }
        // Retrieve the value to process.
        String inputValue = getInputValue(input);
        // Validate the input and construct the report.
        TAR validationReport = doValidation(inputValue);
        // Return the result.
        ValidationResponse result = new ValidationResponse();
        result.setReport(validationReport);
        return result;
    }

The above example illustrates the key steps that are taking place but decouples certain actions into separate methods. These are specifically:

  * The extraction of the input parameter in method ``getInput()``. Multiple input parameters may be present including ones with the same name. See :ref:`common__using_inputs` on
    what you should consider when looking up your inputs.
  * The retrieval of the input value(s) to process in method ``getInputValue()``. An input parameter offers a string value that may initially seem to be the 
    one to use. This however could be BASE64 content or a remote URL that points to the actual content. See :ref:`common__interpreting_input` on what you should consider when retrieving 
    an input's value.
  * The validation and generation of the report in method ``doValidation()``. This method captures the domain-specific validation logic and is a prime candidate
    to decouple in a separate component. Keep in mind however that the report includes errors and warnings that may need to be generated on-the-fly, which also 
    may include the relevant location in the processed input (if possible). Omitting such details is possible but diminishes the reporting power of your validator
    considering that it would otherwise only report a "success" or "failure" result. As such, it might be necessary to construct the ``TAR`` report as you validate
    or foresee an intermediate GITB-agnostic structure as the result of your validation that you will then convert to the expected ``TAR`` report. These are all points
    to consider when designing your validation service. Details on how the ``TAR`` validation report itself should be populated are provided in :ref:`common__tar`.
