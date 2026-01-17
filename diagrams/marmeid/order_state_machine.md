```mermaid
stateDiagram-v2
    [*] --> CREATED: Order Persisted + Outbox Event
    
    state "CREATED" as CREATED
    note left of CREATED
        Idempotency check prevents
        duplicate processing.
    end note

    CREATED --> PROCESSING: Worker consumes job
    
    state "PROCESSING" as PROCESSING
    note right of PROCESSING
        External service
        call initiated.
    end note

    PROCESSING --> COMPLETED: External Service Success
    PROCESSING --> FAILED: [FAILURE] External Error or Timeout

    state "FAILED" as FAILED

    FAILED --> RETRYING: [RETRY] Policy allows (count < max)
    FAILED --> DEAD_LETTERED: [FATAL] Retry Limit Exceeded

    state "RETRYING" as RETRYING
    note right of RETRYING
        Exponential Backoff Applied
        (30s, 5m, 1h...)
    end note

    RETRYING --> PROCESSING: Delay elapsed + job re-queued

    state "COMPLETED" as COMPLETED
    
    state "DEAD_LETTERED" as DEAD_LETTERED
    note right of DEAD_LETTERED
        Manual Review Required
        Potential for Manual Replay
    end note

    COMPLETED --> [*]
    DEAD_LETTERED --> [*]