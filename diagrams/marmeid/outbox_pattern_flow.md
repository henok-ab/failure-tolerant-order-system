```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant API as API / Order Service
    box rgb(240, 245, 255) Database Boundary
        participant OT as Orders Table
        participant OX as Outbox Table
    end
    participant Pub as Outbox Publisher
    participant MQ as Message Queue
    participant Worker

    Note over Client, OT: Phase 1: Atomic Transactional Write
    Client->>API: POST /orders
    API->>API: Start DB Transaction
    
    rect rgb(235, 245, 235)
        Note right of API: Atomic Boundary
        API->>OT: Insert Order (State: CREATED)
        API->>OX: Insert Event (Status: PENDING)
        API->>API: Commit Transaction
    end

    API-->>Client: 202 Accepted (Order ID)
    Note over API: Crash Recovery: If API crashes here,<br/>data is safe in DB.

    Note over OT, MQ: Phase 2: Asynchronous Publishing
    loop Every 500ms
        Pub->>OX: Poll for 'PENDING' events
        OX-->>Pub: Return Events
        Pub->>MQ: Publish to Queue
        
        alt Publish Success
            Pub->>OX: Update Status to 'PUBLISHED'
        else Publish Failure / Crash
            Note over Pub: Event remains 'PENDING'<br/>Picked up by next poll
        end
    end

    Note over MQ, Worker: Phase 3: Consumer Execution
    MQ->>Worker: Consume Event
    Worker->>Worker: Process Logic
    Note over Worker: Idempotency prevents duplication<br/>if Step 11 failed/crashed.