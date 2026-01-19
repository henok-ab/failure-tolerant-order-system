# 3️⃣ Invariants (These Are Laws, Not Guidelines)

If any invariant is violated, the system is wrong — even if users don’t complain.

---

## Invariant 1: At-Most-Once Processing

An order must never produce side-effects more than once.

### Implication
- Workers must be idempotent.
- State checks happen before execution.
- If you rely on “hope the queue behaves,” you’ve already lost.

---

## Invariant 2: State Transitions Are Monotonic

States move forward only. Never backward.

### Why?
- Backward transitions hide bugs.
- They destroy auditability.
- They break recovery logic.
- If you need rollback, you model a new state, not reversal.

---

## Invariant 3: Persistence Before Side-Effects

No email, payment, webhook, or API call before state is safely stored.

### Why?
- Memory lies.
- Logs lie.
- Databases don’t (mostly).
- If you break this, crashes will permanently desync your system.

---

## Invariant 4: Every Operation Is Retryable

Any step can be safely retried without changing the final result.

If retrying changes outcome, your system is fragile by design.

---

## Invariant 5: Recovery Is a First-Class Feature

A human or system must be able to resume processing without guessing.

If recovery requires “checking logs and manually fixing rows,” your design failed.