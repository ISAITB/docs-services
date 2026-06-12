The ``endTransaction`` operation is the counterpart of :ref:`processing__operations__beginTransaction`. It is used when a processing transaction is considered as completed, either because it
was explicitly ended or because the relevant test session was terminated.

The processing service here is not expected to do much except from cleaning up any state that was being maintained for the session. If of course the service was not 
maintaining sessions the implementation of this operation will be empty.

An ``endTransaction`` implementation for a service that is designed to work with sessions would typically resemble the following example:

.. code-block:: java

    private Map<String, Map<String, Object>> sessions = new ConcurrentHashMap<>();

    public Void endTransaction(BasicRequest parameters) {
        // Retrieve the session ID from the received parameters.
        String sessionId = parameters.getSessionId();
        // Remove the corresponding session.
        sessions.remove(sessionId);
        return new Void();
    }
