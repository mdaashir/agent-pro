---
description: 'Refactor code to improve quality, maintainability, and performance while preserving functionality'
agent: 'code-reviewer'
tools: ['codebase', 'read', 'edit']
---

# Refactor Code

Refactor the specified code to improve quality, maintainability, and performance while preserving existing functionality.

## Refactoring Principles

### 1. Preserve Functionality

- **All existing behavior must remain unchanged**
- Run tests before and after refactoring
- Verify no breaking changes introduced
- Maintain backward compatibility

### 2. Improve Code Quality

- Enhance readability
- Reduce complexity
- Eliminate code duplication
- Apply SOLID principles
- Follow language idioms

### 3. Incremental Changes

- Make small, focused changes
- Test after each refactoring step
- Commit frequently
- One refactoring pattern at a time

## Common Refactoring Patterns

### Extract Function

**When**: Code block is doing too much or has duplicated logic

```typescript
// Before
function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
  if (!order.customer) {
    throw new Error('Order must have customer');
  }

  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  // Apply discount
  if (order.discountCode) {
    const discount = getDiscount(order.discountCode);
    total = total * (1 - discount);
  }

  return total;
}

// After
function processOrder(order) {
  validateOrder(order);
  let total = calculateTotal(order.items);
  total = applyDiscount(total, order.discountCode);
  return total;
}

function validateOrder(order) {
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
  if (!order.customer) {
    throw new Error('Order must have customer');
  }
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function applyDiscount(total, discountCode) {
  if (!discountCode) return total;
  const discount = getDiscount(discountCode);
  return total * (1 - discount);
}
```

### Extract Variable

**When**: Complex expressions are hard to understand

```typescript
// Before
if (user.age > 18 && user.hasLicense && user.violations < 3) {
  allowDriving();
}

// After
const isAdult = user.age > 18;
const hasValidLicense = user.hasLicense;
const hasCleanRecord = user.violations < 3;
const canDrive = isAdult && hasValidLicense && hasCleanRecord;

if (canDrive) {
  allowDriving();
}
```

### Replace Conditional with Polymorphism

**When**: Large switch statements or if-else chains

```typescript
// Before
class Bird {
  getSpeed() {
    switch (this.type) {
      case 'european':
        return this.baseSpeed;
      case 'african':
        return this.baseSpeed - this.loadFactor;
      case 'norwegian':
        return this.isNailed ? 0 : this.baseSpeed;
      default:
        return 0;
    }
  }
}

// After
abstract class Bird {
  abstract getSpeed(): number;
}

class EuropeanBird extends Bird {
  getSpeed() {
    return this.baseSpeed;
  }
}

class AfricanBird extends Bird {
  getSpeed() {
    return this.baseSpeed - this.loadFactor;
  }
}

class NorwegianBird extends Bird {
  getSpeed() {
    return this.isNailed ? 0 : this.baseSpeed;
  }
}
```

### Introduce Parameter Object

**When**: Functions have too many parameters

```typescript
// Before
function createUser(
  name: string,
  email: string,
  age: number,
  address: string,
  phone: string,
  role: string
) {
  // ...
}

// After
interface CreateUserData {
  name: string;
  email: string;
  age: number;
  address: string;
  phone: string;
  role: string;
}

function createUser(data: CreateUserData) {
  // ...
}
```

### Replace Magic Numbers with Constants

**When**: Unclear numeric or string literals

```typescript
// Before
function calculatePrice(quantity) {
  if (quantity > 100) {
    return quantity * 9.99 * 0.9;
  }
  return quantity * 9.99;
}

// After
const UNIT_PRICE = 9.99;
const BULK_DISCOUNT = 0.9;
const BULK_THRESHOLD = 100;

function calculatePrice(quantity) {
  const hasDiscount = quantity > BULK_THRESHOLD;
  const multiplier = hasDiscount ? BULK_DISCOUNT : 1;
  return quantity * UNIT_PRICE * multiplier;
}
```

### Replace Nested Conditionals with Guard Clauses

**When**: Deep nesting reduces readability

```typescript
// Before
function getPayment(user) {
  let result;
  if (user) {
    if (user.isPremium) {
      if (user.hasPaymentMethod) {
        result = processPayment(user);
      } else {
        result = 'No payment method';
      }
    } else {
      result = 'Not premium';
    }
  } else {
    result = 'No user';
  }
  return result;
}

// After
function getPayment(user) {
  if (!user) {
    return 'No user';
  }

  if (!user.isPremium) {
    return 'Not premium';
  }

  if (!user.hasPaymentMethod) {
    return 'No payment method';
  }

  return processPayment(user);
}
```

### Consolidate Duplicate Code

**When**: Similar code appears in multiple places

```typescript
// Before
function formatUserName(user) {
  return `${user.firstName} ${user.lastName}`.trim();
}

function formatCustomerName(customer) {
  return `${customer.firstName} ${customer.lastName}`.trim();
}

function formatEmployeeName(employee) {
  return `${employee.firstName} ${employee.lastName}`.trim();
}

// After
function formatFullName(person: { firstName: string; lastName: string }) {
  return `${person.firstName} ${person.lastName}`.trim();
}

// Usage
const userName = formatFullName(user);
const customerName = formatFullName(customer);
const employeeName = formatFullName(employee);
```

### Replace Callback with Promise/Async-Await

**When**: Callback hell reduces readability

```typescript
// Before
function loadUserData(userId, callback) {
  getUser(userId, (err, user) => {
    if (err) return callback(err);

    getOrders(user.id, (err, orders) => {
      if (err) return callback(err);

      getProducts(orders, (err, products) => {
        if (err) return callback(err);
        callback(null, { user, orders, products });
      });
    });
  });
}

// After
async function loadUserData(userId) {
  const user = await getUser(userId);
  const orders = await getOrders(user.id);
  const products = await getProducts(orders);
  return { user, orders, products };
}
```

### Split Large Class

**When**: Class has too many responsibilities

```typescript
// Before
class UserManager {
  createUser() {}
  updateUser() {}
  deleteUser() {}
  sendEmail() {}
  sendSMS() {}
  validateEmail() {}
  hashPassword() {}
  checkPermissions() {}
}

// After
class UserRepository {
  createUser() {}
  updateUser() {}
  deleteUser() {}
}

class NotificationService {
  sendEmail() {}
  sendSMS() {}
}

class AuthService {
  validateEmail() {}
  hashPassword() {}
  checkPermissions() {}
}
```

## Refactoring Process

### 1. Analyze Current Code

- Identify code smells
- Find duplicated code
- Locate complex functions
- Check for violations of SOLID principles
- Review error handling

### 2. Plan Refactoring

- Choose appropriate refactoring pattern
- Break down into small steps
- Identify affected tests
- Consider backward compatibility

### 3. Execute Refactoring

- Make one change at a time
- Run tests after each change
- Commit frequently
- Document significant changes

### 4. Verify

- All tests pass
- No new bugs introduced
- Performance not degraded
- Code is more readable

## Code Smells to Address

### Long Function

- **Smell**: Function has more than 20-30 lines
- **Fix**: Extract smaller functions

### Large Class

- **Smell**: Class has too many methods/properties
- **Fix**: Split into multiple classes

### Long Parameter List

- **Smell**: Function has more than 3-4 parameters
- **Fix**: Introduce parameter object

### Duplicate Code

- **Smell**: Same code in multiple places
- **Fix**: Extract to shared function

### Complex Conditional

- **Smell**: Deeply nested if-else or long switch
- **Fix**: Replace with polymorphism or strategy pattern

### Primitive Obsession

- **Smell**: Using primitives instead of objects
- **Fix**: Introduce value objects

### Data Clumps

- **Smell**: Same group of parameters appearing together
- **Fix**: Extract into class

### Feature Envy

- **Smell**: Method uses another class's data more than its own
- **Fix**: Move method to that class

## Best Practices

### Keep It Simple

- Don't over-engineer
- Avoid premature optimization
- Make code self-documenting
- Use clear naming

### Maintain Tests

- Update tests alongside code
- Add tests for edge cases
- Ensure high coverage
- Test refactored code thoroughly

### Document Changes

- Update comments
- Revise documentation
- Note breaking changes
- Create migration guides if needed

### Review and Iterate

- Get peer review
- Run static analysis
- Check performance
- Gather feedback

## Output Format

```markdown
## Refactoring Summary

**Target**: [File/function being refactored]
**Pattern**: [Refactoring pattern applied]
**Reason**: [Why this refactoring is needed]

## Changes Made

### 1. [Change Description]

**Before**:
\`\`\`language
// Original code
\`\`\`

**After**:
\`\`\`language
// Refactored code
\`\`\`

**Benefits**:

- [Improvement 1]
- [Improvement 2]

### 2. [Next Change]

[Similar format...]

## Impact

- **Readability**: [How readability improved]
- **Maintainability**: [How maintainability improved]
- **Performance**: [Performance impact, if any]
- **Testing**: [Changes to tests]

## Verification

- [ ] All tests pass
- [ ] No breaking changes
- [ ] Performance maintained or improved
- [ ] Code follows project conventions
```

## Refactoring Checklist

- [ ] Identified code smell or improvement opportunity
- [ ] Planned refactoring approach
- [ ] All tests pass before refactoring
- [ ] Made incremental changes
- [ ] Tests still pass after each change
- [ ] No functionality changed
- [ ] Code is more readable
- [ ] Complexity reduced
- [ ] Duplication eliminated
- [ ] Names are clear and meaningful
- [ ] Comments updated
- [ ] Documentation revised
- [ ] Peer review completed
