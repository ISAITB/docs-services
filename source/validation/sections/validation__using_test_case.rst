Use of a validation service in a test case is achieved with the `verify`_ step. The following example illustrates use of a service that 
validates a single ``aDocument`` input parameter.

.. code-block:: xml

    <verify handler="https://VALIDATION_SERVICE_ADDRESS?wsdl" desc="Validate against remote service">
        <input name="aDocument">$document</input>
    </verify>

When the `verify`_ step is executed the following actions take place:

  #. A client for the service is constructed based on the WSDL provided through the ``handler`` attribute.
  #. The service's :ref:`validation__operations__getModuleDefinition` operation is called to determine its input parameters.
  #. The inputs are constructed based on the GITB TDL expressions in the test case (in the example the single ``aDocument`` input is populated 
     from the ``document`` context variable).
  #. The :ref:`validation__operations__validate` operation is called to validate the content and retrieve the report.

.. _validation__using_test_case__output:

Using validator output in test cases
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Starting from release 1.11.0, validators used via test cases can also have their output used in subsequent processing.
Such output is returned by means of the service's :ref:`validation report<common__tar>`, and specifically by 
:ref:`including output data<common__returning_output>` in the report's **context section**. Returning such context data 
was already possible but resulted only in additional information displayed to complement the validation report, without 
allowing its subsequent use. This is now possible by means of the ``output`` attribute on the `verify`_ step.

Defining the ``output`` attribute results in the test session context being updated with the data set as the report's context.
This is typically a ``map`` but could be anything your service returns. The following snippet illustrates this case:

.. code-block:: xml

    <!-- Call the service and store its output in a variable named "validatorOutput". -->
    <verify output="validatorOutput" handler="https://VALIDATION_SERVICE_ADDRESS?wsdl" desc="Validate against remote service">
      <input name="aDocument">$document</input>
    </verify>
    <!-- Use the output. The context in this case was a map including an item named "identifier". -->
    <log>$validatorOutput{identifier}</log>
