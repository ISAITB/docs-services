The following table provides the links to access the latest version of the GITB specifications. These include the WSDLs for 
messaging, processing and validation services as well as the XSDs for all GITB type definitions.

.. csv-table::
  :header: "Specification", "Description", "Link"

  GITB core elements, The XSD defining core elements used in other GITB XSDs, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/schema/gitb_core.xsd
  GITB test description language (TDL), The XSD defining the types used when defining TDL test suites and test cases, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/schema/gitb_tdl.xsd
  GITB test presentation language (TPL), The XSD defining types used to report on the status of a test session, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/schema/gitb_tpl.xsd
  GITB test reporting language (TRL), The XSD defining the types used to report step output, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/schema/gitb_tr.xsd
  GITB messaging service API, The WSDL defining messaging service operations, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/wsdl/gitb_ms.wsdl
  GITB messaging service types, The XSD defining the messaging service message types, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/schema/gitb_ms.xsd
  GITB validation service API, The WSDL defining validation service operations, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/wsdl/gitb_vs.wsdl
  GITB validation service types, The XSD defining the validation service message types, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/schema/gitb_vs.xsd
  GITB processing service API, The WSDL defining processing service operations, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/wsdl/gitb_ps.wsdl
  GITB processing service types, The XSD defining the processing service message types, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/schema/gitb_ps.xsd
  GITB Test Bed service API, The WSDL defining Test Bed service operations, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/wsdl/gitb_tbs.wsdl
  GITB Test Bed service types, The XSD defining the Test Bed service message types, https://github.com/ISAITB/gitb-types/blob/master/gitb-types-specs/src/main/resources/schema/gitb_tbs.xsd

.. note::
  **Prebuilt Java classes for WSDLs and XSDs:** The Test Bed maintains the `gitb-types Java library on Maven Central <https://search.maven.org/artifact/eu.europa.ec.itb/gitb-types>`_
  which includes the classes and service stubs corresponding to the WSDLs and XSDs. The WSDLs and XSDs themselves are also included in this library.

  For more information on this library and its available variants, check :ref:`common__gitb-types`.


The final GITB workgroup report can be downloaded here [:download:`CEN_WS_GITB3_CWA_Final.pdf`].
