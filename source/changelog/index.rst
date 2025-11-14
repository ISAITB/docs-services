.. _changelog:

Release history
===============

The current section provides an overview of changes in each release of the GITB test service APIs.

Release numbers follow **global numbering** covering all Test Bed components, meaning that certain releases may have not
actually introduced changes to the GITB service APIs. The current page lists only the releases that introduced changes, whereas
those not included are global maintenance releases that made no changes to the APIs.

The latest release of the GITB test service APIs is **1.28.3**.

Release 1.25.0 - 31/01/2025
---------------------------

The documentation for release 1.25.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.25.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    Detailed validation reports from external messaging and processing handlers are displayed even when counters not defined. | :ref:`common__tar`

Release 1.23.0 - 20/06/2024
---------------------------

The documentation for release 1.23.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.23.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    New ``template-test-service`` template, replacing the separate ones per service, and allowing configurable creation of multiple endpoints and sample code addition. | :ref:`templates`

Release 1.19.0 - 17/03/2023
---------------------------

The documentation for release 1.19.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.19.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    The ``gitb-types`` library is now available in three variants (XSDs and WSDLs only, javax APIs and Jakarta API). | :ref:`common__gitb-types`

Release 1.18.0 - 17/10/2022
---------------------------

The documentation for release 1.18.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.18.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    Test services can now access test session metadata as SOAP header elements (test session ID, test case ID, test step ID, engine version). | :ref:`common__session_metadata`

Release 1.16.0 - 18/03/2022
---------------------------

The documentation for release 1.16.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.16.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    Test services can now contribute log entries to the test session's log. | :ref:`common__logging`

Release 1.15.0 - 29/11/2021
---------------------------

The documentation for release 1.15.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.15.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    Support for the ``forDisplay`` and ``forContext`` flags on service outputs to define their purpose. | :ref:`common__returning_output__purpose`
    Returning a session identifier in the ``initiate`` operation of messaging services is now optional. | :ref:`messaging__operations__initiate`

Release 1.14.0 - 17/08/2021
---------------------------

The documentation for release 1.14.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.14.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    Services can now set a mime type on return values to facilitate their post-processing and display. | :ref:`common__returning_output`

Release 1.13.0 - 01/07/2021
---------------------------

The documentation for release 1.13.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.13.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    Processing services can now return data to be displayed to users when used in GITB test cases. | :ref:`processing__using_test_case__visible_context`

Release 1.12.0 - 03/03/2021
---------------------------

The documentation for release 1.12.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.12.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    The session identifier is no longer a mandatory input for validation and processing services, facilitating their standalone use. | :ref:`validation`, :ref:`processing`,

Release 1.11.0 - 13/11/2020
---------------------------

The documentation for release 1.11.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.11.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    Validation services called from test cases can now have their output data used in subsequent test steps (not only used for display). | :ref:`validation__using_test_case__output`

Release 1.10.0 - 07/09/2020
---------------------------

The documentation for release 1.10.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.10.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    Defining inputs and output in the ``getModuleDefinition`` operation is now optional. | :ref:`getModuleDefinition (messaging)<messaging__operations__getModuleDefinition>`, :ref:`getModuleDefinition (processing)<processing__operations__getModuleDefinition>`, :ref:`getModuleDefinition (validation)<validation__operations__getModuleDefinition>`

Release 1.8.0 - 20/01/2020
--------------------------

The documentation for release 1.8.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.8.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: |

    TAR validation reports can now be set with an overall result of ``TestResultType.WARNING``. | :ref:`common__tar`

Release 1.6.0 - 29/05/2019
--------------------------

The documentation for release 1.6.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.6.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: ~

    All template services are now adapted to use Java 11, with Docker images based on the ``openjdk:11-jre`` base image.~ :ref:`templates`

Release 1.5.0 - 06/11/2018
--------------------------

The documentation for release 1.5.0 of the GITB test service APIs is available `here <https://www.itb.ec.europa.eu/docs/services/1.5.0/>`__.

.. csv-table::
    :header: "Description of changes", "Relevant sections"
    :delim: ~

    The messaging services' callbacks are now implemented using the more flexible Apache CXF~ :ref:`messaging`, :ref:`templates`
    The template messaging service now also includes configurable proxy settings for test bed call-backs~ :ref:`messaging`, :ref:`templates`

Release 1.4.0 - 03/07/2018
--------------------------

Initial release of the documentation for the GITB test service APIs (release 1.4.0), available `here <https://www.itb.ec.europa.eu/docs/services/1.4.0/>`__.