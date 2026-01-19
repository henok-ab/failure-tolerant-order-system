## Dependency-Level Architecture Decisions

This section explains how external libraries support failure-tolerant guarantees and where their responsibilities end.
### Prisma

Prisma defines the transactional boundary of the system. Order creation and outbox event persistence are executed within a single database transaction to guarantee atomicity.

Failure Scenario Addressed:
- Database write succeeds but event publication fails

Mitigation:
- The outbox record remains persisted and is later processed by background workers.

Trade-off:
- Ties transactional logic to a relational database; horizontal scaling is limited by DB throughput.

### BullMQ + Redis

BullMQ is used for asynchronous order processing and retries. Redis provides durable storage for job states, allowing workers to crash and restart without losing in-flight jobs.

Failure Scenario Addressed:
- Worker crashes mid-processing
- Duplicate job execution

Mitigation:
- Job retry and deduplication mechanisms
- Idempotent handlers prevent side effects on re-execution

Trade-off:
- Redis availability becomes a system dependency

### class-validator

Input validation is enforced at the DTO layer before any state transition occurs. This ensures only valid commands reach the domain layer.

Failure Scenario Addressed:
- Invalid payload causing inconsistent state

Mitigation:
- Validation errors reject requests before persistence

Trade-off:
- Slight performance overhead at request boundaries

### @nestjs/schedule

Scheduled tasks are used to detect and recover from stalled or failed jobs. This includes retrying failed orders and cleaning up dead-letter records.

Failure Scenario Addressed:
- Silent failures requiring manual recovery

Mitigation:
- Automated periodic recovery tasks

Trade-off:
- Scheduled retries are eventual, not immediate

| Dependency      | Responsibility         | What It Does NOT Handle |
| --------------- | ---------------------- | ----------------------- |
| Prisma          | Atomic DB transactions | Message delivery        |
| BullMQ          | Job retries & ordering | Business correctness    |
| Redis           | Queue durability       | Long-term persistence   |
| class-validator | Input correctness      | Authorization           |
| nestjs/schedule | Periodic recovery      | Real-time guarantees    |
