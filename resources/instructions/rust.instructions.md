---
description: 'Rust coding standards following Rust API Guidelines and best practices'
applyTo: '**/*.rs'
---

# Rust Instructions

Follow these Rust coding standards and best practices for all Rust files.

## Code Style

### Formatting

- Use `rustfmt` for automatic formatting
- Indentation: Use **4 spaces** (not tabs)
- Maximum line length: **100 characters**
- Follow the Rust Style Guide

```rust
// ✅ Good
fn calculate_total(items: &[Item]) -> f64 {
    items.iter()
        .map(|item| item.price)
        .sum()
}

// Run rustfmt before committing
// cargo fmt
```

### Imports

- Group imports: `std`, external crates, local modules
- Use `use` statements alphabetically within groups

```rust
// ✅ Good
use std::collections::HashMap;
use std::fs::File;
use std::io::{Read, Write};

use serde::{Deserialize, Serialize};
use tokio::runtime::Runtime;

use crate::models::User;
use crate::services::UserService;
```

## Naming Conventions

### Variables and Functions

- Use `snake_case` for variables, functions, and modules
- Use descriptive names

```rust
// ✅ Good
let user_count = 42;
let total_price = calculate_total(&items);

fn process_user_data(user: &User) -> Result<(), Error> {
    // ...
}

fn send_email_notification(recipient: &str, message: &str) -> Result<(), Error> {
    // ...
}
```

### Types and Traits

- Use `PascalCase` for types, traits, and enum variants
- Use `SCREAMING_SNAKE_CASE` for constants

```rust
// ✅ Good
struct User {
    id: String,
    name: String,
}

trait Repository {
    fn find(&self, id: &str) -> Option<User>;
}

enum Status {
    Active,
    Inactive,
    Pending,
}

const MAX_CONNECTIONS: usize = 100;
const DEFAULT_TIMEOUT: Duration = Duration::from_secs(30);
```

### Lifetimes

- Use short, descriptive lifetime names
- Standard practice: `'a`, `'b`, etc. for simple cases

```rust
// ✅ Good
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

struct Parser<'input> {
    data: &'input str,
    position: usize,
}
```

## Error Handling

### Use Result and Option

- Never `unwrap()` or `expect()` in production code unless you can justify it
- Use `?` operator for error propagation
- Provide context with custom error types

```rust
// ✅ Good
fn load_config(path: &str) -> Result<Config, ConfigError> {
    let content = fs::read_to_string(path)
        .map_err(|e| ConfigError::IoError(path.to_string(), e))?;

    let config: Config = serde_json::from_str(&content)
        .map_err(ConfigError::ParseError)?;

    Ok(config)
}

// ✅ Good - custom error type
#[derive(Debug)]
enum ConfigError {
    IoError(String, std::io::Error),
    ParseError(serde_json::Error),
}

impl std::fmt::Display for ConfigError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            ConfigError::IoError(path, e) => write!(f, "Failed to read {}: {}", path, e),
            ConfigError::ParseError(e) => write!(f, "Failed to parse config: {}", e),
        }
    }
}

impl std::error::Error for ConfigError {}
```

### When to Use `unwrap()`

- Only in examples, tests, or prototypes
- When you can prove it won't panic
- Use `expect()` with a helpful message if needed

```rust
// ✅ Good - in tests
#[test]
fn test_parsing() {
    let value: i32 = "42".parse().unwrap();
    assert_eq!(value, 42);
}

// ✅ Good - justified unwrap with comment
// Safe: We just checked that the path exists
let metadata = fs::metadata(&path).unwrap();

// ❌ Bad - production code
let user = repository.find(id).unwrap();  // Will panic if not found!
```

## Ownership and Borrowing

### Prefer Borrowing

- Pass references instead of owned values when possible
- Use `&` for immutable borrows, `&mut` for mutable borrows

```rust
// ✅ Good
fn print_user(user: &User) {
    println!("{}", user.name);
}

fn update_user(user: &mut User, new_name: String) {
    user.name = new_name;
}

// ❌ Bad - unnecessary move
fn print_user(user: User) {
    println!("{}", user.name);
} // user is dropped here, can't be used by caller
```

### Clone Wisely

- Avoid unnecessary clones
- Use `Cow<T>` for conditional cloning
- Consider `Rc<T>` or `Arc<T>` for shared ownership

```rust
// ✅ Good - only clone when needed
fn process_data(data: &str) -> String {
    if data.is_empty() {
        return String::from("default");
    }
    data.to_uppercase()
}

// ✅ Good - Arc for shared ownership
use std::sync::Arc;

let data = Arc::new(vec![1, 2, 3]);
let data_clone = Arc::clone(&data);
```

### Lifetime Patterns

- Most of the time, lifetime elision works
- Explicitly annotate when needed for clarity

```rust
// ✅ Good - lifetime elision
fn first_word(s: &str) -> &str {
    s.split_whitespace().next().unwrap_or("")
}

// ✅ Good - explicit lifetimes when needed
struct UserContext<'a> {
    user: &'a User,
    session: &'a Session,
}

impl<'a> UserContext<'a> {
    fn new(user: &'a User, session: &'a Session) -> Self {
        Self { user, session }
    }
}
```

## Pattern Matching

### Exhaustive Matching

- Always handle all enum variants
- Use `_` wildcard only when justified

```rust
// ✅ Good - exhaustive
match status {
    Status::Active => process_active(),
    Status::Inactive => process_inactive(),
    Status::Pending => process_pending(),
}

// ✅ Good - if let for single variant
if let Some(user) = find_user(id) {
    process(user);
}

// ✅ Good - while let for iterators
while let Some(item) = iterator.next() {
    process(item);
}
```

### Destructuring

- Use destructuring for clarity
- Use `..` to ignore remaining fields

```rust
// ✅ Good
let User { id, name, .. } = user;
println!("User {}: {}", id, name);

// ✅ Good - nested destructuring
match result {
    Ok(Response { status: 200, body }) => process(body),
    Ok(Response { status, .. }) => handle_error(status),
    Err(e) => log_error(e),
}
```

## Traits and Generics

### Trait Bounds

- Use `where` clauses for complex bounds
- Prefer trait objects (`dyn Trait`) when appropriate

```rust
// ✅ Good - simple bounds
fn print_all<T: Display>(items: &[T]) {
    for item in items {
        println!("{}", item);
    }
}

// ✅ Good - where clause for clarity
fn complex_function<T, U>(t: T, u: U) -> Result<String, Error>
where
    T: Display + Debug + Clone,
    U: Into<String> + Send,
{
    // ...
}

// ✅ Good - trait object
fn process_handler(handler: &dyn Handler) {
    handler.handle();
}
```

### Derive Macros

- Use `derive` for common traits
- Implement manually when custom behavior needed

```rust
// ✅ Good
#[derive(Debug, Clone, PartialEq, Eq)]
struct User {
    id: String,
    name: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Config {
    host: String,
    port: u16,
}
```

### Associated Types vs Generic Parameters

- Use associated types when there's one natural type
- Use generic parameters when multiple types make sense

```rust
// ✅ Good - associated type
trait Repository {
    type Item;
    type Error;

    fn find(&self, id: &str) -> Result<Self::Item, Self::Error>;
}

// ✅ Good - generic parameter
trait Converter<T, U> {
    fn convert(&self, input: T) -> U;
}
```

## Async/Await

### Async Functions

- Use `async/await` for concurrent operations
- Prefer `tokio` for async runtime

```rust
// ✅ Good
async fn fetch_user(id: &str) -> Result<User, Error> {
    let response = reqwest::get(&format!("https://api.example.com/users/{}", id))
        .await?;

    let user: User = response.json().await?;
    Ok(user)
}

// ✅ Good - concurrent operations
use tokio::try_join;

async fn load_dashboard() -> Result<Dashboard, Error> {
    let (user, posts, comments) = try_join!(
        fetch_user("123"),
        fetch_posts("123"),
        fetch_comments("123")
    )?;

    Ok(Dashboard { user, posts, comments })
}
```

### Futures

- Use `Stream` for async iterators
- Pin futures when necessary

```rust
// ✅ Good - stream processing
use futures::stream::StreamExt;

async fn process_stream(stream: impl Stream<Item = Result<Data, Error>>) {
    stream
        .filter_map(|result| async { result.ok() })
        .for_each(|data| async {
            process_data(data).await;
        })
        .await;
}
```

## Testing

### Unit Tests

- Place tests in a `tests` module
- Use `#[cfg(test)]` attribute
- Name tests descriptively

```rust
// ✅ Good
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_total_with_empty_list() {
        let items = vec![];
        assert_eq!(calculate_total(&items), 0.0);
    }

    #[test]
    fn test_calculate_total_with_items() {
        let items = vec![
            Item { price: 10.0 },
            Item { price: 20.0 },
        ];
        assert_eq!(calculate_total(&items), 30.0);
    }

    #[test]
    #[should_panic(expected = "division by zero")]
    fn test_divide_by_zero() {
        divide(10, 0);
    }
}
```

### Integration Tests

- Place in `tests/` directory
- Each file is a separate crate

```rust
// tests/integration_test.rs
use my_crate::User;

#[test]
fn test_user_creation() {
    let user = User::new("John", "john@example.com");
    assert_eq!(user.name(), "John");
}
```

### Test Utilities

- Use `#[cfg(test)]` for test helpers
- Consider `rstest` for parameterized tests

```rust
// ✅ Good - test utilities
#[cfg(test)]
mod test_utils {
    use super::*;

    pub fn create_test_user() -> User {
        User {
            id: "test-123".to_string(),
            name: "Test User".to_string(),
            email: "test@example.com".to_string(),
        }
    }
}
```

## Documentation

### Doc Comments

- Use `///` for public items
- Use `//!` for module/crate docs
- Include examples in doc comments

```rust
/// Calculates the total price of all items.
///
/// # Arguments
///
/// * `items` - A slice of items to sum
///
/// # Returns
///
/// The sum of all item prices, or 0.0 if the slice is empty
///
/// # Examples
///
/// ```
/// let items = vec![Item { price: 10.0 }, Item { price: 20.0 }];
/// assert_eq!(calculate_total(&items), 30.0);
/// ```
pub fn calculate_total(items: &[Item]) -> f64 {
    items.iter().map(|item| item.price).sum()
}
```

### Module Documentation

```rust
//! # User Module
//!
//! This module provides user management functionality.
//!
//! ## Examples
//!
//! ```
//! use myapp::user::{User, UserRepository};
//!
//! let user = User::new("John", "john@example.com");
//! ```

use std::collections::HashMap;
```

## Performance Best Practices

### Avoid Allocations

- Use `&str` instead of `String` when possible
- Use iterators instead of collecting

```rust
// ✅ Good - no allocation
fn count_long_words(text: &str) -> usize {
    text.split_whitespace()
        .filter(|word| word.len() > 5)
        .count()
}

// ❌ Bad - unnecessary allocation
fn count_long_words(text: &str) -> usize {
    let words: Vec<&str> = text.split_whitespace().collect();
    words.iter().filter(|word| word.len() > 5).count()
}
```

### Pre-allocate Collections

- Use `with_capacity` when size is known

```rust
// ✅ Good
let mut items = Vec::with_capacity(100);
for i in 0..100 {
    items.push(i);
}

// ✅ Good - collect with size hint
let numbers: Vec<i32> = (0..1000).collect();
```

### Use Appropriate Types

- Use `&[T]` for slices
- Use `&str` for string slices
- Use `HashMap` for O(1) lookups

```rust
// ✅ Good - slice parameter
fn sum(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}

// ✅ Good - string slice
fn trim_and_lowercase(s: &str) -> String {
    s.trim().to_lowercase()
}
```

## Safety and Unsafe

### Minimize Unsafe

- Avoid `unsafe` unless absolutely necessary
- Document safety invariants
- Encapsulate unsafe code

```rust
// ✅ Good - documented unsafe
/// # Safety
///
/// `ptr` must be valid and properly aligned.
/// `len` must not exceed the allocation size.
unsafe fn read_buffer(ptr: *const u8, len: usize) -> Vec<u8> {
    std::slice::from_raw_parts(ptr, len).to_vec()
}
```

## Modern Rust Features (Edition 2021)

### Use Modern Syntax

- Use `let-else` for early returns
- Use async/await
- Use `const` generics when appropriate

```rust
// ✅ Good - let-else (Rust 2021)
let Some(user) = find_user(id) else {
    return Err(Error::NotFound);
};

// ✅ Good - const generics
struct Buffer<const N: usize> {
    data: [u8; N],
}

impl<const N: usize> Buffer<N> {
    fn new() -> Self {
        Self { data: [0; N] }
    }
}
```

## Tools

### Must-Use Tools

- **rustfmt** - Format code
- **clippy** - Linting
- **cargo test** - Run tests
- **cargo doc** - Generate documentation
- **cargo check** - Fast compilation check

### Run Before Commit

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
cargo doc --no-deps
```

## Anti-Patterns to Avoid

```rust
// ❌ Bad - String when &str works
fn print(s: String) {
    println!("{}", s);
}

// ❌ Bad - unwrap in production
let user = repo.find(id).unwrap();

// ❌ Bad - .clone() everywhere
fn process(data: &Data) -> Data {
    let d = data.clone();  // Unnecessary
    d
}

// ❌ Bad - ignoring results
let _ = dangerous_operation();

// ❌ Bad - overly complex lifetimes
fn complex<'a, 'b, 'c>(x: &'a str, y: &'b str, z: &'c str) -> &'a str
where 'b: 'a, 'c: 'a
{
    // Usually can be simplified
}
```

Follow these standards consistently to write safe, efficient, and idiomatic Rust code.
