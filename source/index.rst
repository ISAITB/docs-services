.. _contents:

GITB Services Documentation
===========================

Welcome to the documentation of the **GITB Test Services**. The GITB specifications foresee web service APIs that can be implemented by components
to extend the Test Bed's capabilities when executing test cases. This documentation provides you with details on how to implement and use such
services, as well as best practices to consider during development.

Chapter overview
----------------

.. csv-table::
   :class: full-width   
   :header: "Chapter", "Description"
   :delim: |

   :doc:`introduction/index` | Introducing the GITB test services and their key concepts.
   :doc:`validation/index` | Defining a custom validation service to handle test case validation needs.
   :doc:`messaging/index` | Defining a custom messaging service to send and receive messages.
   :doc:`processing/index` | Defining a custom processing service for custom utility extensions.
   :doc:`common/index` | Understanding common test service concepts and tasks.
   :doc:`templates/index` | Using the service generation template to create your test service project.
   :doc:`changelog/index` | Listing the highlights of the latest GITB services' release and changelog.

.. toctree::
   :maxdepth: 1
   :caption: Table of contents
   :hidden:
   :includehidden:

   introduction/index
   validation/index
   messaging/index
   processing/index
   common/index
   templates/index
   changelog/index
   genindex

.. note::
   Click **Ask AI** to get interactive help from our **AI assistant** based on the official documentation.

Related documentation
---------------------

Looking for other documentation related to the Interoperability Test Bed? Follow the links below:

.. |case1| raw:: html

   <a href="https://www.itb.ec.europa.eu/docs/tdl/latest/" target="_blank"><img src="https://www.itb.ec.europa.eu/files/docs-static/images/itb_gitb_tdl_documentation.png" rel="noopener noreferrer" alt="GITB TDL documentation"/></a>

.. |case2| raw:: html

   <a href="https://www.itb.ec.europa.eu/docs/guides/latest/" target="_blank"><img src="https://www.itb.ec.europa.eu/files/docs-static/images/itb_guides.png" rel="noopener noreferrer" alt="ITB guides"/></a>

.. |case3| raw:: html

   <a href="https://www.itb.ec.europa.eu/docs/itb-ta/latest/" target="_blank"><img src="https://www.itb.ec.europa.eu/files/docs-static/images/itb_guide_ta.png" rel="noopener noreferrer" alt="User guide (Test Bed administrator)"/></a>

.. csv-table::
    :widths: 33,33,33
    :delim: ~
    :class: image-caption-table

    |case1| ~ |case2| ~ |case3|
    Reference documentation for the GITB Test Description Language (TDL), used to define test suites and test cases. ~ Guides, tutorials and focused documentation on specific topics concerning Test Bed setup, configuration and use. ~ User guide for the Test Bed administrator covering the management and configuration of the GITB Test Bed software.
