The following sections briefly describe the existing sample implementations for each service type and how to use them.

.. _templates__samples__validation:

Template validation service
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The sample implementation is used to test that two texts match. It expects to be called with three inputs:

    * "text" a string representing the text to check.
    * "expected" a string representing the value the "text" input needs to match.
    * "mismatchIsError" an optional boolean to determine whether a mismatch is an error (the default) or a warning.

The WSDL of the service (using the default configuration) is available at: http://localhost:8080/services/validation?WSDL.

.. _templates__samples__messaging:

Template messaging service
~~~~~~~~~~~~~~~~~~~~~~~~~~

The sample implementation offers the following behaviour:

    * When asked by the Test Bed to :ref:`messaging__operations__send` a message it simply logs the message in its log file. The name of the input corresponding to the 
      message is "messageToSend".
    * When asked to :ref:`messaging__operations__receive` a message it will listen on an exposed REST service for ``GET`` requests with two URL parameters: a text value 
      (parameter "message") and the test session identifier it relates to (parameter "session"). If the service is called with no "message" parameter 
      it considers an empty string, whereas when the "session" parameter is missing it will trigger all active sessions.

Using the default configuration, the WSDL of the service is available at: http://localhost:8080/services/messaging?WSDL. The REST service that is used
to provide a text for the Test Bed to receive is available at http://localhost:8080/input (called for example as http://localhost:8080/input?session=SESSION_ID&message=TEXT).

.. _templates__samples__processing:

Template processing service
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The sample implementation is used to process a provided text returning its uppercase or lowercase equivalent. It foresees two operations:

    * "uppercase" to convert an input named "input" to its uppercase equivalent.
    * "lowercase" to convert an input named "input" to its lowercase equivalent.

The WSDL of the service (using the default configuration) is available at: http://localhost:8080/services/process?WSDL.
