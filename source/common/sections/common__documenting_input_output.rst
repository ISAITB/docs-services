The ``getModuleDefinition`` operation of each service is used to primarily define the inputs the service expects as well as its outputs. Of these, defining 
the input parameters is of most importance as this determines how the service should be called and, in case it is called by the Test Bed, serves to proactively
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

    name, The name of the parameter. This will be used to identify it both when calling via the Test Bed as well as in standalone calls.
    type, The type of the parameter corresponding to one of the `GITB types`_ that can be used in test cases.
    use, Whether or not the parameter is required (``UsageEnumeration.R``) or optional (``UsageEnumeration.O``).
    kind, The way in which the input parameter is configured. This can always be set to ``ConfigurationType.SIMPLE``.
    desc, The description of the parameter to be displayed in the result of a ``getModuleDefinition`` call.

Finally, note that output parameters may also be defined in ``getModuleDefinition`` using the same construct. This however is purely done for documentation purposes as there is
no automatic type checking or verification. Unless you want to fully document a service's outputs you can skip their definition.

.. note::
    **Defining list inputs:** When defining an input of type ``list`` a good practice is to also specify the expected contained type (i.e. the type of its elements).
    Do this by setting the type of the input in the ``getModuleDefinition`` response using the form ``list[string]`` rather than ``list`` (which however also works).
