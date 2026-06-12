Processing services can also be called in a standalone manner to perform processing actions. You may want to do this if the processing logic you have implemented
for use by the Test Bed is also useful to you outside the context of a test session.

In case your service makes use of transactions/sessions you will first need to create one:

.. code-block:: xml

    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.gitb.com/ps/v1/">
        <soapenv:Header/>
        <soapenv:Body>
            <v1:BeginTransactionRequest/>
        </soapenv:Body>
    </soapenv:Envelope>

The response to this will provide you with a session identifier to use. You will need to copy this in each :ref:`processing__operations__process` call as well as signal it in the final 
:ref:`processing__operations__endTransaction` call as follows:

.. code-block:: xml

    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.gitb.com/ps/v1/">
        <soapenv:Header/>
        <soapenv:Body>
            <v1:EndTransactionRequest>
                <sessionId>SESSION_ID</sessionId>
            </v1:EndTransactionRequest>
        </soapenv:Body>
    </soapenv:Envelope>

Note that if your service does not make use of transactions/sessions you could simply skip these calls and omit the session identifier for
:ref:`processing__operations__process` calls.

A call to the :ref:`processing__operations__process` operation is illustrated in the following example:

.. code-block:: xml

    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://www.gitb.com/ps/v1/" xmlns:v11="http://www.gitb.com/core/v1/">
        <soapenv:Header/>
        <soapenv:Body>
            <v1:ProcessRequest>
                <!-- The sessionId can be omitted if there is no transaction -->
                <sessionId>SESSION_ID</sessionId>
                <operation>uppercase</operation>
                <input name="input" embeddingMethod="STRING">
                    <v11:value>a text</v11:value>
                </input>
            </v1:ProcessRequest>
        </soapenv:Body>
    </soapenv:Envelope>

The example above should be for the most part self-evident. Points that merit highlighting are:

  * The possibility to pass inputs as-is or in ``CDATA`` blocks (actually this is simply a XML feature).
  * The ``embeddingMethod`` that is set to ``STRING``. This tells the processing service how the text value should be interpreted. Possible values are:

    * ``STRING``: The value is used as-is.
    * ``BASE64``: The value is considered as BASE64-encoded bytes.
    * ``URI``: The value is considered to be the content retrieved from a remote URI reference.


.. _Spring Boot: https://spring.io/projects/spring-boot
.. _Maven Central: https://search.maven.org/
.. _GITB processing service API: https://www.itb.ec.europa.eu/specs/latest/gitb_ps.wsdl
.. _bptxn: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#bptxn
.. _eptxn: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#eptxn
.. _process: https://www.itb.ec.europa.eu/docs/tdl/latest/constructs/index.html#process
.. _Spring: https://spring.io/
.. _CXF: https://cxf.apache.org/
