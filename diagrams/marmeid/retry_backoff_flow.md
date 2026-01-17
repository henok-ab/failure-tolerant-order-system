```mermaid
flowchart TD
    Start([Worker Consumes Job]) --> IdemCheck{Idempotency Check}
    
    IdemCheck -- Already Completed --> AckEarly[Acknowledge & Discard]
    IdemCheck -- New/Pending --> Exec[Execute Business Logic & External Calls]
    
    Exec --> Success{Successful?}
    
    %% Success Path
    Success -- Yes --> UpdateComp[Update State: COMPLETED]
    UpdateComp --> EmitSuccess[Emit Success Metrics]
    EmitSuccess --> Ack[Acknowledge Message]
    Ack --> End([End Flow])
    
    %% Failure Path
    Success -- No --> LogFail[Record Failure Reason]
    LogFail --> IncRetry[Increment Attempt Counter]
    
    IncRetry --> LimitCheck{Retry Limit Reached?}
    
    %% Retry Path
    LimitCheck -- No --> CalcBackoff[Calculate Backoff Delay]
    CalcBackoff --> NoteBackoff[\"Exponential: 1s, 5s, 30s... + Jitter"\]
    
    NoteBackoff --> UpdateRetry[Update State: RETRYING]
    UpdateRetry --> Requeue[Re-queue Message with Delay]
    Requeue --> LogRetry[Log Attempt #X]
    LogRetry --> End
    
    %% DLQ Path
    LimitCheck -- Yes --> UpdateDLQ[Update State: DEAD_LETTERED]
    UpdateDLQ --> MoveDLQ[Move to Dead-Letter Queue]
    MoveDLQ --> Alert[Emit Alert & Error Metrics]
    Alert --> End

    %% Styling
    style Success fill:#f0fdf4,stroke:#166534
    style LimitCheck fill:#fff1f2,stroke:#991b1b
    style MoveDLQ fill:#fee2e2,stroke:#dc2626
    style Requeue fill:#e0f2fe,stroke:#075985