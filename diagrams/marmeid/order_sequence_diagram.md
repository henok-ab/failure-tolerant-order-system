```mermaid
sequenceDiagram
    autonumber
    participant Client as Client System
    participant API as API Gateway
    participant IDEM as Idempotency Service
    participant OS as Order Service
    participant DB as Database (Orders + Outbox)
    participant MQ as Message Queue
    participant WP as Worker Process
    participant EXT as External Service
    participant MON as Monitoring & Logs

    Note over Client, EXT: Main Success Flow

    Client->>API: Create Order (Idempotency Key)
    activate API
    API->>IDEM: Check Idempotency Key
    activate IDEM
    IDEM-->>API: Key Unique / Not Processed
    deactivate IDEM
    
    API->>OS: Process Order Request
    activate OS
    OS->>OS: Set State: CREATED
    
    rect rgb(240, 240, 240)
        Note right of DB: Single Atomic Transaction
        OS->>DB: Save Order Record
        OS->>DB: Save Outbox Event
        DB-->>OS: Transaction Commit
    end
    
    OS-->>API: Order Accepted
    deactivate OS
    API-->>Client: 202 Accepted (Order ID)
    deactivate API

    Note over DB, MQ: Asynchronous Processing Begins
    
    DB->>MQ: Publish Outbox Event
    activate MQ
    MQ->>WP: Consume Message
    activate WP
    
    WP->>DB: Update State: PROCESSING
    WP->>EXT: Call External Service (e.g., Payment)
    activate EXT
    EXT-->>WP: Success Response
    deactivate EXT
    
    WP->>DB: Update State: COMPLETED
    WP->>MON: Log Success & Record Metrics
    WP-->>MQ: ACK Message
    deactivate WP
    deactivate MQ

    Note over Client, MON: Failure & Retry Flow (Alt Path)

    rect rgb(255, 235, 235)
        MQ->>WP: Consume Message (Retry #1)
        activate WP
        WP->>EXT: Call External Service
        activate EXT
        EXT-->>WP: 500 Internal Error / Timeout
        deactivate EXT
        
        alt Retry Limit Not Exceeded
            WP->>DB: Update State: FAILED (Transient)
            WP->>MQ: Re-queue with Exponential Backoff
            WP->>MON: Log Warning (Retry Scheduled)
        else Retry Limit Exceeded
            WP->>MQ: Move to Dead-Letter Queue (DLQ)
            WP->>DB: Update State: FAILED (Permanent)
            WP->>MON: Trigger Alert & Log Fatal Error
        end
        deactivate WP
    end

    Note over Client, MON: Crash Recovery Flow

    rect rgb(230, 245, 255)
        Note right of WP: Worker crashes before ACK
        MQ->>WP: Re-deliver Message (Unacknowledged)
        activate WP
        WP->>IDEM: Check Order State / Idempotency
        IDEM-->>WP: Already Processing / Created
        WP->>WP: Resume from Last Known State
        deactivate WP
    end
