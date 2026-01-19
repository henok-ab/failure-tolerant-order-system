# 2️⃣ Failure Scenarios (Minimum 5 — Realistic, Not Hypothetical)

These are non-optional. Your system must behave correctly in all of them.

---

## Failure #1: Server Crash After DB Commit

### Scenario
- Order is saved
- Response never reaches client
- Client retries request

### Expected Behavior
- Same order returned
- No duplicate rows
- Idempotency key resolves correctly

### Bug if ignored
- Double orders
- Broken billing
- Phantom requests

---

## Failure #2: Worker Crash Mid-Processing

### Scenario
- Order marked `PROCESSING`
- Worker crashes before completion

### Expected Behavior
- Order remains recoverable
- Retry resumes safely
- No side-effects duplicated

### Bug if ignored
- Orders stuck forever
- Manual DB edits (death sentence)

---

## Failure #3: Duplicate Job Execution

### Scenario
- Queue delivers same job twice
- Worker processes both

### Expected Behavior
- Second execution is a no-op
- Order remains consistent

### Bug if ignored
- Double charges
- Duplicate fulfillment
- Silent corruption

---

## Failure #4: External Service Timeout

### Scenario
- Payment / fulfillment times out
- Result unknown

### Expected Behavior
- Order **NOT** marked completed
- Retry happens
- Side-effect remains idempotent

### Bug if ignored
- “Paid but not delivered” or worse: delivered twice

---

## Failure #5: Outbox Event Published Twice

### Scenario
- Outbox worker crashes after publish
- Same event republished on restart

### Expected Behavior
- Consumer ignores duplicate
- Order state unchanged

### Bug if ignored
- Ghost processing
- Event storms
- Data divergence

---

## Optional (If You Want to Look Serious)
- DB temporary read-only
- Queue backlog surge
- Clock skew / delayed retries

