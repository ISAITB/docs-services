The previous section deals with the implementation needed on the side of the service to return one or more output values. The current section deals with how
these output values can be used in the calling test session.

A service call's output is stored in the test session context, with a key value that matches the corresponding test case step's ``id`` attribute. Specifically:

    * **Validation services:** The overall true/false validation result of the `verify`_ step is stored as a ``boolean`` value. 
    * **Processing services:** The output of the `process`_ step is stored as a ``map``.
    * **Messaging services:** The output of the `send`_, `receive`_ and `listen`_ steps is stored as a ``map``.

An additional ``output`` attribute is supported for the `verify`_ and `process`_ steps to enable more control over a service's results. This is used in 
each case as follows:

    * In the `verify`_ step this results in recording the validation report's context data in the test session context as a ``map`` named using the ``output``
      attribute's value. For more details see :ref:`validation__using_test_case__output`.
    * In the `process`_ step this overrides the default use of the ``id`` attribute, storing instead the output in the test session context as a variable named
      using the ``output`` attribute's value. In addition, in case the service returns only a single output, this is stored directly in the session context rather
      than be placed in a ``map``.

These different approaches on using service outputs are illustrated in the following examples. In the first example we consider a case where a file is received
through a messaging service, processed through a processing service and then validated using a validation service. The `process`_ step here uses a verbose syntax and
the step's ``id`` to record its output. The `verify`_ step on the other hand ignores any output values produced by the validation service:

.. code-block:: xml

    ...
    <!-- Receive the file. -->
    <receive id="receiveOutput" desc="Receive file" from="Sender" to="Receiver" txnId="mt1"/>
    <!-- Process the file using the "convert" operation. -->
    <process id="processOutput" handler="...">
        <operation>convert</operation>
        <input name="inputFile">$receiveOutput{data}</input>
    </process>
    <!-- Validate the converted file. -->
    <verify handler="..." desc="Validate file">
        <input name="inputFile" embeddingMethod="BASE64">$processOutput{convertedData}</input>
    </verify>
    ...

In this example the `receive`_ step results in the Test Bed being notified by the relevant messaging service. This service has returned as output a ``map`` with one 
element named "data" that contains the file bytes. Given that the `receive`_ step has an ``id`` of "receiveOutput" the test session context now includes a key
with this value that refers to the returned output. In the subsequent `process`_ step the file content is referred to with the ``$receiveOutput{data}`` expression (see 
the `GITB TDL expression documentation`_ for details) when this is passed as the "inputFile" input of the "convert" operation. The result of the `process`_ step, in this case a ``map``
with a key "convertedData" pointing to the converted bytes, is stored in the test session context under key "processOutput" (the ``id`` of the `process`_ step). Finally, 
this converted data is used in the `verify`_ step where using the expression ``$processOutput{convertedData}`` it is passed as the expected "inputFile" input.

The second example that follows considers the same scenario but adapts to make use of the `process`_ step's more succinct attribute syntax. In addition, we store the
service's output directly without wrapping it in a ``map``:

.. code-block:: xml

    ...
    <!-- Receive the file. -->
    <receive id="receiveOutput" desc="Receive file" from="Sender" to="Receiver" txnId="mt1"/>
    <!-- Process the file using the "convert" operation. -->
    <process output="dataToValidate" handler="..." operation="convert" input="$receiveOutput{data}"/>
    <!-- Validate the converted file. -->
    <verify handler="..." desc="Validate file">
        <input name="inputFile" embeddingMethod="BASE64">$dataToValidate</input>
    </verify>
    ...

The `receive`_ step is identical in this case. What changes is the how the `process`_ step is used, by using attributes versus elements and by explicitly naming the resulting 
output variable. In addition, the result is no longer recorded in a ``map`` but rather set as-is. This is reflected by the update in the `verify`_ step where we refer to the
processing output with ``$dataToValidate``. Although such naming may seem trivial it could be helpful in making test cases more straightforward. In addition, it allows you to
directly use values in `templates`_ where the naming of session context variables needs to match the template's placeholders.

The third example that follows assumes that the validation service returns alongside its validation report a calculated digest value and size for the validated file. These
can be leveraged in the test by setting the ``output`` attribute on the `verify`_ step. Doing this instructs the Test Bed to record the returned validation report's context in
the session context apart from just using it for display purposes:

.. code-block:: xml

    ...
    <!-- Receive the file. -->
    <receive id="receiveOutput" desc="Receive file" from="Sender" to="Receiver" txnId="mt1"/>
    <!-- Process the file using the "convert" operation. -->
    <process output="dataToValidate" handler="..." operation="convert" input="$receiveOutput{data}"/>
    <!-- Validate the converted file and record the file's metadata. -->
    <verify output="metadata" handler="..." desc="Validate file">
        <input name="inputFile" embeddingMethod="BASE64">$dataToValidate</input>
    </verify>
    <!-- Use the values returned by the validation service. -->
    <log>$metadata{digest}</log>
    <log>$metadata{size}</log>
    ...

As you can see, the `verify`_ step is adapted here to record its output under a variable named "metadata". This results in the validation report's context values (assumed to be
named "digest" and "size") to be recorded in the session context for subsequent use (referred to as ``$metadata{digest}`` and ``$metadata{size}`` respectively).
