# Rust Error Handling Patterns

## Result for Recoverable Errors and ? Operator
The standard way to handle errors in Rust.

```rust
use std::fs::File;
use std::io::{self, Read};

// Result<String, io::Error> makes errors explicit in the signature
fn read_file(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;  // ? propagates errors immediately
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}
```

## Custom Error Enums (`thiserror` style)
Combine multiple error types into a single application error.

```rust
#[derive(Debug)]
enum AppError {
    Io(io::Error),
    Parse(std::num::ParseIntError),
    NotFound(String),
    Validation(String),
}

// Implement From trait for automatic conversion
impl From<io::Error> for AppError {
    fn from(error: io::Error) -> Self {
        AppError::Io(error)
    }
}

// Usage
fn read_number_from_file(path: &str) -> Result<i32, AppError> {
    let contents = read_file(path)?;  // Auto-converts io::Error -> AppError::Io
    // Map non-standard errors explicitly
    let number = contents.trim().parse()
        .map_err(AppError::Parse)?;   
    Ok(number)
}
```

## Using Option for Nullable Values
Don't use null; use `Option<T>`.

```rust
fn find_user(id: &str) -> Option<User> {
    users.iter().find(|u| u.id == id).cloned()
}

// Combining Option and Result: ok_or_else
fn get_user_age(id: &str) -> Result<u32, AppError> {
    find_user(id)
        .ok_or_else(|| AppError::NotFound(id.to_string())) // Convert None -> Error
        .map(|user| user.age)
}
```
