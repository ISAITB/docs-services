Before diving into the GITB service specifications it is important to be aware of certain core concepts.

.. index:: Test case
.. _introduction__concepts__test_case:

Test case
~~~~~~~~~

A **test case** represents a set of steps and assertions that form a cohesive scenario for testing purposes. 
These are captured in a single XML file authored in the `GITB TDL`_ (GITB Test Description Language).

.. index:: Test suite
.. _introduction__concepts__test_suite:

Test suite
~~~~~~~~~~

A **test suite** is used to group together related test cases into a cohesive set. A test suite can include
metadata such a name and description that provide useful context to understand the purpose of its contained
tests. A test suite is expressed as an XML file and is bundled in a ZIP archive along with its contained 
test cases and the resources they use.

.. index:: Test session
.. _introduction__concepts__test_session:

Test session
~~~~~~~~~~~~

A **test session** represents a single execution of a test case. It typically involves the provision of
configuration from the user starting the test, goes through the steps the test case foresees, and eventually
completes providing the session's overall result.

.. index:: Test session context
.. index:: Session context
.. _introduction__concepts__test_session_context:

Test session context
~~~~~~~~~~~~~~~~~~~~

The **test session context** can be considered a persistent store specific to a given test session that is used to record
values. These values can either be configuration parameters provided before the test session starts, configuration parameters
generated during the test session's initiation, or values that are added dynamically during the session as a result of the 
ongoing test steps. The test session context is very important in that it gives a level of control above individual test 
steps that enable the testing of complete conversations. In addition, its ability to store and lookup arbitrary content dynamically
makes it possible to implement complex flows and control logic.

The test session context can be viewed as a map or keys to values, where each key is a string identifier and the value can be 
any supported type, including additional nested maps.

.. index:: Actor
.. index:: SUT (System Under Test)
.. _introduction__concepts__actor:

Actor
~~~~~

An **actor**, from the perspective of GITB, represents a party involved in the overall process that the test cases
aim to test. What exactly is an actor depends fully on the tests or the specification they relate to. Here are
some examples:

* A specification that foresees sending a message from one party to another could define a "Sender" and "Receiver" 
  actor to represent the involved parties.
* A solution that foresees a central EU portal exchanging information with national endpoints could define the "Portal" 
  and "National endpoint" as actors.
* A content specification (e.g. XML-based) for which we simply want to allow users to upload samples for validation 
  could define a "User" actor to represent this role in test cases.

Once actors are defined they play an important role in the testing process as follows:

* They define properties relevant to the testing (think of them as actor-specific configuration elements). Such properties
  are grouped into **endpoints**, named configuration sets that can be referenced in test cases.
* Each test case foresees that actors are either simulated by the Test Bed or are the focus of the test. In the latter case
  they are referred to as having a role of **SUT** (System Under Test).

.. index:: Service handlers
.. _introduction__concepts__service_handlers:

Service handlers
~~~~~~~~~~~~~~~~

**Service handlers** are effectively synonymous to the GITB test services. They represent from the perspective of a given test case
the implementation to carry out specific validation, messaging or processing steps. The distinction here is that the implementation of 
these handlers could also be a component, embedded within the Test Bed software itself, that implements the same operations but is 
called locally. Such embedded implementations are of course limited to truly generic capabilities that are commonly required.

More information on service handlers and embedded ones in particular can be looked up in the `GITB TDL documentation`_.
