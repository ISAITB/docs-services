Template services
=================

To facilitate the development of test services, a set of executable templates are available for your use. These templates are packaged
as Maven Archetypes [REF] enabling you to generate a complete new service with a single command.

Using the templates is not mandatory but doing so will save you significant effort. The GITB-specific code provided should be
complete to address your needs, whereas you will also find working implementations to handle certain of the more complex aspects
you would need to address (e.g. session management, call-backs). In addition, and regardless or whether you wish to build a 
service based on the templates, they provide a valuable learning resource to understand GITB service development.

To avoid providing simply an empty shell, each template service has been built as a fully functioning web application that is 
already setup to address simple scenarios. The scenario for each case is selected to be very simple allowing you to understand
what is going on without needing additional context and replace the sample implementations with your actual domain-specific needs.
The code should be self-explanatory but is nonetheless accompanied by comprehensive step-by-step documentation.

Using the templates
-------------------

The sections below provide the information you need to use the templates.

Prerequisites
~~~~~~~~~~~~~

To run and use the services you will need the following:

    * A Java Development Kit [REF] (version 8 or higher).
    * Maven [REF] (version 3 or higher).
    * Your ``PATH`` environment variable set to include the Java and Maven executables.
    * An internet connection (to read the templates and download dependencies).

To ensure that the tools needed are correctly installed you may issue ``mvn -version`` from a command prompt (and expect
to view output similar to the example)::

    D:\test>mvn -version

    Apache Maven 3.5.2 (138edd61fd100ec658bfa2d307c43b76940a5d7d; 2017-10-18T09:58:13+02:00)
    Maven home: D:\tools\apache-maven-3.5.2\bin\..
    Java version: 1.8.0_152, vendor: Oracle Corporation
    Java home: D:\tools\jdk1.8.0_152\jre
    Default locale: en_GB, platform encoding: Cp1252
    OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"

Generating a new service
~~~~~~~~~~~~~~~~~~~~~~~~

To generate a new service follow these steps:

    1. Create or select a folder in which you will store your service's project files.
    2. Open a command prompt to the selected folder and issue::

        mvn archetype:generate -DarchetypeGroupId=eu.europa.ec.itb -DarchetypeArtifactId=TEMPLATE_ID

       replacing ``TEMPLATE_ID`` depending on the service type you want as follows:

           * ``template-validation-service`` for a validation service.
           * ``template-processing-service`` for a processing service.
           * ``template-messaging-service`` for a messaging service.

       .. note::
           You may also specify ``-DarchetypeVersion=VERSION`` (where ``VERSION`` is a specific template version). Not specifying
           it will result in the latest version to be used.

    3. Provide values for the requested properties (in sequence):

        * ``groupId``: This is the Maven group ID for your service, typically matching your organisation's reverse domain name (e.g. "com.organisation").
        * ``artifactId``: This is the Maven artefact ID for your service (e.g. "simple-service").
        * ``version``: This is the version number to set for your project ("1.0-SNAPSHOT" being the default).
        * ``package``: This is the root package under which all source code will be generated (the value provided for ``groupId`` is considered the default).

    4. Review your input and confirm with ``Y`` (for "Yes").

You should now see output similar to the following::

    ...
    [INFO] ----------------------------------------------------------------------------
    [INFO] Using following parameters for creating project from Archetype: template-processing-service:1.4.0.1
    [INFO] ----------------------------------------------------------------------------
    [INFO] Parameter: groupId, Value: com.organisation
    [INFO] Parameter: artifactId, Value: simple-service
    [INFO] Parameter: version, Value: 1.0-SNAPSHOT
    [INFO] Parameter: package, Value: com.organisation
    [INFO] Parameter: packageInPathFormat, Value: com/organisation
    [INFO] Parameter: package, Value: com.organisation
    [INFO] Parameter: version, Value: 1.0-SNAPSHOT
    [INFO] Parameter: groupId, Value: com.organisation
    [INFO] Parameter: artifactId, Value: simple-service
    [INFO] Project created from Archetype in dir: D:\test\simple-service
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: 07:26 min
    [INFO] Finished at: 2018-08-31T15:31:33+02:00
    [INFO] Final Memory: 15M/220M
    [INFO] ------------------------------------------------------------------------

Your new service's project files are located in a subfolder named using the value you provided for ``artifactId``. Everything you need to know about 
building, packaging and running your service is provided in file ``README.md`` at the root of the generated project.

Building and running the service
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To build and run the service:

    1. Open a command prompt to the root of the generated service's project (where file ``pom.xml`` is located).
    2. Issue ``mvn spring-boot:run``. Note that this command may take a while upon first execution as it downloads all required dependencies. 

Following this command you should see output from the build and start-up of your service. The service will be successfully up and running once you see::

    ...
    2018-08-31 15:39:02.225  INFO 17040 --- [  restartedMain] com.organisation.Application: Started Application in 4.093 seconds (JVM running for 4.565)

To shut down the service simply issue a ``CTRL-C`` on the console.

The projects generated by the templates are Maven projects, meaning that they can be built and packaged in the standard Maven way (e.g. using ``mvn clean install``).
In terms of packaging, the service projects produce an "all-in-one" executable JAR file and also include the required configuration to create a Docker [REF] image.
Documentation on each build command is provided in the project's ``README.md`` file.

Descriptions on how to access and use the running services are provided per case in [REF]. 

Template service architecture and stack
---------------------------------------

All services produced by the available templates are web applications built using the Spring Boot framework [REF]. In terms of design it is interesting to highlight
certain key points:

    * Each service decouples as much as possible the GITB-specific code from the domain-specific logic you will want to implement.
    * Supporting components are already provided to address e.g. session management.
    * Configuration of the service uses the standard the Spring Boot ``application.properties`` file.
    * Web services are implemented using the CXF framework.

In terms of development tools:

    * Maven is used for all build tasks.
    * Spring Boot's auto-reload capabilities are activated to facilitate development.
    * The configuration and commands for Docker image creation are included.

Description of sample implementations
-------------------------------------

The following sections briefly describe the existing sample implementations for each service and how to use them.

Template validation service
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The sample implementation is used to test that two texts match. It expects to be called with three inputs:

    * "text" a string representing the text to check.
    * "expected" a string representing the value the "text" input needs to match.
    * "mismatchIsError" an optional boolean to determine whether a mismatch is an error (the default) or a warning.

The WSDL of the service (using the provided configuration) is available at: http://localhost:8080/services/validation?WSDL.

Template processing service
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The sample implementation is used to process a provided text returning its uppercase or lowercase equivalent. It foresees two operations:

    * "uppercase" to convert an input named "input" to its uppercase equivalent.
    * "lowercase" to convert an input named "input" to its lowercase equivalent.

The WSDL of the service (using the provided configuration) is available at: http://localhost:8080/services/process?WSDL.

Template messaging service
~~~~~~~~~~~~~~~~~~~~~~~~~~

The sample implementation offers the following behaviour:

    * When asked by the test bed to ``send`` a message it simply logs the message in its log file. The name of the input corresponding to the 
      message is "messageToSend".
    * When asked to ``receive`` a message it will listen on an exposed REST service for ``GET`` request with two URL parameters: a text value 
      (parameter "message") and the test session identifier it relates to (parameter "session"). If the service is called with no "message" parameter 
      it considers an empty string, whereas when the "session" parameter is missing it will trigger all active sessions.

Using the provided configuration, the WSDL of the service is available at: http://localhost:8080/services/messaging?WSDL. The REST service that is used
to provide a text to send back to the test bed is available at http://localhost:8080/input (called for example as http://localhost:8080/input?session=SESSION_ID&message=text).

Example test case
-----------------

The following simple test case makes use of the template services' sample implementations:

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <testcase id="sample_test_case" xmlns="http://www.gitb.com/tdl/v1/" xmlns:gitb="http://www.gitb.com/core/v1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gitb.com/tdl/v1/ ../../gitb_tdl.xsd">
        <metadata>
            <gitb:name>sample_test_case</gitb:name>
            <gitb:version>1.0</gitb:version>
            <gitb:description>Test case illustrating a sample use of the template service sample implementations.</gitb:description>
        </metadata>
        <variables>
            <var name="messageToSend" type="string"/>
        </variables>
        <actors>
            <gitb:actor id="actor1" name="Actor 1" role="SUT"/>
            <gitb:actor id="actor2" name="Actor 2" role="SIMULATED"/>
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
            <bptxn txnId="pt1" handler="$DOMAIN{processingServiceAddress}"/>
            <process id="result" txnId="pt1">
                <operation>uppercase</operation>
                <input name="input">$step2{messageReceived}</input>
            </process>
            <eptxn txnId="pt1"/>
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

    #. Use all available template services to generate a sample validation, processing and messaging service.
    #. Adapt each service's ``application.properties`` configuration file (in ``src/main/resources``) to change its server's listen port (using property ``server.port``).
    #. In different command consoles start each service.

Once each service is up, you need to setup the test bed:

    #. Create a domain and specification in your local test bed (see [REF]).
    #. Define in the created domain parameters ``messagingServiceAddress``, ``processingServiceAddress`` and ``validationServiceAddress`` with the 
       address to the WSDLs of each respective service.
    #. Upload the test suite including this test case (available here [:download:`test_suite.zip`]).
    #. Create a System [REF].
    #. Create a conformance statement selecting the created domain, specification and the test case's SUT actor "Actor 1".
    #. Execute the test case.