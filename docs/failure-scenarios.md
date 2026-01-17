# Failure Scenarios

## 1. Client Retry
**Cause:** Network timeout  
**Risk:** Duplicate orders  

**Handling:**
- Client sends `Idempotency-Key`
- Server stores request hash
- Same key returns same order

---

## 2. Payment Success, DB Failure
**Cause:** DB crash after payment confirmation  

**Handling:**
- Order initially marked `PENDING`
- Payment event stored in outbox
- Background worker retries persistence

---

## 3. Message Broker Down
**Cause:** Kafka/RabbitMQ outage  

**Handling:**
- Events written to outbox table
- Publisher retries when broker recovers

