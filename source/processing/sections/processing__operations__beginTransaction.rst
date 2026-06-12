The ``beginTransaction`` operation is used to signal to the processing service that a new transaction/session is to be started. This operation may also receive 
zero or more configuration properties that could be specific to the transaction in question. In case your processing service does not need to maintain any state
across operations it can completely ignore transactions, leaving the implementation of the ``beginTransaction`` operation empty.

In case maintaining state is meaningful, the processing service is expected to create a session and return its identifier as part of the operation's response. This session is not related
to the test session running in the Test Bed but is rather used only for the internal purposes of the processing service. What the Test Bed guarantees is that the 
identifier that is assigned to this session will be provided back to the processing service as part of every relevant call.

When the processing service wants to maintain transaction/session state it will typically do the following steps in the ``beginTransaction`` operation:

    #. Generate a unique session identifier.
    #. Record the identifier in a way that it can subsequently retrieve it and its associated information. Implementing this session management could be recording it 
       in-memory in a thread-safe map construct or even in a database.
    #. Return the identifier as part of the response.

You also have the option of not returning a specific session identifier here in which case the Test Bed will consider the overall test session identifier instead. 
The difference in this last case is that you will register new sessions during the :ref:`process<processing__operations__process>` operation when a new session ID is encountered.

An example implementation from a session-aware processing service is provided in the following code block:

.. code-block:: java

    /*
     * Define a thread-safe map to store session identifiers and data.
     * Session data is recorded using a map of String keys to Objects.
     */
    private Map<String, Map<String, Object>> sessions = new ConcurrentHashMap<>();

    public BeginTransactionResponse beginTransaction(BeginTransactionRequest beginTransactionRequest) {
        // Generate a new unique session ID.
        String sessionId = UUID.randomUUID().toString();
        // Record the session ID and an initially empty session state.
        sessions.put(sessionId, new HashMap<String, Object>());
        BeginTransactionResponse response = new BeginTransactionResponse();
        // Return the generated session ID as part of the response.
        response.setSessionId(sessionId);
        return response;
    }

From this point on, subsequent operations relevant to the specific session can look it up using its identifier and either add data to its state or read existing
values.
