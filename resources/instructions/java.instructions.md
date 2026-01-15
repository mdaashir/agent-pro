---
description: 'Java coding standards following modern Java best practices and conventions'
applyTo: '**/*.java'
---

# Java Instructions

Follow these Java coding standards and best practices for all Java files.

## Code Style

### Formatting

- Indentation: Use **4 spaces** (not tabs)
- Maximum line length: **120 characters**
- Opening braces on same line
- Use IDE auto-formatting (IntelliJ IDEA, Eclipse)

```java
// ✅ Good
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
    
    public User findUser(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }
}

// ❌ Bad - opening brace on new line
public class UserService
{
    // ...
}
```

### Imports

- No wildcard imports (avoid `import java.util.*`)
- Group imports: Java SE, third-party, local
- One import per line

```java
// ✅ Good
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.model.User;
import com.example.repository.UserRepository;

// ❌ Bad
import java.util.*;
import com.example.model.*;
```

## Naming Conventions

### Classes and Interfaces

- Use `PascalCase` for class and interface names
- Interface names should be nouns or adjectives
- Avoid prefixing interfaces with 'I'

```java
// ✅ Good
public class UserService { }
public class CustomerController { }
public interface Repository<T> { }
public interface Serializable { }

// ❌ Bad
public class userService { }
public interface IRepository { }  // Don't prefix with 'I'
```

### Methods and Variables

- Use `camelCase` for methods and variables
- Methods should be verbs or verb phrases
- Boolean methods start with `is`, `has`, `can`, `should`

```java
// ✅ Good
private String userName;
private int totalCount;

public void processOrder(Order order) { }
public User findUserById(String id) { }
public boolean isActive() { }
public boolean hasPermission(String permission) { }

// ❌ Bad
private String UserName;
public void ProcessOrder(Order order) { }
public boolean active() { }  // Should be isActive()
```

### Constants

- Use `SCREAMING_SNAKE_CASE` for constants
- Declare as `static final`

```java
// ✅ Good
public static final int MAX_RETRY_COUNT = 3;
public static final String DEFAULT_ENCODING = "UTF-8";
private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
```

### Packages

- Use lowercase for package names
- Use reversed domain name convention

```java
// ✅ Good
package com.example.userservice.repository;
package com.example.userservice.model;

// ❌ Bad
package com.example.UserService;
package UserService;
```

## Modern Java Features (Java 17+)

### Records (Java 14+)

- Use records for immutable data carriers
- Automatically generates constructor, getters, equals, hashCode, toString

```java
// ✅ Good - record for DTO
public record UserDTO(String id, String name, String email) { }

// ✅ Good - record with validation
public record CreateUserRequest(String name, String email) {
    public CreateUserRequest {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be blank");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
    }
}
```

### Sealed Classes (Java 17+)

- Use sealed classes to restrict inheritance

```java
// ✅ Good
public sealed interface Result<T> permits Success, Failure {
    // Common methods
}

public final record Success<T>(T value) implements Result<T> { }
public final record Failure<T>(Exception error) implements Result<T> { }
```

### Pattern Matching (Java 17+)

- Use pattern matching for instanceof
- Use switch expressions

```java
// ✅ Good - pattern matching
if (obj instanceof String str && str.length() > 5) {
    System.out.println(str.toUpperCase());
}

// ✅ Good - switch expression
String result = switch (status) {
    case ACTIVE -> "User is active";
    case INACTIVE -> "User is inactive";
    case PENDING -> "User is pending";
};
```

### Text Blocks (Java 15+)

- Use text blocks for multi-line strings

```java
// ✅ Good
String json = """
    {
        "name": "%s",
        "email": "%s"
    }
    """.formatted(name, email);

String sql = """
    SELECT u.id, u.name, u.email
    FROM users u
    WHERE u.active = true
    ORDER BY u.created_at DESC
    """;
```

## Null Safety

### Use Optional

- Return `Optional<T>` instead of null
- Never return `Optional.empty()` from streams

```java
// ✅ Good
public Optional<User> findUserById(String id) {
    return repository.findById(id);
}

public User getUserOrDefault(String id) {
    return findUserById(id)
            .orElse(createDefaultUser());
}

// ❌ Bad
public User findUserById(String id) {
    return repository.findById(id);  // Might return null
}
```

### Null Checks

- Use `Objects.requireNonNull()` for validation
- Consider using `@NonNull` and `@Nullable` annotations

```java
// ✅ Good
import java.util.Objects;

public UserService(UserRepository repository) {
    this.repository = Objects.requireNonNull(repository, "repository must not be null");
}

// ✅ Good - with annotations
public void processUser(@NonNull User user, @Nullable String note) {
    Objects.requireNonNull(user);
    // note can be null
}
```

## Exception Handling

### Specific Exceptions

- Catch specific exceptions, not `Exception`
- Create custom exceptions when appropriate
- Don't swallow exceptions

```java
// ✅ Good
try {
    processData(data);
} catch (ValidationException e) {
    logger.error("Validation failed: {}", e.getMessage());
    throw new BadRequestException("Invalid data", e);
} catch (IOException e) {
    logger.error("IO error", e);
    throw new ServiceException("Failed to process data", e);
}

// ❌ Bad
try {
    processData(data);
} catch (Exception e) {  // Too broad
    // Empty catch block - swallowing exception
}
```

### Custom Exceptions

- Extend appropriate base exception
- Provide constructors with message and cause

```java
// ✅ Good
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String userId) {
        super("User not found: " + userId);
    }
    
    public UserNotFoundException(String userId, Throwable cause) {
        super("User not found: " + userId, cause);
    }
}
```

### Try-with-Resources

- Use try-with-resources for AutoCloseable resources

```java
// ✅ Good
try (BufferedReader reader = new BufferedReader(new FileReader("config.txt"))) {
    return reader.lines().collect(Collectors.joining("\n"));
} catch (IOException e) {
    throw new ConfigException("Failed to read config", e);
}

// ✅ Good - multiple resources
try (InputStream in = new FileInputStream("input.txt");
     OutputStream out = new FileOutputStream("output.txt")) {
    in.transferTo(out);
}
```

## Collections and Streams

### Use Stream API

- Use streams for data processing
- Prefer method references over lambdas when possible

```java
// ✅ Good
List<String> activeUserNames = users.stream()
        .filter(User::isActive)
        .map(User::getName)
        .sorted()
        .collect(Collectors.toList());

// ✅ Good - method reference
users.forEach(this::processUser);

// ✅ Good - collectors
Map<String, List<User>> usersByRole = users.stream()
        .collect(Collectors.groupingBy(User::getRole));
```

### Immutable Collections

- Use `List.of()`, `Set.of()`, `Map.of()` for immutable collections

```java
// ✅ Good - immutable collections (Java 9+)
List<String> names = List.of("Alice", "Bob", "Charlie");
Set<Integer> numbers = Set.of(1, 2, 3, 4, 5);
Map<String, Integer> scores = Map.of(
    "Alice", 95,
    "Bob", 87,
    "Charlie", 92
);

// ❌ Bad - mutable when immutable would work
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
```

### Collection Initialization

- Use factory methods or collection literals

```java
// ✅ Good - Java 9+
List<String> list = new ArrayList<>(List.of("a", "b", "c"));

// ✅ Good - mutable collection
List<String> mutableList = new ArrayList<>();
Collections.addAll(mutableList, "a", "b", "c");
```

## Functional Programming

### Lambdas

- Keep lambdas short and readable
- Use block lambdas for complex logic

```java
// ✅ Good - simple lambda
users.stream()
        .filter(u -> u.getAge() > 18)
        .collect(Collectors.toList());

// ✅ Good - block lambda for complex logic
users.stream()
        .map(user -> {
            String fullName = user.getFirstName() + " " + user.getLastName();
            return fullName.toUpperCase();
        })
        .collect(Collectors.toList());

// ✅ Good - method reference
users.stream()
        .map(User::getName)
        .forEach(System.out::println);
```

### Avoid Side Effects

- Keep stream operations pure (no side effects)

```java
// ✅ Good - no side effects
List<String> uppercased = names.stream()
        .map(String::toUpperCase)
        .collect(Collectors.toList());

// ❌ Bad - side effect in stream
List<String> results = new ArrayList<>();
names.stream()
        .forEach(name -> results.add(name.toUpperCase()));  // Side effect
```

## Object-Oriented Design

### SOLID Principles

- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

```java
// ✅ Good - Single Responsibility
public class UserRepository {
    public Optional<User> findById(String id) { }
    public void save(User user) { }
}

public class UserValidator {
    public void validate(User user) { }
}

// ✅ Good - Dependency Inversion
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

### Prefer Composition Over Inheritance

```java
// ✅ Good - composition
public class UserService {
    private final UserRepository repository;
    private final EmailService emailService;
    
    public UserService(UserRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }
}

// ❌ Bad - deep inheritance hierarchy
public class Manager extends Employee extends Person { }
```

### Use Interfaces

- Program to interfaces, not implementations

```java
// ✅ Good
public interface UserRepository {
    Optional<User> findById(String id);
    void save(User user);
}

public class JpaUserRepository implements UserRepository {
    @Override
    public Optional<User> findById(String id) {
        // Implementation
    }
    
    @Override
    public void save(User user) {
        // Implementation
    }
}
```

## Concurrency

### Use Concurrent Collections

- Use `ConcurrentHashMap`, `CopyOnWriteArrayList`, etc.

```java
// ✅ Good
private final Map<String, User> cache = new ConcurrentHashMap<>();

public User getUser(String id) {
    return cache.computeIfAbsent(id, this::loadUser);
}
```

### CompletableFuture

- Use `CompletableFuture` for async operations

```java
// ✅ Good
public CompletableFuture<User> findUserAsync(String id) {
    return CompletableFuture.supplyAsync(() -> repository.findById(id))
            .thenApply(optional -> optional.orElseThrow(() -> 
                    new UserNotFoundException(id)));
}

// ✅ Good - combining futures
CompletableFuture<User> userFuture = findUserAsync("123");
CompletableFuture<List<Order>> ordersFuture = findOrdersAsync("123");

CompletableFuture.allOf(userFuture, ordersFuture)
        .thenRun(() -> {
            User user = userFuture.join();
            List<Order> orders = ordersFuture.join();
            // Process combined data
        });
```

## Testing

### JUnit 5

- Use JUnit 5 for testing
- Name tests descriptively
- Use `@DisplayName` for readable test names

```java
// ✅ Good
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("User Service Tests")
class UserServiceTest {
    
    @Test
    @DisplayName("Should find user by ID when user exists")
    void shouldFindUserById() {
        // Given
        String userId = "123";
        User expected = new User(userId, "John", "john@example.com");
        when(repository.findById(userId)).thenReturn(Optional.of(expected));
        
        // When
        User actual = userService.findUser(userId);
        
        // Then
        assertEquals(expected, actual);
    }
    
    @Test
    @DisplayName("Should throw exception when user not found")
    void shouldThrowWhenUserNotFound() {
        // Given
        String userId = "nonexistent";
        when(repository.findById(userId)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.findUser(userId);
        });
    }
}
```

### Parameterized Tests

```java
// ✅ Good
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.CsvSource;

@ParameterizedTest
@ValueSource(strings = {"", " ", "  "})
void shouldRejectBlankNames(String name) {
    assertThrows(IllegalArgumentException.class, () -> {
        new User("123", name, "email@example.com");
    });
}

@ParameterizedTest
@CsvSource({
    "john@example.com, true",
    "invalid-email, false",
    "@example.com, false"
})
void shouldValidateEmail(String email, boolean expected) {
    assertEquals(expected, emailValidator.isValid(email));
}
```

## Documentation

### JavaDoc

- Document all public APIs
- Use proper JavaDoc tags

```java
/**
 * Finds a user by their unique identifier.
 *
 * @param id the unique identifier of the user
 * @return an Optional containing the user if found, or empty if not found
 * @throws IllegalArgumentException if id is null or blank
 */
public Optional<User> findUserById(String id) {
    if (id == null || id.isBlank()) {
        throw new IllegalArgumentException("User ID must not be blank");
    }
    return repository.findById(id);
}

/**
 * Represents a user in the system.
 *
 * @author John Doe
 * @version 1.0
 * @since 1.0
 */
public class User {
    // ...
}
```

## Best Practices

### Builder Pattern

- Use builders for objects with many parameters

```java
// ✅ Good
public class User {
    private final String id;
    private final String name;
    private final String email;
    private final boolean active;
    
    private User(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.email = builder.email;
        this.active = builder.active;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String id;
        private String name;
        private String email;
        private boolean active = true;
        
        public Builder id(String id) {
            this.id = id;
            return this;
        }
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder active(boolean active) {
            this.active = active;
            return this;
        }
        
        public User build() {
            return new User(this);
        }
    }
}

// Usage
User user = User.builder()
        .id("123")
        .name("John")
        .email("john@example.com")
        .active(true)
        .build();
```

### Equals and HashCode

- Always override both or neither
- Use Objects.equals() and Objects.hash()

```java
// ✅ Good
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return Objects.equals(id, user.id);
}

@Override
public int hashCode() {
    return Objects.hash(id);
}
```

## Tools

### Must-Use Tools

- **Maven** or **Gradle** - Build tool
- **Checkstyle** - Code style checking
- **SpotBugs** - Static analysis
- **JaCoCo** - Code coverage
- **SonarQube** - Code quality

### Run Before Commit

```bash
mvn clean compile
mvn checkstyle:check
mvn spotbugs:check
mvn test
mvn verify
```

## Anti-Patterns to Avoid

```java
// ❌ Bad - returning null
public User findUser(String id) {
    return null;  // Use Optional instead
}

// ❌ Bad - swallowing exceptions
try {
    doSomething();
} catch (Exception e) {
    // Silent failure
}

// ❌ Bad - magic numbers
if (status == 1) { }  // What does 1 mean?

// ❌ Bad - mutable static fields
public static List<User> users = new ArrayList<>();

// ❌ Bad - primitive obsession
public void createUser(String id, String name, String email, String phone, String address) {
    // Too many parameters - use an object
}
```

Follow these standards consistently to write clean, maintainable, and modern Java code.
