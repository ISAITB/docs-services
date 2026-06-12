The ``getModuleDefinition`` operation is used to return information on how the service is expected to be used. In case
the service is specific to a given project and not meant to be published and reused, you can provide an empty implementation
as follows:

.. code-block:: java

    public GetModuleDefinitionResponse getModuleDefinition(Void parameters) {
        return new GetModuleDefinitionResponse();
    }

If you plan to publish a reusable and well-documented service for others to use, it is meaningful to provide a complete implementation.
In this case, this method is used to document:

    * The identification **metadata** of the service.
    * The **configuration** parameters it expects.
    * The **operations** that it supports as well as their individual **inputs** and **outputs**.

Configuration parameters can be seen as parameterisation of the complete service addressing all its operations. Regarding the operations,
each contains:

    * A **name** that serves to identify it and request its execution.
    * A set of zero or more **inputs** that need to be provided for the operation.
    * A set of zero or more **outputs** that the operation will return and be made available in the test session context.

The following example shows a complete implementation of the ``getModuleDefinition`` operation.

.. code-block:: java

    public GetModuleDefinitionResponse getModuleDefinition(Void parameters) {
        GetModuleDefinitionResponse response = new GetModuleDefinitionResponse();
        response.setModule(new ProcessingModule());
        // Set an identifier for the service.
        response.getModule().setId(serviceId);
        response.getModule().setMetadata(new Metadata());
        // Set a name for the service (the identifier is reused here).
        response.getModule().getMetadata().setName(response.getModule().getId());
        // Set a version string for the service.
        response.getModule().getMetadata().setVersion(serviceVersion);
        response.getModule().setConfigs(new ConfigurationParameters());
        // Define the supported operations as well as their input and output parameters.
        TypedParameter inputText = createParameter("input", "string", UsageEnumeration.R, ConfigurationType.SIMPLE, "The input text to process");
        TypedParameter outputText = createParameter("output", "string", UsageEnumeration.R, ConfigurationType.SIMPLE, "The output result");
        response.getModule().getOperation().add(createProcessingOperation("uppercase", Arrays.asList(inputText), Arrays.asList(outputText)));
        response.getModule().getOperation().add(createProcessingOperation("lowercase", Arrays.asList(inputText), Arrays.asList(outputText)));
        return response;
    }

    private ProcessingOperation createProcessingOperation(String name, List<TypedParameter> input, List<TypedParameter> output) {
        ProcessingOperation operation = new ProcessingOperation();
        // Set the operation's name.
        operation.setName(name);
        // Set the operation's inputs.
        operation.setInputs(new TypedParameters());
        operation.getInputs().getParam().addAll(input);
        // Set the operation's outputs.
        operation.setOutputs(new TypedParameters());
        operation.getOutputs().getParam().addAll(output);
        return operation;
    }    

The metadata set for a processing service (identifier, name and version) are not used in practice. The important information that needs to be defined are the 
operations as well as their input and output parameters. In this example the processing service is used to either uppercase or lowercase a provided text. As such,
two appropriately named operations are defined, each accepting an input string named "input" and producing the string output named "output". Creation of the parameters
(done here by calling a ``createParameter()`` method) is documented in :ref:`common__documenting_input_output`.

.. note::
    As of release 1.10.0 you are no longer obliged to define service inputs and outputs (i.e. both are optional), although doing so remains a good practice as it allows
    client-side input verification.
