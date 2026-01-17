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

## How to Run (placeholder)
Coming soon.
