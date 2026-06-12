The ``endTransaction`` operation is the counterpart of :ref:`messaging__operations__beginTransaction` and is called when the Test Bed executes the `etxn`_ GITB TDL step to signal
the end of a transaction. The call receives the session identifier but in terms of implementation can typically be left empty.

.. code-block:: java

    public Void endTransaction(BasicRequest parameters) {
        return new Void();
    }
