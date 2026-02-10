# Go Error Handling Patterns

## Explicit Error Returns
Go uses multiple return values to make error handling explicit at every call site.

```go
func getUser(id string) (*User, error) {
    user, err := db.QueryUser(id)
    if err != nil {
        // Wrap errors with context (%w)
        return nil, fmt.Errorf("failed to query user: %w", err)
    }
    if user == nil {
        return nil, errors.New("user not found")
    }
    return user, nil
}
```

## Sentinel Errors
Use defined package-level variables for expected errors that callers might check against.

```go
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrInvalidInput = errors.New("invalid input")
)

// Checking sentinel errors
if errors.Is(err, ErrNotFound) {
    // Handle specifically, e.g., return 404
} else if err != nil {
    // Handle generic error
}
```

## Custom Error Types
Create structs for rich error information (field validation).

```go
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed for %s: %s", e.Field, e.Message)
}

// Checking custom error types (errors.As)
var valErr *ValidationError
if errors.As(err, &valErr) {
    fmt.Printf("Validation error on field %s: %s\n", valErr.Field, valErr.Message)
}
```

## Wrapping and Unwrapping (Go 1.13+)
Always add context when passing errors up, but keep the original error inspectable.

```go
func processUser(id string) error {
    user, err := getUser(id)
    if err != nil {
        // Add context: "process user failed"
        // Keep causing error available via Unwrap(): %w
        return fmt.Errorf("process user failed: %w", err)
    }
    return nil
}
```
