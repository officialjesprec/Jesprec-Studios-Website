---
name: error-handling-patterns
description: Use when implementing error handling, designing APIs, or improving application reliability. Master patterns across languages including exceptions, Result types, error propagation, and graceful degradation.
---

# Error Handling Patterns

Build resilient applications with robust error handling strategies that gracefully handle failures and provide excellent debugging experiences.

## When to Use This Skill
- Implementing error handling in new features
- Designing error-resilient APIs
- Debugging production issues
- Improving application reliability
- Creating better error messages for users and developers
- Implementing retry and circuit breaker patterns
- Handling async/concurrent errors
- Building fault-tolerant distributed systems

## Core Concepts

### 1. Error Handling Philosophies
**Exceptions vs Result Types:**
- **Exceptions:** Traditional try-catch, disrupts control flow. Use for unexpected errors, exceptional conditions.
- **Result Types:** Explicit success/failure, functional approach. Use for expected errors, validation failures.
- **Error Codes:** C-style, requires discipline.
- **Option/Maybe Types:** For nullable values.
- **Panics/Crashes:** Unrecoverable errors, programming bugs.

### 2. Error Categories
**Recoverable Errors:**
- Network timeouts
- Missing files
- Invalid user input
- API rate limits

**Unrecoverable Errors:**
- Out of memory
- Stack overflow
- Programming bugs (null pointer, etc.)

## Universal Patterns

### Pattern 1: Circuit Breaker
Prevent cascading failures in distributed systems. See language specific implementations for details, but logically:
1. **Closed**: Normal operation.
2. **Open**: Failing beyond threshold, reject requests immediately.
3. **Half-Open**: Allow limited requests to test recovery.

### Pattern 2: Error Aggregation
Collect multiple errors instead of failing on first error (e.g. form validation).

### Pattern 3: Graceful Degradation
Provide fallback functionality when errors occur (e.g. cache vs live data).

## Language-Specific Patterns

For detailed implementation examples, consult the specific resource file:

- **Python**: [`resources/python.md`](resources/python.md) (Custom exceptions, context managers, decorators)
- **TypeScript/JavaScript**: [`resources/typescript.md`](resources/typescript.md) (Custom error classes, Result types, Async handling)
- **Rust**: [`resources/rust.md`](resources/rust.md) (Result/Option types, ? operator)
- **Go**: [`resources/go.md`](resources/go.md) (Explicit error returns, sentinel errors, wrapping)

## Best Practices
- **Fail Fast:** Validate input early, fail quickly.
- **Preserve Context:** Include stack traces, metadata, timestamps.
- **Meaningful Messages:** Explain what happened and how to fix it.
- **Log Appropriately:** Error = log, expected failure = don't spam logs.
- **Handle at Right Level:** Catch where you can meaningfully handle.
- **Clean Up Resources:** Use try-finally, context managers, defer.
- **Don't Swallow Errors:** Log or re-throw, don't silently ignore.
- **Type-Safe Errors:** Use typed errors when possible.

## Common Pitfalls
- **Catching Too Broadly:** `except Exception` hides bugs.
- **Empty Catch Blocks:** Silently swallowing errors.
- **Logging and Re-throwing:** Creates duplicate log entries.
- **Not Cleaning Up:** Forgetting to close files, connections.
- **Poor Error Messages:** "Error occurred" is not helpful.
- **Returning Error Codes:** Use exceptions or Result types instead.
- **Ignoring Async Errors:** Unhandled promise rejections.
