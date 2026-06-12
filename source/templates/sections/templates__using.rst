The sections below provide the information you need to use the template.

.. _templates__using__prerequisites:

Prerequisites
~~~~~~~~~~~~~

To use the template and run the resulting service app you will need the following:

    * A `Java Development Kit`_ (version 17 or higher).
    * `Apache Maven`_ (version 3.8 or higher).
    * Your ``PATH`` environment variable set to include the Java and Maven executables.
    * An internet connection (to read the templates and download dependencies).

To ensure that the tools needed are correctly installed you may issue ``mvn -version`` from a command prompt (and expect
to view output similar to the example):

.. code-block:: none

    D:\test>mvn -version

    Apache Maven 3.8.1 (05c21c65bdfed0f71a2f2ada8b84da59348c4c5d)
    Maven home: C:\tools\apache-maven-3.8.1\bin\..
    Java version: 17.0.6, vendor: Oracle Corporation, runtime: C:\tools\jdk-17.0.6
    Default locale: en_GB, platform encoding: Cp1252
    OS name: "windows 11", version: "10.0", arch: "amd64", family: "windows"

.. _templates__using__generating:

Generating a new service
~~~~~~~~~~~~~~~~~~~~~~~~

To generate a new service follow these steps:

    1. Create or select a folder in which you will store your service's project files.
    2. Open a command prompt to the selected folder and issue:

.. code-block:: none

    mvn archetype:generate "-DarchetypeGroupId=eu.europa.ec.itb" "-DarchetypeArtifactId=template-test-service" "-DarchetypeVersion=1.29.4"

This will download and run the project generation process. Provide the following values for the requested properties:

    * ``addMessagingService``: Whether to add a :ref:`messaging service endpoint <messaging>` (Y/N).
    * ``addValidationService``: Whether to add a :ref:`validation service endpoint <validation>` (Y/N).
    * ``addProcessingService``: Whether to add a :ref:`processing service endpoint <processing>` (Y/N).
    * ``addSampleImplementation``: Whether to add demo code for the included endpoints (Y/N).
    * ``groupId``: The Maven group ID for your service, typically matching your organisation's reverse domain name (e.g. "com.organisation").
    * ``artifactId``: The Maven artefact ID for your service (e.g. "test-services").
    * ``version``: The version number for your project (default is "1.0-SNAPSHOT").
    * ``package``: The root package under which all source code will be generated (the value provided for ``groupId`` is considered the default).
    * Review and confirm (Y).

You should now see output similar to the following:

.. code-block:: none

    ...
    [INFO] ----------------------------------------------------------------------------
    [INFO] Using following parameters for creating project from Archetype: template-test-service:1.29.4
    [INFO] ----------------------------------------------------------------------------
    [INFO] Parameter: groupId, Value: org.test
    [INFO] Parameter: artifactId, Value: test-services
    [INFO] Parameter: version, Value: 1.0-SNAPSHOT
    [INFO] Parameter: package, Value: org.test
    [INFO] Parameter: packageInPathFormat, Value: org/test
    [INFO] Parameter: package, Value: org.test
    [INFO] Parameter: addMessagingService, Value: y
    [INFO] Parameter: addProcessingService, Value: y
    [INFO] Parameter: groupId, Value: org.test
    [INFO] Parameter: addValidationService, Value: y
    [INFO] Parameter: addSampleImplementation, Value: y
    [INFO] Parameter: artifactId, Value: test-services
    [INFO] Parameter: version, Value: 1.0-SNAPSHOT
    [INFO] Executing META-INF/archetype-post-generate.groovy post-generation script
    [INFO] Project created from Archetype in dir: C:\workspace\test-services
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  24.956 s
    [INFO] Finished at: 2025-06-30T11:42:06+02:00
    [INFO] ------------------------------------------------------------------------

Your new app's project files are located in a subfolder named using the value you provided for ``artifactId``. Everything you need to know about
building, packaging and running your service is provided in file ``README.md`` at the root of the generated project.

.. note::
    **Troubleshooting:** If you see an error stating incompatible APIs it could mean your Maven plugins need an update. Re-run the command
    passing it also the ``-U`` flag (``mvn -U archetype:generate ...``).

.. _templates__using__building:

Building and running the service
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To build and run the test service application:

    1. Open a command prompt to the root of the generated service's project (where file ``pom.xml`` is located).
    2. Issue ``mvn spring-boot:run``. Note that this command may take a while upon first execution as it downloads all required dependencies. 

Following this command you should see output from the build and start-up of your service. The service will be successfully up and running once you see:

.. code-block:: none

    ...
    2023-09-10 15:39:02.225  INFO 17040 --- [  restartedMain] com.organisation.Application: Started Application in 4.093 seconds (JVM running for 4.565)

To shut down the service simply issue a ``CTRL-C`` on the console.

.. note::

    **Changing ports:** If you are running the application on the same workstation as the Test Bed you will likely see a "port in use" error
    at startup. In this case edit file ``application.properties`` and set ``server.port`` to an available port.

The project generated by the template is a Maven project, meaning that it can be built and packaged in the standard Maven way (e.g. using
``mvn clean install``). In terms of packaging, it produces an "all-in-one" executable JAR file and also include the required configuration
to create a `Docker`_ image. Documentation on each build command is provided in the project's ``README.md`` file.

Descriptions on how to access and use the running services are provided per case in ``README.md`` and :ref:`below <templates__samples>`.
