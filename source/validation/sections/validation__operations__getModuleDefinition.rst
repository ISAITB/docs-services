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
  * The variable **inputs** that are expected.

The difference between configuration parameters and inputs is more a conceptual point in that configuration parameterises the
validation to take place, whereas inputs represent the actual content to validate. In practice configuration parameters are often
skipped in favour of inputs that serve both to pass the content to validate as well as any additional properties needed by the
validation service.

This operation is the first one to be called when using the service in a standalone manner as it allows the caller to figure out the
inputs it expects. The validation service API defines generally how inputs are passed but not how many in this specific case nor the 
name and value of each one. When used by the Test Bed this operation is also important as it determines:

  * The types of expected inputs. This enables automatic type conversions when passing the call's parameters.
  * The mandatory inputs. The Test Bed checks that all required inputs are accounted for before calling the :ref:`validation__operations__validate` operation
    to fail quickly without an unnecessary service call.

The following example shows a complete implementation of the ``getModuleDefinition`` operation.

.. code-block:: java

    public GetModuleDefinitionResponse getModuleDefinition(Void parameters) {
        GetModuleDefinitionResponse response = new GetModuleDefinitionResponse();
        response.setModule(new ValidationModule());
        // Set an identifier for the service.
        response.getModule().setId("MyValidationService");
        // Set "V" as the service's type (for "Validation").
        response.getModule().setOperation("V");
        response.getModule().setMetadata(new Metadata());
        // Set a name for the service (the identifier is reused here).
        response.getModule().getMetadata().setName(response.getModule().getId());
        // Set a version string for the service.
        response.getModule().getMetadata().setVersion("1.0.0");
        response.getModule().setInputs(new TypedParameters());
        // Define the service's input parameters.
        response.getModule().getInputs().getParam().add(createParameter(...));
        response.getModule().getInputs().getParam().add(createParameter(...));
        return response;
    }

The metadata set for a validation service (identifier, name, version and operation) are not used in practice. The only important 
information that needs to be defined are the input parameters. In the above example these are created by calling a custom ``createParameter()`` method.
See :ref:`common__documenting_input_output` for full details on how these parameters need to be defined.  Note that as of release 1.10.0, you are no longer obliged 
to define service inputs (i.e. they are optional), although doing so remains a best practice as it allows client-side input verification.
