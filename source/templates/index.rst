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

    mvn archetype:generate "-DarchetypeGroupId=eu.europa.ec.itb" "-DarchetypeArtifactId=template-test-service" "-DarchetypeVersion=1.24.0"

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
    [INFO] Using following parameters for creating project from Archetype: template-test-service:1.24.0
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
    [INFO] Finished at: 2024-10-28T11:42:06+02:00
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

    **Changing ports:** If you are running the application on the same workstation as the test bed you will likely see a "port in use" error
    at startup. In this case edit file ``application.properties`` and set ``server.port`` to an available port.

The project generated by the template is a Maven project, meaning that they can be built and packaged in the standard Maven way (e.g. using
``mvn clean install``). In terms of packaging, it produces an "all-in-one" executable JAR file and also include the required configuration
to create a `Docker`_ image. Documentation on each build command is provided in the project's ``README.md`` file.

Descriptions on how to access and use the running services are provided per case in ``README.md`` and :ref:`below <templates__samples>`.

.. _templates__architecture:

Template service architecture and stack
---------------------------------------

Using the template project produces a web application built using the `Spring Boot`_ framework. In terms of design it is interesting to highlight
certain key points:

    * Supporting components are already provided to address e.g. session management.
    * Configuration of the service uses the standard Spring Boot `application.properties`_ file.
    * Web services are implemented using the `Apache CXF`_ framework.
    * A series of useful utility methods are made available that would cover most basic GITB-specific coding needs.

In terms of development tools:

    * Maven is used for all build tasks.
    * Spring Boot's `auto-reload capabilities`_ are activated to facilitate development.
    * The configuration and commands for Docker image creation are included.

.. _templates__samples:

Description of sample implementations
-------------------------------------

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

    * When asked by the test bed to :ref:`messaging__operations__send` a message it simply logs the message in its log file. The name of the input corresponding to the 
      message is "messageToSend".
    * When asked to :ref:`messaging__operations__receive` a message it will listen on an exposed REST service for ``GET`` requests with two URL parameters: a text value 
      (parameter "message") and the test session identifier it relates to (parameter "session"). If the service is called with no "message" parameter 
      it considers an empty string, whereas when the "session" parameter is missing it will trigger all active sessions.

Using the default configuration, the WSDL of the service is available at: http://localhost:8080/services/messaging?WSDL. The REST service that is used
to provide a text for the test bed to receive is available at http://localhost:8080/input (called for example as http://localhost:8080/input?session=SESSION_ID&message=TEXT).

.. _templates__samples__processing:

Template processing service
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The sample implementation is used to process a provided text returning its uppercase or lowercase equivalent. It foresees two operations:

    * "uppercase" to convert an input named "input" to its uppercase equivalent.
    * "lowercase" to convert an input named "input" to its lowercase equivalent.

The WSDL of the service (using the default configuration) is available at: http://localhost:8080/services/process?WSDL.

.. _templates__example:

Example test case
-----------------

The following simple test case makes use of the template services' sample implementations:

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <testcase id="sample_test_case" xmlns="http://www.gitb.com/tdl/v1/" xmlns:gitb="http://www.gitb.com/core/v1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gitb.com/tdl/v1/ ../../gitb_tdl.xsd">
        <metadata>
            <gitb:name>Sample test case</gitb:name>
            <gitb:version>1.0</gitb:version>
            <gitb:description>Test case illustrating a sample use of the template service sample implementations.</gitb:description>
        </metadata>
        <variables>
            <var name="messageToSend" type="string"/>
        </variables>
        <actors>
            <gitb:actor id="actor1" name="Actor 1" role="SUT"/>
            <gitb:actor id="actor2" name="Actor 2"/>
        </actors>
        <steps>
            <!-- 
                Request the message to send to the messaging service.
            -->
            <interact desc="Request message" with="actor1">
                <request desc="Enter the message to send:">$messageToSend</request>
            </interact>
            <btxn from="actor1" to="actor2" txnId="t1" handler="$DOMAIN{messagingServiceAddress}"/>
            <!-- 
                Send the message.
            -->
            <send id="step1" desc="Send message" from="actor1" to="actor2" txnId="t1">
                <input name="messageToSend">$messageToSend</input>
            </send>
            <!-- 
                Receive a response message.
                This is provided by calling http://localhost:8080/input?message=text.
            -->
            <receive id="step2" desc="Receive message" from="actor2" to="actor1" txnId="t1"/>
            <etxn txnId="t1"/>
            <!-- 
                Convert the received message to uppercase.
            -->
            <process id="result" handler="$DOMAIN{processingServiceAddress}">
                <operation>uppercase</operation>
                <input name="input">$step2{messageReceived}</input>
            </process>
            <!--
                Check to see that the uppercased message matches "HELLO!"
            -->
            <verify handler="$DOMAIN{validationServiceAddress}" desc="Validate text">
                <input name="text">$result{output}</input>
                <input name="expected">'HELLO!'</input>
            </verify>		
        </steps>
    </testcase>

If you want to run this on a local test bed instance you will need to first setup the test services:

    #. Use the template services to generate a sample validation, processing and messaging service.
    #. Adapt each service's ``application.properties`` configuration file (in ``src/main/resources``) to change its server's listen port (using property ``server.port``).
       You need to do this since all services by default bind to port 8080.
    #. Start each service in separate command consoles.

Once each service is up, you need to setup the test bed (documentation links provided for each step):

    #. `Log in`_ as the test bed admin.
    #. `Create a domain`_ and then `create a specification`_.
    #. In the created domain, `create parameters`_ named ``messagingServiceAddress``, ``processingServiceAddress`` and ``validationServiceAddress`` with the 
       address to the WSDLs of each respective service.
    #. `Upload the test suite`_ including the test case (available here [:download:`sample_test_suite.zip`]).
    #. `Create a System`_.
    #. `Create a conformance statement`_ selecting the created domain, specification and the test case's SUT actor "Actor 1".
    #. `Execute the test case`_.

.. _Maven Archetype: https://maven.apache.org/guides/introduction/introduction-to-archetypes.html
.. _Java Development Kit: http://www.oracle.com/technetwork/java/javase/downloads/index.html
.. _Apache Maven: https://maven.apache.org/
.. _Docker: https://www.docker.com/
.. _Spring Boot: https://spring.io/projects/spring-boot
.. _application.properties: https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html
.. _Apache CXF: https://cxf.apache.org/
.. _auto-reload capabilities: https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-devtools.html#using-boot-devtools-restart
.. _Create a domain: https://www.itb.ec.europa.eu/docs/itb-ta/latest/domainDashboard/index.html#create-domain
.. _create a specification: https://www.itb.ec.europa.eu/docs/itb-ta/latest/domainDashboard/index.html#create-specification
.. _create parameters: https://www.itb.ec.europa.eu/docs/itb-ta/latest/domainDashboard/index.html#create-parameter
.. _Upload the test suite: https://www.itb.ec.europa.eu/docs/itb-ta/latest/domainDashboard/index.html#upload-test-suite
.. _Create a System: https://www.itb.ec.europa.eu/docs/itb-ta/latest/validateTestSetup/index.html#create-a-new-system
.. _Create a conformance statement: https://www.itb.ec.europa.eu/docs/itb-ta/latest/validateTestSetup/index.html#create-a-conformance-statement
.. _Execute the test case: https://www.itb.ec.europa.eu/docs/itb-ta/latest/validateTestSetup/index.html#execute-tests
.. _Log in: https://www.itb.ec.europa.eu/docs/itb-ta/latest/login/index.html