The ``finalize`` operation is called by the Test Bed when a test session has completed. Its purpose is to allow the messaging service to take care of
any clean-up actions on the completed session's state and ultimately remove the session itself. The session identifier in question is passed as part 
of the operation's parameters.

The following example presents an implementation of the ``finalize`` operation assuming the use of a separate component (``sessionManager``) to manage
sessions.

.. code-block:: java

    public Void finalize(FinalizeRequest parameters) {
        // Cleanup in-memory state for the completed session and remove it.
        sessionManager.destroySession(parameters.getSessionId());
        return new Void();
    }
