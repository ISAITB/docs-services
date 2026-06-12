The ``send`` operation is used by the Test Bed to send content to an external system. From the perspective of the test case, this appears as a message
being sent by a simulated actor (implemented by the messaging service) to the SUT or another simulated actor. The parameters received through the call
are:

    * The list of inputs to consider.
    * The name of the "to" actor.
    * The session identifier.

As part of the operation's implementation the messaging service is expected to:

    #. Verify the received inputs to ensure messaging can proceed.
    #. Extract the values of the inputs.
    #. Use the inputs to construct the actual message to be sent.
    #. Send the message to the remote system.
    #. Return a response to the Test Bed.

The following sample provides an example implementation: 

.. code-block:: java

    public SendResponse send(SendRequest parameters) {
        // Retrieve the operation's input.
        List<AnyContent> messageInput = getInput(parameters, INPUT__MESSAGE);
        if (messageInput.size() != 1) {
            throw new IllegalArgumentException(String.format("Only a single input is expected named [%s]", INPUT__MESSAGE));
        } else {
            // Extract the input's value.
            byte[] inputContent = getInputValue(messageInput.get(0));
            // Send the content to the remote system.
            String acknowledgementId = sendContent(inputContent, parameters.getSessionId());
        }
        SendResponse response = new SendResponse();
        // Construct a successful status report.
        response.setReport(createReport(TestResultType.SUCCESS, acknowledgementId));
        return response;
    }

The above example illustrates key steps that are taking place but decouples certain actions into separate methods. These are specifically:

    * The extraction of the input parameter in method ``getInput()``. Multiple input parameters may be present including ones with the same name. See :ref:`common__using_inputs` on
      what you should consider when looking up your inputs.
    * The retrieval of the input value(s) to process in method ``getInputValue()``. An input parameter provides a string value which in this example is the BASE64
      content of the content to send. See :ref:`common__interpreting_input` on what you should consider when retrieving an input's value.
    * The communication implementation in method ``sendContent()``. This method would be responsible for using the provided bytes to create the actual message 
      to send and then send it to the remote system.
    * The generation of the ``TAR`` status report in method ``createReport()``. For details on how the report should be created check :ref:`common__tar`.

One important point to highlight is the use of the session identifier that is passed into method ``sendContent()``. It is assumed that in the session we have
already recorded the destination address of the remote system (e.g. passed as configuration in operation :ref:`messaging__operations__initiate`). Alternatively, the received input 
parameters could also include addressing information that would be used here. Determining how exactly the remote system is addressed and the communication 
implementation is a domain-specific concern that you will need to handle when implementing your service.

Finally, note that when sending the actual message to the remote system we may receive important information such as acknowledgements, identifiers or even a
synchronous reply. This information can be passed to the Test Bed as the context of the ``TAR`` report that is returned in the ``send`` call's response
(see :ref:`common__tar` for details on this). Moreover, the returned report could also include information such as the request message that was sent, especially
if the messaging service modified it before sending it. Keep in mind that the information you include as output will serve two purposes:

    * It will be displayed to the user as the output of the `send`_ step.
    * It will be stored in the test session context to be leveraged in subsequent test steps (see :ref:`common__using_output`).
