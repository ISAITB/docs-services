The following simple test case makes use of the template services' sample implementations:

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <testcase id="sample_test_case" xmlns="http://www.gitb.com/tdl/v1/" xmlns:gitb="http://www.gitb.com/core/v1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gitb.com/tdl/v1/ ../../gitb_tdl.xsd">
        <metadata>
            <gitb:name>Sample test case</gitb:name>
            <gitb:version>1.0</gitb:version>
            <gitb:description>Test case illustrating a sample use of the template service sample implementations.</gitb:description>
        </metadata>
        <actors>
            <gitb:actor id="actor1" name="Actor 1" role="SUT"/>
            <gitb:actor id="actor2" name="Actor 2"/>
        </actors>
        <steps>
            <!-- 
                Request the message to send to the messaging service.
            -->
            <interact id="data" desc="Request message">
                <request name="messageToSend" desc="Enter the message to send:"/>
            </interact>
            <!--
                Send the message.
            -->
            <send id="step1" desc="Send message" handler="$DOMAIN{messagingServiceAddress}">
                <input name="messageToSend">$data{messageToSend}</input>
            </send>
            <!-- 
                Receive a response message.
                This is provided by calling http://localhost:8080/input?message=text.
            -->
            <receive id="step2" desc="Receive message" handler="$DOMAIN{messagingServiceAddress}"/>
            <!--
                Convert the received message to uppercase.
            -->
            <process id="result" handler="$DOMAIN{processingServiceAddress}" operation="uppercase">
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

If you want to run this on a local Test Bed instance you will need to first setup the test services:

    #. Use the template services to generate a sample validation, processing and messaging service.
    #. Adapt each service's ``application.properties`` configuration file (in ``src/main/resources``) to change its server's listen port (using property ``server.port``).
       You need to do this since all services by default bind to port 8080.
    #. Start each service in separate command consoles.

Once each service is up, you need to setup the Test Bed (documentation links provided for each step):

    #. `Log in`_ as the Test Bed admin.
    #. `Create a domain`_ and then `create a specification`_.
    #. In the created domain, `create parameters`_ named ``messagingServiceAddress``, ``processingServiceAddress`` and ``validationServiceAddress`` with the 
       address to the WSDLs of each respective service.
    #. `Upload the test suite`_ including the test case (available `on GitHub <https://github.com/ISAITB/sample-test-suites/tree/master/testSuites/usingSampleImplementationsFromTestServiceTemplate>`__ and as an `archive to download <https://github.com/ISAITB/sample-test-suites/raw/refs/heads/master/testSuites/usingSampleImplementationsFromTestServiceTemplate/testSuite.zip>`__).
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
