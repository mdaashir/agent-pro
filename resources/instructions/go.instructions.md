---
description: 'Go coding standards following Effective Go and community best practices'
applyTo: '**/*.go'
---

# Go Instructions

Follow these Go coding standards and best practices for all Go files.

## Code Style

### Formatting

- Use `gofmt` or `goimports` for automatic formatting
- Indentation: Use **tabs** (not spaces)
- Maximum line length: **100 characters** (soft limit)
- Place opening braces on the same line

```go
// ✅ Good
func calculateTotal(items []Item) float64 {
    var total float64
    for _, item := range items {
        total += item.Price
    }
    return total
}

// ❌ Bad - opening brace on new line
func calculateTotal(items []Item) float64
{
    // ...
}
```

### Imports

- Use `goimports` to automatically organize imports
- Group standard library, third-party, and local imports with blank lines

```go
// ✅ Good
import (
    "context"
    "fmt"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt"

    "myproject/internal/models"
    "myproject/pkg/utils"
)
```

## Naming Conventions

### Variables and Functions

- Use `camelCase` for private variables/functions
- Use `PascalCase` for exported variables/functions
- Acronyms should be uppercase: `ID`, `HTTP`, `JSON`, `URL`

```go
// ✅ Good
var userCount int
var userID string
var httpClient *http.Client

func processUserData(user User) error {
    // ...
}

func NewHTTPServer(port int) *Server {
    // ...
}

// Exported
func CalculateTotal(items []Item) float64 {
    // ...
}
```

### Interfaces

- Single-method interfaces end with `-er`: `Reader`, `Writer`, `Handler`
- Avoid stutter: prefer `http.Server` over `http.HTTPServer`

```go
// ✅ Good
type Reader interface {
    Read(p []byte) (n int, err error)
}

type UserRepository interface {
    Find(id string) (*User, error)
    Save(user *User) error
}
```

### Packages

- Use short, lowercase, single-word names
- Avoid underscores, hyphens, or mixed caps
- Package name should match directory name

```go
// ✅ Good
package handlers
package models
package auth

// ❌ Bad
package user_handlers
package Models
package auth-service
```

## Error Handling

### Always Check Errors

- Never ignore errors with `_` unless absolutely necessary
- Handle errors immediately, don't defer

```go
// ✅ Good
data, err := ioutil.ReadFile("config.json")
if err != nil {
    return fmt.Errorf("failed to read config: %w", err)
}

// ❌ Bad
data, _ := ioutil.ReadFile("config.json")
```

### Error Wrapping

- Use `fmt.Errorf` with `%w` to wrap errors (Go 1.13+)
- Add context to errors as they propagate

```go
// ✅ Good
func loadUserData(id string) (*User, error) {
    data, err := fetchFromDB(id)
    if err != nil {
        return nil, fmt.Errorf("loadUserData: failed to fetch user %s: %w", id, err)
    }
    return parseUser(data)
}
```

### Custom Errors

- Define sentinel errors as package-level variables
- Use custom error types for complex errors

```go
// ✅ Good - sentinel errors
var (
    ErrNotFound     = errors.New("user not found")
    ErrInvalidInput = errors.New("invalid input")
)

// ✅ Good - custom error type
type ValidationError struct {
    Field string
    Msg   string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Msg)
}
```

## Functions and Methods

### Return Early

- Use early returns to reduce nesting
- Handle error cases first

```go
// ✅ Good
func processUser(user *User) error {
    if user == nil {
        return errors.New("user is nil")
    }
    if !user.IsActive {
        return errors.New("user is not active")
    }
    
    // Main logic here
    return user.Save()
}

// ❌ Bad - nested conditions
func processUser(user *User) error {
    if user != nil {
        if user.IsActive {
            // Main logic here
            return user.Save()
        }
        return errors.New("user is not active")
    }
    return errors.New("user is nil")
}
```

### Receiver Names

- Use short, consistent receiver names (1-2 characters)
- Use the first letter(s) of the type name
- Be consistent across all methods of a type

```go
// ✅ Good
func (u *User) Save() error {
    // ...
}

func (u *User) Delete() error {
    // ...
}

// ❌ Bad - inconsistent receiver names
func (user *User) Save() error {
    // ...
}

func (this *User) Delete() error {
    // ...
}
```

### Pointer vs Value Receivers

- Use pointer receivers when:
  - Method modifies the receiver
  - Receiver is a large struct
  - Consistency (if any method uses pointer, all should)
- Use value receivers for small, immutable types

```go
// ✅ Good - pointer for modification
func (u *User) SetName(name string) {
    u.Name = name
}

// ✅ Good - value for small immutable types
func (p Point) Distance() float64 {
    return math.Sqrt(p.X*p.X + p.Y*p.Y)
}
```

## Concurrency

### Goroutines

- Always provide a way to stop goroutines
- Use `context.Context` for cancellation
- Don't leak goroutines

```go
// ✅ Good
func processItems(ctx context.Context, items <-chan Item) {
    for {
        select {
        case <-ctx.Done():
            return
        case item := <-items:
            process(item)
        }
    }
}

// ✅ Good - WaitGroup for coordination
func processBatch(items []Item) {
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func(item Item) {
            defer wg.Done()
            process(item)
        }(item)
    }
    wg.Wait()
}
```

### Channels

- Use buffered channels sparingly
- Close channels from sender, not receiver
- Check if channel is closed when receiving

```go
// ✅ Good
func generator(ctx context.Context) <-chan int {
    ch := make(chan int)
    go func() {
        defer close(ch) // Sender closes
        for i := 0; i < 10; i++ {
            select {
            case <-ctx.Done():
                return
            case ch <- i:
            }
        }
    }()
    return ch
}

// ✅ Good - receiving
for val := range ch {
    process(val)
}
```

### Mutexes

- Keep critical sections small
- Defer `Unlock()` immediately after `Lock()`
- Use `sync.RWMutex` when reads are more frequent

```go
// ✅ Good
type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}
```

## Comments and Documentation

### Package Documentation

- Every package should have a package comment
- Start with "Package packagename..."

```go
// ✅ Good
// Package handlers provides HTTP request handlers for the API.
// It includes handlers for user management, authentication, and data operations.
package handlers
```

### Function Documentation

- Document all exported functions/types
- Start with the function name
- Explain what, not how

```go
// ✅ Good
// CalculateTotal computes the sum of all item prices.
// It returns 0 if the items slice is empty.
func CalculateTotal(items []Item) float64 {
    // ...
}

// User represents a system user with authentication credentials.
type User struct {
    ID       string
    Username string
    Email    string
}
```

## Testing

### Test Organization

- Place tests in `*_test.go` files
- Use table-driven tests for multiple cases
- Test file name: `foo_test.go` for `foo.go`

```go
// ✅ Good - table-driven test
func TestCalculateTotal(t *testing.T) {
    tests := []struct {
        name     string
        items    []Item
        expected float64
    }{
        {
            name:     "empty list",
            items:    []Item{},
            expected: 0,
        },
        {
            name: "single item",
            items: []Item{
                {Price: 10.0},
            },
            expected: 10.0,
        },
        {
            name: "multiple items",
            items: []Item{
                {Price: 10.0},
                {Price: 20.0},
            },
            expected: 30.0,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := CalculateTotal(tt.items)
            if result != tt.expected {
                t.Errorf("got %v, want %v", result, tt.expected)
            }
        })
    }
}
```

### Benchmarks

- Name benchmark functions `BenchmarkXxx`
- Use `b.N` for iterations

```go
// ✅ Good
func BenchmarkCalculateTotal(b *testing.B) {
    items := make([]Item, 100)
    for i := range items {
        items[i] = Item{Price: float64(i)}
    }
    
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        CalculateTotal(items)
    }
}
```

## Modern Go Features (1.18+)

### Generics

- Use generics for type-safe, reusable functions
- Keep type parameters simple

```go
// ✅ Good
func Map[T, U any](items []T, fn func(T) U) []U {
    result := make([]U, len(items))
    for i, item := range items {
        result[i] = fn(item)
    }
    return result
}

func Filter[T any](items []T, predicate func(T) bool) []T {
    result := make([]T, 0, len(items))
    for _, item := range items {
        if predicate(item) {
            result = append(result, item)
        }
    }
    return result
}
```

## Best Practices

### Use Standard Library

- Prefer standard library over third-party when possible
- Use `net/http` for HTTP servers
- Use `encoding/json` for JSON

### Struct Initialization

- Use struct literals with field names
- Zero values should be valid

```go
// ✅ Good
user := User{
    ID:       "123",
    Username: "john",
    Email:    "john@example.com",
}

// ✅ Good - constructor
func NewUser(id, username, email string) *User {
    return &User{
        ID:       id,
        Username: username,
        Email:    email,
        CreatedAt: time.Now(),
    }
}
```

### Context Usage

- First parameter should be `context.Context`
- Pass context down the call stack
- Don't store contexts in structs

```go
// ✅ Good
func ProcessRequest(ctx context.Context, req *Request) error {
    data, err := fetchData(ctx, req.ID)
    if err != nil {
        return err
    }
    return saveData(ctx, data)
}
```

### Dependency Injection

- Accept interfaces, return structs
- Define interfaces at usage point, not implementation

```go
// ✅ Good - interface at usage point
type UserService struct {
    repo UserRepository
}

type UserRepository interface {
    Find(id string) (*User, error)
    Save(user *User) error
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}
```

## Tools

### Must-Use Tools

- **gofmt** - Format code
- **goimports** - Organize imports
- **go vet** - Static analysis
- **golangci-lint** - Comprehensive linting
- **go mod** - Dependency management

### Run Before Commit

```bash
gofmt -w .
goimports -w .
go vet ./...
golangci-lint run
go test ./...
```

## Anti-Patterns to Avoid

```go
// ❌ Bad - ignoring errors
data, _ := json.Marshal(user)

// ❌ Bad - empty interface everywhere
func Process(data interface{}) interface{}

// ❌ Bad - goroutine leak
go processForever()

// ❌ Bad - naked returns in long functions
func calculate(a, b int) (result int) {
    // ... 50 lines of code ...
    return  // What are we returning?
}

// ❌ Bad - init() for side effects
func init() {
    db.Connect() // Side effect at import time
}
```

Follow these standards consistently to maintain clean, idiomatic Go code.
