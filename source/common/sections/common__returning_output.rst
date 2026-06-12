All services are used to return outputs to the test session that is calling them. Specifically:

  * Validation services return a validation report from their :ref:`validation__operations__validate` operation that may contain an arbitrary set of outputs as its context (see :ref:`common__tar`).
  * Processing services receive input and produce output through their :ref:`processing__operations__process` operation.
  * Messaging services return output in the case of the :ref:`messaging__operations__send` operation for any information that is useful to report (e.g. the message sent, a synchronous response).
    The :ref:`messaging__operations__receive` operation does not return output itself but received content is returned to the Test Bed asynchronously through the ``notifyForMessage`` call-back (see :ref:`messaging__callbacks`).

Service outputs are provided using the ``AnyContent`` class. In the case of processing services this is a ``List`` of ``AnyContent`` objects that is provided directly on 
the ``ProcessResponse`` class, whereas for messaging and validation services ``AnyContent`` objects are passed through the ``TAR`` report's ``context`` property (see :ref:`common__tar`).
The ``AnyContent`` class includes the following properties relative to outputs:

.. csv-table::
    :header: "Property", "Description"
    :delim: ~

    name~ The name of the output, matching the documented name from the ``getModuleDefinition`` operation.
    value~ The value of the output as a ``String`` in case this is a simple input (not a ``map`` or a ``list``).
    embeddingMethod~ The way to process the value property (``ValueEmbeddingEnumeration.STRING``, ``ValueEmbeddingEnumeration.BASE64`` or ``ValueEmbeddingEnumeration.URI``).
    type~ The `GITB type`_ that corresponds to this output value.
    encoding~ The encoding to consider in case the value is a BASE64 string representing bytes.
    item~ A nested ``List`` of ``AnyContent`` objects in case this output is a ``map`` or a ``list``.
    mimeType~ The `mime type`_ relevant to this output, to make more appropriate its presentation to users.
    forDisplay~ A boolean flag defining whether this output should be displayed to users (default is ``true``). See :ref:`common__returning_output__purpose` for details.
    forContext~ A boolean flag defining whether this output should be recorded for processing by subsequent test steps (default is ``true``). See :ref:`common__returning_output__purpose` for details.

.. note::
    **AnyContent for inputs:** The ``AnyContent`` type is also used to read service inputs. For more information see :ref:`common__using_inputs`.

The most flexible way of returning output is by defining a first ``AnyContent`` object of type ``map``. This acts as a root under which you can add additional arbitrary named 
values with one or more outputs you want to return. Moreover, this map can contain nested ``AnyContent`` objects of type ``list`` or ``map`` allowing you to organise and group outputs
as you wish. Constructing each ``AnyContent`` object follows the same principles in terms of e.g. values and embedding methods as described in the case of inputs (see :ref:`common__using_inputs`).

The values returned through ``AnyContent`` instances are recorded in the test session context and displayed as part of the relevant step's report. For binary values or long texts, the display is not
made inline but rather controls are presented to either download the content as a file or view it in a code editor. To facilitate this process you can specify on your ``AnyContent`` outputs an additional
``mimeType`` property that is set with the content's `mime type`_ (e.g. ``text/xml``). The result of doing this is twofold:

  * When **downloaded**, the relevant file is set with an appropriate extension and content type.
  * When **displayed** in an editor, syntax highlighting is applied to improve readability.

The following example illustrates the construction of a complex output structure, including a simple output string and a ``map`` with two properties:

.. code-block:: java

    // Create output parameter named "output1" which a simple string value.
    AnyContent output1 = new AnyContent();
    output1.setName("output1");
    output1.setValue("A value");
    output1.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Create a first string property named "property1".
    AnyContent output2Property1 = new AnyContent();
    output2Property1.setName("property1");
    output2Property1.setValue("Value1");
    output2Property1.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Create a second string property named "property2".
    AnyContent output2Property2 = new AnyContent();
    output2Property2.setName("property2");
    output2Property2.setValue("Value2");
    output2Property2.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Create a third string property named "property3" that holds XML content.
    AnyContent output2Property3 = new AnyContent();
    output2Property3.setName("property3");
    output2Property3.setValue(xmlContent);
    output2Property3.setMimeType("text/xml");
    output2Property3.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Add the "property1", "property2" and "property3" values under a map named "output2".
    AnyContent output2 = new AnyContent();
    output2.setName("output2");
    output2.getItem().add(output2Property1);
    output2.getItem().add(output2Property2);
    output2.getItem().add(output2Property3);

    // Add both the "output1" and "output2" properties as top-level output items.
    AnyContent output = new AnyContent();
    output.getItem().add(output1);
    output.getItem().add(output2);

    // Construct the TAR report and set the outputs as the report's context.
    TAR report = new TAR();
    report.setContext(output);

Note that the final part of this example (setting the report's context) applies to validation and messaging services. In the case of processing services, the 
``output`` object would be set directly on the ``ProcessResponse`` class.

.. note::
    **Validation service outputs:** When used in GITB test cases, the output of validation services will by default not be recorded
    in the test session context (recording only a ``boolean`` flag instead). To have additional output recorded you would need to set
    the optional ``output`` property (see :ref:`validation__using_test_case__output` for details).

.. index:: forContext
.. index:: forDisplay
.. _common__returning_output__purpose:

Defining the purpose of outputs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Outputs returned by services are used for two purposes:

    * To **set values** in the test session context for subsequent processing.
    * To **display** to users as feedback on the service's result.

By default output values defined as ``AnyContent`` instances serve both these purposes, meaning that they are displayed to users and
also recorded in the test session context for subsequent use. When creating an ``AnyContent`` instance you can however be more specific
by explicitly defining the output's purpose. This is done by means of two boolean flags:

    * The ``forDisplay`` flag determines whether the output is displayed to users. Setting to ``false`` will hide it when displaying the
      service's report.
    * The ``forContext`` flag determines whether the output is recorded in the test session context. Setting to ``false`` will not record
      it for processing in subsequent steps.

Using these flags enables interesting use cases. It could be that you want to hide certain service outputs from users because they are
internal or sensitive. Setting ``forDisplay`` to ``false`` in this case allows you to hide them while still having them available for
processing. On the other hand, you may want to return outputs purely for presentation purposes that you will never subsequently use.
Setting ``forContext`` to ``false`` will result in these being displayed but not stored in the test session context. Obviously, setting
both flags to ``false`` for a given output makes little sense as it would be neither visible nor processable.

The following example illustrates usage of these flags to fine-tune the purpose of service outputs:

.. code-block:: java

    // Create an output parameter not meant to be viewed in reports.
    AnyContent internalStatusCode = new AnyContent();
    internalStatusCode.setForDisplay(false)
    internalStatusCode.setName("internalStatusCode");
    internalStatusCode.setValue("CODE1");
    internalStatusCode.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Create an output parameter only for display purposes.
    AnyContent userMessage = new AnyContent();
    userMessage.setForContext(false)
    userMessage.setName("userMessage");
    userMessage.setValue("Your message failed to be processed");
    userMessage.setEmbeddingMethod(ValueEmbeddingEnumeration.STRING);

    // Add to the report's context.
    TAR report = new TAR();
    AnyContent context = new AnyContent();
    context.getItem().add(internalStatusCode);
    context.getItem().add(userMessage);
    report.setContext(output);

.. note::
    **Processing services:** Using the ``forDisplay`` and ``forContext`` flags is meaningful only for :ref:`messaging services<messaging>` 
    and :ref:`validation services<validation>`, where outputs are returned as the :ref:`TAR report<common__tar>` context.
    In the case of :ref:`processing services<processing>` these flags are ignored, given that the produced report is distinct from the 
    service outputs allowing you to create each one as you want. In addition, keep in mind that processing services are by default hidden from 
    users unless they are :ref:`configured as visible<processing__using_test_case__visible_context>`.
