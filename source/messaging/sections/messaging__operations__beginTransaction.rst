The exchange of messages to and from the Test Bed always take place within a transaction. This transaction is used to determine the messaging handler 
implementation as well as the participating actors and the direction of the communication (the "from" and "to" actors). A transaction begins through
the `btxn`_ GITB TDL step at which time the Test Bed notifies the messaging service by calling its ``beginTransaction`` operation. This call includes:

    * The "from" and "to" actor names.
    * Any configuration properties passed specifically to the transaction.
    * The session identifier.

Typically no special action is needed on the side of the messaging service when a transaction starts. The implementation of the method is usually
left empty:

.. code-block:: java

    public Void beginTransaction(BeginTransactionRequest parameters) {
        return new Void();
    }
