.. _templates:

Service template
================

An executable project template is available to facilitate the development of test support services. This template is packaged
as a `Maven Archetype`_ enabling you to generate a complete new service with a single command.

Using the template is not mandatory but doing so will save you significant effort. The GITB-specific code provided should be
complete to address your needs, whereas you will also find working implementations to handle certain of the more complex aspects
you would need to address (e.g. session management, call-backs). In addition, and regardless or whether you wish to build a 
service based on the template, it provides a valuable learning resource to understand GITB test service development.

To avoid providing simply an empty shell, the template service project has been built as a fully functioning web application that is
already setup to address simple demo scenarios. The scenario for each type of service API is selected to be straightforward allowing you
to understand what is going on without needing additional context, and to replace the included sample implementations
with your actual domain-specific needs. You can nonetheless skip these sample implementations and directly create empty operations.

In all cases included code should be self-explanatory but is nonetheless accompanied by comprehensive step-by-step documentation.

.. _templates__using:

Using the template
------------------

.. include:: /templates/sections/templates__using.rst

.. _templates__architecture:

Template service architecture and stack
---------------------------------------

.. include:: /templates/sections/templates__architecture.rst

.. _templates__samples:

Description of sample implementations
-------------------------------------

.. include:: /templates/sections/templates__samples.rst

.. _templates__example:

Example test case
-----------------

.. include:: /templates/sections/templates__example.rst
