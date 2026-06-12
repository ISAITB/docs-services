Validation services can also be called in a standalone manner to perform one-off validations. Cases where such calls are commonly used are during
unit testing to ensure that generated content is valid. The following example illustrates such a call:

.. code-block:: xml

  <?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.gitb.com/vs/v1/" xmlns:v11="http://www.gitb.com/core/v1/">
    <soapenv:Header/>
    <soapenv:Body>
        <v1:ValidateRequest>
          <input name="input1" embeddingMethod="STRING">
            <!-- Provide the input as-is. -->
            <v11:value>a_value</v11:value>
          </input>
          <input name="input2" embeddingMethod="STRING">
              <!-- Provide the input in a CDATA block to avoid XML formatting issues. -->
              <v11:value><![CDATA[Provide content here ...]]></v11:value>
          </input>
        </v1:ValidateRequest>
    </soapenv:Body>
  </soapenv:Envelope>

The example above should be for the most part self-evident. Points that merit highlighting are:

  * The possibility to pass inputs as-is or in ``CDATA`` blocks (actually this is simply a XML feature).
  * The ``embeddingMethod`` that is set to ``STRING``. This tells the validation service how the text value should be interpreted. Possible values are:

    * ``STRING``: The value is used as-is.
    * ``BASE64``: The value is considered as BASE64-encoded bytes.
    * ``URI``: The value is considered to be the content retrieved from a remote URI reference.

.. _verify: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#verify
.. _Spring Boot: https://spring.io/projects/spring-boot
.. _Maven Central: https://search.maven.org/
.. _GITB validation service API: https://www.itb.ec.europa.eu/specs/latest/gitb_vs.wsdl
.. _Spring: https://spring.io/
.. _CXF: https://cxf.apache.org/
