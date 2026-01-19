# Failure-Tolerant Order System

## Problem
Order processing systems frequently fail under partial outages:
- Client retries cause duplicate orders
- Payment succeeds but database write fails
- Message brokers temporarily go offline

Naive CRUD-based systems break under these conditions.

## Goal
Build an order system that remains correct under failure by design.

## Core Guarantees
- Idempotent order creation
- No duplicate orders under retries
- Eventual consistency instead of strong consistency
- Safe retries with at-least-once delivery

## Non-Goals
- Strong consistency
- Instant order confirmation
- Full microservice complexity

## High-Level Approach
- API layer accepts idempotent requests
- Orders are persisted using an outbox pattern
- Asynchronous processing via message broker
- Retries and dead-letter queues for failure handling

## Core Dependencies & Rationale

This system prioritizes correctness under failure rather than feature velocity. The following dependencies were selected to enforce explicit guarantees instead of ad-hoc logic.

### Prisma (Database & Transactions)
Prisma is used as the ORM to enforce strict data modeling and transactional integrity. It enables atomic writes across the `orders` and `outbox` tables, which is required for the transactional outbox pattern.

### BullMQ + Redis (Reliable Background Processing)
BullMQ provides durable job queues with retry semantics and backoff strategies. Redis acts as the queue storage, allowing background workers to safely retry jobs without duplicating side effects.

### class-validator (DTO Validation)
class-validator enforces input validation at the boundary of the system. This prevents invalid data from entering state transitions, reducing downstream failure scenarios.

### @nestjs/schedule (Retries & Scheduled Recovery)
nestjs/schedule is used for controlled retries, delayed recovery tasks, and periodic cleanup of failed or stale jobs. This avoids reliance on infinite retries and manual intervention.


## How to Run (placeholder)
Coming soon.
