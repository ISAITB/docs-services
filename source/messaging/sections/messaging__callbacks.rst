Messaging services differ from validation and processing services in that they need to support asynchronous operations. When the Test Bed tells the
service to :ref:`messaging__operations__send` a message the operation occurs synchronously. However, when the Test Bed signals a :ref:`messaging__operations__receive` to the service, the corresponding
message will often not be available immediately; the service will typically need to wait until the remote system sends a message that it can
then pass onto the Test Bed. To address this need the GITB messaging service API foresees a **call-back operation** to notify the Test Bed. The steps that follow
summarise how this is used to signal received messages:

    #. When the Test Bed initiates a test session it contacts the messaging service with operation :ref:`messaging__operations__initiate`. As part of this operation it
       passes its addressing information through `WS-Addressing`_ that adds the reply address in a specific SOAP header element. The address is 
       specifically the one for its call-back service endpoint.
    #. In the implementation of the :ref:`messaging__operations__initiate` operation the service creates a session and stores in it the received Test Bed call-back address.
    #. When the Test Bed runs a `receive`_ step it calls the service's :ref:`messaging__operations__receive` operation and blocks until the expected message is received.
    #. The messaging service eventually receives a message from the remote system and, by comparing appropriate correlation information in the message
       and the active sessions, detects the test session to notify.
    #. The service then constructs a ``TAR`` report containing the received information and provides it along with the session identifier in a call to the 
       Test Bed's ``notifyForMessage`` operation. The address for this call is obtained from the addressing information stored earlier in the session.
    #. The Test Bed, in the implementation of the ``notifyForMessage`` operation, extracts the information, stores it in the session context and signals the 
       relevant test session to proceed.

.. note::
    Using `WS-Addressing`_ to determine the reply-to address for the Test Bed is not strictly necessary. You can also define the address as part of the
    service's configuration if this is not expected to change. It's value would be ``http://[GITB_SRV_HOST]:[GITB_SRV_PORT]/itbsrv/MessagingClient``.

.. _messaging__configuration:

Exchanging configuration for a test session
-------------------------------------------

An important capability of messaging services is the possibility to provide back to the Test Bed configuration properties to be used in a specific test 
session. This occurs as part of the initialisation of a test session (see operation :ref:`messaging__operations__initiate`) allowing session-specific configuration to be 
defined. As an example consider a messaging service that is to receive messages from a remote system, in which a session-specific token needs to be 
included. This token can be generated when the test session initialises and presented to the tester in order to configure appropriately the remote system.

Overall the configuration exchange that takes place at the start of a test session can be summarised as follows:

    #. A user selects a test case to execute.
    #. The Test Bed initialises a new test session.
    #. The configuration from the side of the Test Bed (e.g. fixed values from the test case or values provided by the user for the System Under Test)
       are sent to the messaging service.
    #. The messaging service processes the received configuration and optionally generates configuration values to return to the test session.
    #. Any generated configuration from the messaging service is presented to the user. This is also stored in the test session context for use
       in test case steps.
    #. The user can now start the test session.

The exchange of configuration for a test session takes place through the :ref:`messaging__operations__initiate` operation. Check its documentation to see how to manage this.
