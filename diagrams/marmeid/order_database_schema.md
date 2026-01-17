```mermaid
erDiagram
    %% Entities and Attributes
    
    orders {
        uuid id PK
        string external_reference "Unique Idempotency Key"
        order_status status "Enum: CREATED, PROCESSING, COMPLETED, etc."
        json payload "Full Order Details"
        integer retry_count "Default: 0"
        timestamp created_at
        timestamp updated_at
    }

    outbox_events {
        uuid id PK
        string aggregate_type "'order'"
        uuid aggregate_id FK "References orders.id"
        string event_type "'OrderCreated', 'OrderUpdated'"
        json payload "Event Data"
        outbox_status status "'PENDING', 'PUBLISHED'"
        timestamp created_at
        timestamp published_at "NULL until sent"
    }

    idempotency_keys {
        uuid id PK
        string key UK "Unique Request ID"
        string request_hash "SHA-256 of Payload"
        json response_snapshot "Cached API Response"
        timestamp created_at
    }

    job_failures {
        uuid id PK
        uuid order_id FK "References orders.id"
        string reason "Error Message/Stack Trace"
        timestamp failed_at
        timestamp last_retry_at
    }

    audit_logs {
        uuid id PK
        string entity_type "'order'"
        uuid entity_id "The ID of the affected record"
        string action "State Change or Event"
        json metadata "Contextual info"
        timestamp created_at
    }

    %% Relationships
    
    orders ||--o{ outbox_events : "atomic persistence"
    orders ||--o{ job_failures : "tracks failure history"
    orders ||--o{ audit_logs : "historical tracking"
    idempotency_keys |o--o| orders : "ensures single creation"

    %% Key Constraints and Design Notes
    %% Note: Mermaid ER doesn't support multiline notes well, 
    %% so we use labels and the summary below.
