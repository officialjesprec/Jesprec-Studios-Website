# TypeScript/JavaScript Error Handling Patterns

## Custom Error Classes
Use typed error classes to catch specific failure modes.

```typescript
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string) {
    super(`${resource} not found`, "NOT_FOUND", 404, { resource, id });
  }
}

// Usage
function getUser(id: string) {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new NotFoundError("User", id);
  }
  return user;
}
```

## Result Type Pattern (Functional Error Handling)
Use a Result type to make errors explicit in the type system, avoiding `throw`.

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage
function parseJSON<T>(json: string): Result<T, SyntaxError> {
  try {
    const value = JSON.parse(json) as T;
    return Ok(value);
  } catch (error) {
    return Err(error as SyntaxError);
  }
}
```

## Async Error Handling
Properly handle promise rejections and use async/await.

```typescript
async function fetchUserOrders(userId: string): Promise<Order[]> {
  try {
    const user = await getUser(userId);
    return await getOrders(user.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return []; // Recoverable: Return empty for not found
    }
    if (error instanceof NetworkError) {
      return retryFetchOrders(userId); // Recoverable: Retry
    }
    throw error; // Re-throw unrecoverable
  }
}
```

## Error Aggregation
Collect validation errors instead of failing on the first one.

```typescript
class ErrorCollector {
  private errors: Error[] = [];

  add(error: Error): void {
    this.errors.push(error);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  throw(): never {
    if (this.errors.length === 1) {
      throw this.errors[0];
    }
    throw new AggregateError(
      this.errors,
      `${this.errors.length} errors occurred`,
    );
  }
}

// Usage
function validateUser(data: any): User {
  const errors = new ErrorCollector();

  if (!data.email) errors.add(new ValidationError("Email required"));
  if (!data.age || data.age < 18) errors.add(new ValidationError("Must be 18+"));

  if (errors.hasErrors()) {
    errors.throw();
  }
  return data as User;
}
```
