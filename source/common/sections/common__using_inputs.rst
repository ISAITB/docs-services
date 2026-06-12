All service types expect inputs to be passed to them. Inputs are used in the following operations:

  * Operation :ref:`validation__operations__validate` of validation services.
  * Operations :ref:`messaging__operations__send` and :ref:`messaging__operations__receive` of messaging services.
  * Operation :ref:`processing__operations__process` of processing services.

In each case inputs are received as a ``List`` of ``AnyContent`` objects. The ``AnyContent`` class provides a representation of the passed input including the 
metadata needed to determine its value. It includes the following properties relative to inputs:

.. csv-table::
    :header: "Property", "Description"
    :delim: ~

    name~ The name of the input, matching the documented name from the ``getModuleDefinition`` operation.
    value~ The value of the input as a ``String`` in case this is a simple input (not a ``map`` or a ``list``).
    embeddingMethod~ The way to process the value property (``ValueEmbeddingEnumeration.STRING``, ``ValueEmbeddingEnumeration.BASE64`` or ``ValueEmbeddingEnumeration.URI``).
    type~ The `GITB type`_ that corresponds to this input value.
    encoding~ The encoding to consider in case the value is a BASE64 string representing bytes.
    item~ A nested ``List`` of ``AnyContent`` objects in case this input is a ``map`` or a ``list``.

.. note::
    **AnyContent for outputs:** The ``AnyContent`` type is also used to construct service outputs. For more information see :ref:`common__returning_output`.

As you see, regarding ``list`` and ``map`` types, the ``value`` property is empty, giving place to the ``item`` which contains the list of contained values. In case of
a ``map`` the contained ``AnyContent`` objects' ``name`` property corresponds to their ``map`` key value. No ``name`` is present for the objects of a ``list``. Note that
``map`` objects may contain further ``list`` and ``map`` objects at an arbitrary depth using the approach explained. This structure is reflected when 
calling a service with ``map`` or ``list`` inputs in a standalone manner (i.e. using a SOAP client) as illustrated in the following example.

.. code-block:: xml

  <?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.gitb.com/vs/v1/" xmlns:v11="http://www.gitb.com/core/v1/">
    <soapenv:Header/>
    <soapenv:Body>
        <v1:ValidateRequest>
          <sessionId>12345</sessionId>
          <!-- A simple string input. -->
          <input name="aSimpleInput" embeddingMethod="STRING">
            <v11:value>a_value</v11:value>
          </input>
          <!-- A list input containing two strings. -->
          <input name="aListInput">
            <v11:item embeddingMethod="STRING">
                <v11:value>value1</v11:value>
            </v11:item>
            <v11:item embeddingMethod="STRING">
                <v11:value>value2</v11:value>
            </v11:item>
          </input>
          <!-- 
            A map input containins a string for key "key1" and a nested map for key "key2".
            The nested map contains a single string entry under key "SubKey1".
          -->
          <input name="aMapInput">
            <v11:item name="key1" embeddingMethod="STRING">
                <v11:value>value1</v11:value>
            </v11:item>
            <v11:item name="key2">
                <v11:item name="Subkey1">
                    <v11:value>subValue2</v11:value>
                </v11:item>
            </v11:item>
          </input>
        </v1:ValidateRequest>
    </soapenv:Body>
  </soapenv:Envelope>

.. index:: AnyContent
.. index:: ValueEmbeddingEnumeration
.. _common__interpreting_input:

Interpreting an input value
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The value of a simple input (i.e. not a ``list`` or ``map``) is provided through the ``value`` property of its ``AnyContent`` object. In order to determine how 
this value should be considered you need to make use of the ``embeddingMethod`` (enumeration ``ValueEmbeddingEnumeration``) and ``encoding`` properties as follows:

    * ``STRING``: The input to consider is the ``value`` property as-is. It is already directly provided.
    * ``BASE64``: The ``value`` property is a sequence of bytes provided as an escaped BASE64 string. This needs to be decoded to retrieve the actual byte content.
    * ``URI``: The ``value`` property is a reference to a remote resource that is provided as a URI. This needs to be looked up to obtain the actual input to process.

In both the ``BASE64`` and ``URI`` cases the ``encoding`` property should be used to determine how to consider the input's bytes when converting to a character stream.
The default encoding if none is provided is assumed to be UTF-8.

.. note::
    **Simplified input handling:** Supporting all types of embedding methods increases the usage flexibility of your service. In cases where this is not necessary you 
    can of course simply assume the use of a single embedding method for an input and process it accordingly. If for example you are defining a validation service with 
    one input for the content and another for the type of validation to perform you may always assume that the content is provided as ``BASE64`` whereas the validation type 
    is always a ``STRING``. If you choose to do so make sure you document this appropriately in the inputs' description in the ``getModuleDefinition`` operation. If you 
    don't specify this it may be assumed that the input in question may be provided using any of the supported embedding methods.
