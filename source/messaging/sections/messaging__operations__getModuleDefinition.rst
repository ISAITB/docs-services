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
  * The **outputs** that are produced.

The difference between configuration parameters and inputs is more of a conceptual point in that configuration parameterises the
messaging to take place, whereas inputs represent the actual message elements to process. In practice configuration parameters are often
skipped in favour of inputs that serve both to pass content as well as any additional parameterisation needed by the messaging service.

This main purpose of the ``getModuleDefinition`` operation is to determine the inputs expected by the service. The messaging service API defines 
generally how inputs and outputs are passed but not how many in this specific case nor the name and value of each one. When used by the Test Bed this operation 
determines:

  * The types of expected inputs. This enables automatic type conversions when passing the call's parameters.
  * The mandatory inputs. The Test Bed checks that all such inputs are accounted for before calling the service's operations
    to fail quickly without unnecessary calls.

The following example shows a complete implementation of the ``getModuleDefinition`` operation.

.. code-block:: java

    public GetModuleDefinitionResponse getModuleDefinition(Void parameters) {
        GetModuleDefinitionResponse response = new GetModuleDefinitionResponse();
        response.setModule(new MessagingModule());
        // Set an identifier for the service.
        response.getModule().setId("MyMessagingService");
        response.getModule().setMetadata(new Metadata());
        // Set a name for the service (the identifier is reused here).
        response.getModule().getMetadata().setName(response.getModule().getId());
        // Set a version string for the service.
        response.getModule().getMetadata().setVersion("1.0.0");
        response.getModule().setInputs(new TypedParameters());
        // Define the service's input parameters.
        response.getModule().getInputs().getParam().add(createParameter(...));
        return response;
    }

The metadata set for a messaging service (identifier, name and version) are not used in practice. In addition, definition of outputs is often skipped
as this is purely for documentation purposes. What is important to define correctly are the input parameters, the definitions of which in this example are
constructed with the help of a ``createParameter()`` method. See :ref:`common__documenting_input_output` for full details on how these parameters need to be defined.
Note that as of release 1.10.0, you are no longer obliged to define service inputs and output (i.e. both are optional), although doing so remains a best practice as
it allows client-side input verification.

.. note::
    **Required inputs for messaging services:** Specifying an input as required (i.e. setting its ``use`` to ``UsageEnumeration.R``) allows the Test Bed to proactively test
    that it is provided. This however causes a problem for messaging services that both need to :ref:`messaging__operations__send` and :ref:`messaging__operations__receive` content as there is no distinction between the 
    inputs of each operation in the documentation returned by the :ref:`messaging__operations__getModuleDefinition` operation. A required :ref:`messaging__operations__send` input will typically not apply for a :ref:`messaging__operations__receive`
    call resulting always in an error when checking them from the side of the Test Bed. The cause of this is a historical update of the messaging service API that, in
    favour of backwards compatibility, introduced this ambiguity as a negative side-effect.
    
    Until this issue is resolved in the specification, input parameters should either be **skipped** or defined as **optional** (i.e. ``UsageEnumeration.O``). The presence or not
    of each expected input must then be checked in the service's :ref:`messaging__operations__receive` and :ref:`messaging__operations__send` implementations.
