A messaging service is used by a test case whenever content is sent (step `send`_) or received (step `receive`_). The following example illustrates
a test case that is using a messaging service to send a message from System1 (simulated) to System2 (the SUT), subsequently receiving from it a message
that is validated with the help of a validation service.

.. code-block:: xml

    <!--
        Create a messaging transaction named "t1".
    -->
    <btxn from="System1" to="System2" txnId="t1" handler="https://MESSAGING_SERVICE?wsdl"/>
    <!--
        Send the request to System2.
    -->
    <send id="step1" desc="Send request" from="System1" to="System2" txnId="t1">
        <input name="message">$requestToSend</input>
    </send>
    <!--
        Wait until the response message is received from System2.
    -->
    <receive id="step2" desc="Receive response" from="System2" to="System1" txnId="t1"/>
    <!--
        Validate the response.
    -->
    <verify handler="https://VALIDATION_SERVICE?wsdl" desc="Validate response">
        <input name="xml">$step2{message}</input>
    </verify>
    <!--
        End the transaction.
    -->
    <etxn txnId="t1"/>

In terms of mapping the test session lifecycle and GITB TDL steps to service calls the following take place:

    #. Before the test session starts, the Test Bed detects that a messaging transaction is taking place of which the 
       service is identified from the WSDL address provided through the transaction's ``handler`` attribute. The 
       :ref:`messaging__operations__initiate` operation is called on the messaging service passing it the configuration recorded for System2. The
       messaging service creates a session and stores in it the call-back address for the Test Bed as well as the metadata
       needed to link received messages to the session.
    #. The test session starts.
    #. The `btxn`_ step results in the :ref:`messaging__operations__beginTransaction` operation to be called.
    #. The `send`_ step results in the :ref:`messaging__operations__send` operation to be called. This receives the message to send (provided from the 
       test session after evaluating ``$requestToSend``) and handles the communication to System2. The output is passed
       back to the Test Bed and is stored in the test session context under key ``step1``.
    #. The `receive`_ step results in the :ref:`messaging__operations__receive` operation to be called and the Test Bed blocking until a message is received.
    #. The messaging service receives from System2 the response. This is used to locate the corresponding session and call the 
       Test Bed's ``notifyForMessage`` call-back operation on the previously stored call-back address. The returned ``TAR`` report
       includes a ``message`` property in its context set with the received message's content.
    #. The Test Bed is unblocked, it completes the `receive`_ step and places the received output in the test session context under
       key ``step2``.
    #. The `verify`_ step is used to validated the received content, loaded from the test session context by evaluating 
       ``$step2{message}``.
    #. The `etxn`_ step results in calling the :ref:`messaging__operations__endTransaction` operation to signal the end of the transaction.
    #. The test session completes at which point the :ref:`messaging__operations__finalize` operation is called. The messaging service removes the relevant 
       session from memory.
