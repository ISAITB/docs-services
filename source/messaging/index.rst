.. _messaging:

Messaging services
==================

**GITB messaging services** are key components used by the Test Bed to extend its communication capabilities. A messaging service allows
the abstraction of messaging details behind logical operations to send and receive messages, the implementation details of which are 
contained within the service implementation. Furthermore, any type of communication can be supported, both in terms of the underlying 
protocol as well as in terms of synchronicity.

A messaging service is typically used to act as a **communication adapter** between the Test Bed and an external system. Acting in this role 
the messaging service sends messages from the Test Bed to the system and also from the system to the Test Bed, exposing the information 
sent and received for use by the test session. A service could however also be used as a **simulator**, realising a test actor for the purpose 
of a test session without the presence of an actual system. It would be up to the messaging service to determine what needs to happen when it 
is asked to send a message, and also under what conditions will it signal a message's reception to the Test Bed.

Messaging services operate using a concept of **sessions** which are linked one-to-one with the test sessions running in the Test Bed. Over the 
course of such sessions the messaging service may maintain on its side any required state that helps add context to the overall messaging
conversation. The service may use this session state to define properties relevant to multiple related calls and also to keep track of the actual
communication to and from remote systems. This latter point is frequently leveraged in messaging services that are used in relation to
asynchronous communication where the service needs to be able to correlate received messages to existing test sessions.

To better understand this last point consider the example of a test on asynchronous message posting between System A and System B:

    #. The Test Bed, simulating System A, posts a message for the actual System B on a remote queue (consider it a bulletin board).
    #. System B is expected to asynchronously read the message and take some action.
    #. Once complete, System B prepares a response in which it references the received message and provides the action's result.
    #. System B posts this response message on the remote queue for System A (the Test Bed) to pick up.
    #. The Test Bed picks up the response message and validates its contents.

An implementation of a messaging service for this type of communication would, upon reception of :ref:`messaging__operations__send` calls, post the message on the queue.
When receiving a :ref:`messaging__operations__receive` call, the service will start polling the message queue to see if a new message has arrived from System B, and if so, 
will notify the Test Bed. If the queue in question is used by multiple systems concurrently and potentially in multiple concurrent test sessions, 
we are faced with the problem of how to correlate messages with test sessions. This is a prime case where maintaining state in the messaging
service is key. Doing so typically involves the following steps:

    #. When the test session starts the messaging service creates a session.
    #. At an appropriate time, either at test session start, at transaction start, or upon receiving a :ref:`messaging__operations__receive` call, the messaging service
       records correlation metadata in the session's state (the session identifier is passed by the Test Bed on every call).
    #. During its polling, the messaging service checks new messages against the correlation data of its active test sessions.
    #. When a match is made, the service notifies the relevant test session passing it the received content.

Overall the state recorded by the messaging service can be as simple or as complicated as needed. In certain scenarios the service may maintain even
complete messages in memory in order to subsequently determine what should happen when the Test Bed signals a :ref:`messaging__operations__receive`. Always keep in mind that
when the Test Bed executes a `send`_ or `receive`_ step these are more logical operations whereas what actually happens and when is up to the
messaging service. Such concerns represent key design decisions you need to take when implementing your service.

.. index:: notifyForMessage
.. _messaging__callbacks:

Test Bed call-backs
-------------------

.. include:: /messaging/sections/messaging__callbacks.rst

.. _messaging__implementing:

Implementing the service
------------------------

.. include:: /messaging/sections/messaging__implementing.rst

.. index:: getModuleDefinition (Messaging)
.. _messaging__operations__getModuleDefinition:

getModuleDefinition
~~~~~~~~~~~~~~~~~~~

.. include:: /messaging/sections/messaging__operations__getModuleDefinition.rst

.. index:: initiate
.. _messaging__operations__initiate:

initiate
~~~~~~~~

.. include:: /messaging/sections/messaging__operations__initiate.rst

.. index:: beginTransaction (Messaging)
.. _messaging__operations__beginTransaction:

beginTransaction
~~~~~~~~~~~~~~~~

.. include:: /messaging/sections/messaging__operations__beginTransaction.rst

.. index:: send
.. _messaging__operations__send:

send
~~~~

.. include:: /messaging/sections/messaging__operations__send.rst

.. index:: receive
.. _messaging__operations__receive:

receive
~~~~~~~

.. include:: /messaging/sections/messaging__operations__receive.rst

.. index:: endTransaction (Messaging)
.. _messaging__operations__endTransaction:

endTransaction
~~~~~~~~~~~~~~

.. include:: /messaging/sections/messaging__operations__endTransaction.rst

.. index:: finalize
.. _messaging__operations__finalize:

finalize
~~~~~~~~

.. include:: /messaging/sections/messaging__operations__finalize.rst

.. _messaging__configuring:

Configuring the web service endpoint
------------------------------------

.. include:: /messaging/sections/messaging__configuring.rst

.. _messaging__using_test_case:

Using the service through a test case
-------------------------------------

.. include:: /messaging/sections/messaging__using_test_case.rst

.. _messaging__using_standalone:

Using the service standalone
----------------------------

.. include:: /messaging/sections/messaging__using_standalone.rst
