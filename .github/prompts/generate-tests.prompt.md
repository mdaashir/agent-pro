---
description: 'Generate comprehensive unit and integration tests with high coverage and quality'
agent: 'testing-specialist'
tools: ['codebase', 'read', 'edit', 'terminalCommand']
---

# Generate Tests

Generate comprehensive tests for code with high coverage and quality.

## Analysis Process

1. **Understand the Code**
   - Read the target file(s) thoroughly
   - Identify all functions, methods, and classes
   - Understand inputs, outputs, and side effects
   - Identify dependencies and external interactions

2. **Identify Test Scenarios**
   - Normal/happy path cases
   - Edge cases (empty, null, undefined, zero, negative)
   - Error conditions and exceptions
   - Boundary values
   - State transitions (for stateful code)

3. **Determine Test Types**
   - **Unit tests**: Isolated component testing with mocks
   - **Integration tests**: Component interaction testing
   - **E2E tests**: Full user workflow testing

4. **Select Testing Framework**
   - JavaScript/TypeScript: Jest, Vitest, Mocha
   - Python: pytest, unittest
   - C#: xUnit, NUnit, MSTest
   - Java: JUnit, TestNG

## Test Structure

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentName } from './component';

describe('ComponentName', () => {
  // Setup - runs before each test
  let component: ComponentName;
  let mockDependency: MockType;

  beforeEach(() => {
    mockDependency = createMockDependency();
    component = new ComponentName(mockDependency);
  });

  // Teardown - runs after each test
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    it('should handle normal case correctly', () => {
      // Arrange
      const input = createTestData();
      const expected = createExpectedResult();

      // Act
      const result = component.methodName(input);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should throw error for invalid input', () => {
      // Arrange
      const invalidInput = null;

      // Act & Assert
      expect(() => component.methodName(invalidInput)).toThrow('Expected error message');
    });

    it('should handle edge case: empty array', () => {
      // Arrange, Act, Assert
    });
  });
});
```

## Test Coverage Requirements

### What to Test

✅ **Public API**: All public methods and functions
✅ **Business Logic**: Core algorithms and calculations
✅ **Error Handling**: Exception paths and validation
✅ **Edge Cases**: Boundaries, empty values, nulls
✅ **State Changes**: Before/after state verification
✅ **Async Operations**: Promises, callbacks, async/await
✅ **Integration Points**: Database, API, file system interactions

❌ **Skip Testing**

- Private helper methods (test through public API)
- Simple getters/setters without logic
- Framework-generated code
- Third-party library code

### Coverage Targets

- **Statements**: 80%+ coverage
- **Branches**: 75%+ coverage
- **Functions**: 90%+ coverage
- **Lines**: 80%+ coverage

## Test Scenarios by Type

### Testing Functions

```typescript
// Function to test
function calculateTotal(price: number, quantity: number, taxRate: number): number {
  if (price < 0 || quantity < 0) {
    throw new Error('Price and quantity must be non-negative');
  }
  const subtotal = price * quantity;
  return subtotal * (1 + taxRate);
}

// Comprehensive tests
describe('calculateTotal', () => {
  it('should calculate total correctly for normal values', () => {
    expect(calculateTotal(10, 2, 0.1)).toBe(22);
  });

  it('should handle zero quantity', () => {
    expect(calculateTotal(10, 0, 0.1)).toBe(0);
  });

  it('should handle zero tax rate', () => {
    expect(calculateTotal(10, 2, 0)).toBe(20);
  });

  it('should throw error for negative price', () => {
    expect(() => calculateTotal(-10, 2, 0.1)).toThrow('Price and quantity must be non-negative');
  });

  it('should throw error for negative quantity', () => {
    expect(() => calculateTotal(10, -2, 0.1)).toThrow('Price and quantity must be non-negative');
  });

  it('should handle decimal values correctly', () => {
    expect(calculateTotal(10.5, 3, 0.08)).toBeCloseTo(34.02, 2);
  });
});
```

### Testing Classes

```typescript
class ShoppingCart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    this.items.push(item);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  clear(): void {
    this.items = [];
  }
}

// Tests
describe('ShoppingCart', () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  describe('addItem', () => {
    it('should add item to cart', () => {
      const item = { id: '1', name: 'Product', price: 10, quantity: 1 };
      cart.addItem(item);
      expect(cart.getTotal()).toBe(10);
    });
  });

  describe('getTotal', () => {
    it('should return 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0);
    });

    it('should calculate total for multiple items', () => {
      cart.addItem({ id: '1', name: 'A', price: 10, quantity: 2 });
      cart.addItem({ id: '2', name: 'B', price: 5, quantity: 3 });
      expect(cart.getTotal()).toBe(35);
    });
  });

  describe('clear', () => {
    it('should remove all items', () => {
      cart.addItem({ id: '1', name: 'A', price: 10, quantity: 1 });
      cart.clear();
      expect(cart.getTotal()).toBe(0);
    });
  });
});
```

### Testing Async Code

```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}

// Tests
describe('fetchUser', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch user successfully', async () => {
    const mockUser = { id: '1', name: 'John' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    const user = await fetchUser('1');

    expect(user).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('should throw error when user not found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await expect(fetchUser('999')).rejects.toThrow('User not found');
  });

  it('should handle network errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchUser('1')).rejects.toThrow('Network error');
  });
});
```

### Testing with Mocks

```typescript
import { vi } from 'vitest';

// Service to test
class UserService {
  constructor(private db: Database) {}

  async getUser(id: string): Promise<User> {
    return this.db.findById('users', id);
  }

  async createUser(data: CreateUserData): Promise<User> {
    const user = { id: generateId(), ...data, createdAt: new Date() };
    await this.db.insert('users', user);
    return user;
  }
}

// Tests
describe('UserService', () => {
  let service: UserService;
  let mockDb: MockDatabase;

  beforeEach(() => {
    mockDb = {
      findById: vi.fn(),
      insert: vi.fn(),
    };
    service = new UserService(mockDb);
  });

  describe('getUser', () => {
    it('should retrieve user from database', async () => {
      const mockUser = { id: '1', name: 'John' };
      mockDb.findById.mockResolvedValue(mockUser);

      const user = await service.getUser('1');

      expect(user).toEqual(mockUser);
      expect(mockDb.findById).toHaveBeenCalledWith('users', '1');
    });
  });

  describe('createUser', () => {
    it('should create and return new user', async () => {
      const userData = { name: 'Jane', email: 'jane@example.com' };
      mockDb.insert.mockResolvedValue(undefined);

      const user = await service.createUser(userData);

      expect(user).toMatchObject({
        name: 'Jane',
        email: 'jane@example.com',
      });
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });
});
```

### Parametrized Tests

```typescript
import { it, expect } from 'vitest';

// Test multiple scenarios
it.each([
  { input: 'hello', expected: 'HELLO' },
  { input: 'WORLD', expected: 'WORLD' },
  { input: 'Hello World', expected: 'HELLO WORLD' },
  { input: '', expected: '' },
])('should convert "$input" to "$expected"', ({ input, expected }) => {
  expect(toUpperCase(input)).toBe(expected);
});

// Or use array format
it.each([
  [2, 3, 5],
  [0, 0, 0],
  [-1, 1, 0],
  [10, -5, 5],
])('add(%i, %i) should equal %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});
```

## Integration Test Example

```typescript
describe('API Integration: /users', () => {
  let app: Express;
  let db: TestDatabase;

  beforeAll(async () => {
    app = createApp();
    db = await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase(db);
  });

  beforeEach(async () => {
    await db.clear();
  });

  it('should create user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
    };

    const response = await request(app).post('/api/users').send(userData).expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: userData.name,
      email: userData.email,
    });

    // Verify database state
    const user = await db.users.findById(response.body.id);
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test', email: 'invalid' })
      .expect(400);

    expect(response.body.error).toBe('Invalid email');
  });
});
```

## Test Quality Checklist

Generated tests should:

- [ ] Follow AAA (Arrange-Act-Assert) pattern
- [ ] Have descriptive test names
- [ ] Test one specific behavior per test
- [ ] Be independent (no test dependencies)
- [ ] Use appropriate assertions
- [ ] Include edge cases and error scenarios
- [ ] Mock external dependencies
- [ ] Clean up resources in afterEach/afterAll
- [ ] Run quickly (< 100ms per unit test)
- [ ] Have clear failure messages

## Output

Generate:

1. Complete test file with imports
2. Test suite with describe blocks
3. Individual test cases with it/test blocks
4. Setup and teardown hooks
5. Mocks and test data
6. Comments explaining complex test logic
7. Coverage for all public methods
8. Edge cases and error scenarios
