```mermaid
graph TB

%% ========== External Producers ==========
subgraph Producers ["External Producers (API Consumers)"]
    P1[E-commerce Platform]
    P2[Fintech System]
    P3[Logistics System]
end

%% ========== Edge Layer ==========
subgraph Edge ["API Gateway & Safety Layer"]
    E1[HTTP Order Endpoint]
    E2[Idempotency Guard]
    E3[Schema & Business Validation]

    E1 --> E2 --> E3
end

%% ========== Synchronous Core ==========
subgraph Core ["Core Order Domain (Sync Transaction Boundary)"]
    O1[Order Application Service]
    O2[Order State Machine]

    subgraph Persistence ["Transactional Database"]
        T1[(Orders)]
        T2[(Outbox Events)]
    end

    O1 --> O2
    O2 --> T1
    O2 --> T2
end

%% ========== Async Transport ==========
subgraph Transport ["Asynchronous Message Broker"]
    Q1[Main Processing Queue]
    Q2[Retry Queue]
    Q3[Dead Letter Queue]
end

%% ========== Consumers ==========
subgraph Consumers ["Background Consumers"]
    W1[Order Execution Worker]
    W2[Retry Worker]
    W3[DLQ Inspector]
end

%% ========== External Systems ==========
subgraph Integrations ["External Dependencies"]
    X1[Payment Provider]
    X2[Fulfillment / Shipping]
    X3[Inventory System]
end

%% ========== Observability ==========
subgraph Ops ["Observability & Recovery"]
    M1[Centralized Logs & Metrics]
    M2[Manual Replay Console]
end

%% ========== Request Flow ==========
Producers -- "1. POST /orders" --> E1
E3 -- "2. Validated Command" --> O1

%% ========== Outbox Pattern ==========
T2 -. "3. Outbox Publisher" .-> Q1

%% ========== Async Processing ==========
Q1 --> W1
W1 <--> X1
W1 <--> X2
W1 <--> X3

%% ========== Failure Handling ==========
W1 -- "Transient Failure" --> Q2
Q2 --> W2
W2 -- "Retries Exhausted" --> Q3
Q3 --> W3

%% ========== State Feedback ==========
W1 & W2 -- "State Transition" --> O2

%% ========== Monitoring ==========
E1 & O1 & W1 & W2 -.-> M1
M2 -- "Replay Event" --> Q1

%% ========== Styling ==========
style Persistence fill:#f9f,stroke:#333,stroke-width:2px
style Transport fill:#bbf,stroke:#333
style Integrations fill:#dfd,stroke:#white
style Core fill:#fff4dd,stroke:#d4a017
