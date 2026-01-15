---
description: 'TypeScript coding standards and best practices'
applyTo: '**/*.ts, **/*.tsx'
---

# TypeScript Instructions

Follow these TypeScript coding standards and best practices for all TypeScript and TSX files.

## Type Safety

### Always Enable Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Prefer Type Inference

```typescript
// ❌ Avoid - redundant type annotation
const name: string = 'John';
const count: number = 42;

// ✅ Prefer - let TypeScript infer
const name = 'John'; // inferred as string
const count = 42; // inferred as number
```

### Use Interfaces for Object Shapes

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  readonly createdAt: Date;
}

// ✅ Also good - use type for unions
type UserRole = 'admin' | 'user' | 'guest';
type ID = string | number;
```

### Avoid `any` - Use `unknown` Instead

```typescript
// ❌ Avoid
function processData(data: any) {
  return data.value; // No type safety
}

// ✅ Prefer
function processData(data: unknown) {
  if (isValidData(data)) {
    return data.value; // Type-safe after guard
  }
}

function isValidData(data: unknown): data is { value: string } {
  return (
    typeof data === 'object' && data !== null && 'value' in data && typeof data.value === 'string'
  );
}
```

## Naming Conventions

### Use PascalCase for Types, Interfaces, Classes

```typescript
// ✅ Good
interface UserProfile {}
type RequestStatus = 'pending' | 'success' | 'error';
class DatabaseConnection {}
enum HttpStatus {}
```

### Use camelCase for Variables, Functions, Methods

```typescript
// ✅ Good
const userName = 'John';
function calculateTotal() {}
const userService = new UserService();
```

### Use UPPER_SNAKE_CASE for Constants

```typescript
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;
```

### Prefix Interfaces with 'I' Only When Necessary

```typescript
// ✅ Preferred - no prefix
interface User {}
interface Repository {}

// ✅ Acceptable - when differentiating from implementation
interface IUserService {}
class UserService implements IUserService {}
```

## Function and Method Definitions

### Use Arrow Functions for Callbacks

```typescript
// ✅ Good
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
const filtered = numbers.filter((n) => n > 2);

// ✅ Good - explicit types when needed
const process = (item: Item): ProcessedItem => {
  return transform(item);
};
```

### Explicit Return Types for Public Functions

```typescript
// ✅ Good - explicit return type
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Acceptable - inferred for private/local functions
function formatDate(date: Date) {
  return date.toISOString();
}
```

### Use Optional Parameters and Default Values

```typescript
// ✅ Good
function createUser(
  name: string,
  email: string,
  role: UserRole = 'user',
  options?: UserOptions
): User {
  // ...
}
```

## Generics

### Use Meaningful Generic Names

```typescript
// ❌ Avoid - unclear
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {}

// ✅ Better - descriptive names
function map<TInput, TOutput>(arr: TInput[], fn: (item: TInput) => TOutput): TOutput[] {}

// ✅ Or use single letter for simple cases
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

### Constrain Generics When Possible

```typescript
// ✅ Good
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
```

## Error Handling

### Use Custom Error Classes

```typescript
// ✅ Good
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(
    public resourceType: string,
    public resourceId: string
  ) {
    super(`${resourceType} with ID ${resourceId} not found`);
    this.name = 'NotFoundError';
  }
}
```

### Handle Async Errors Properly

```typescript
// ✅ Good
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
```

## Utility Types

### Leverage Built-in Utility Types

```typescript
// ✅ Good usage of utility types
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;
type UserWithoutEmail = Omit<User, 'email'>;
type ReadonlyUser = Readonly<User>;
type UserMap = Record<string, User>;
```

### Create Custom Utility Types

```typescript
// ✅ Useful custom types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;
```

## Async/Await

### Prefer async/await Over Promises

```typescript
// ❌ Avoid - promise chains
function loadData() {
  return fetchUser()
    .then((user) => fetchOrders(user.id))
    .then((orders) => fetchProducts(orders))
    .catch((error) => console.error(error));
}

// ✅ Prefer - async/await
async function loadData() {
  try {
    const user = await fetchUser();
    const orders = await fetchOrders(user.id);
    const products = await fetchProducts(orders);
    return { user, orders, products };
  } catch (error) {
    console.error('Failed to load data:', error);
    throw error;
  }
}
```

### Use Promise.all for Parallel Operations

```typescript
// ✅ Good - parallel execution
async function loadMultipleUsers(ids: string[]): Promise<User[]> {
  const promises = ids.map((id) => fetchUser(id));
  return Promise.all(promises);
}

// ✅ Good - handle failures with allSettled
async function loadUsersWithFallback(ids: string[]): Promise<User[]> {
  const promises = ids.map((id) => fetchUser(id));
  const results = await Promise.allSettled(promises);

  return results
    .filter((result): result is PromiseFulfilledResult<User> => result.status === 'fulfilled')
    .map((result) => result.value);
}
```

## Imports and Exports

### Use Named Exports

```typescript
// ✅ Preferred - named exports
export function calculateTotal(items: Item[]): number {}
export class UserService {}
export interface User {}

// Usage
import { calculateTotal, UserService, User } from './module';
```

### Organize Imports

```typescript
// ✅ Good organization
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { z } from 'zod';

// 2. Internal modules
import { UserService } from '@/services/user';
import { formatDate } from '@/utils/date';

// 3. Types
import type { User, UserRole } from '@/types';

// 4. Styles
import styles from './Component.module.css';
```

## Comments and Documentation

### Use JSDoc for Public APIs

````typescript
/**
 * Calculates the total price with tax and discount
 *
 * @param price - Base price before tax
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param discount - Discount percentage (e.g., 10 for 10% off)
 * @returns Final price after tax and discount
 *
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.08, 10);
 * // Returns: 97.20
 * ```
 *
 * @throws {Error} If price is negative
 */
export function calculateTotal(price: number, taxRate: number, discount: number = 0): number {
  if (price < 0) {
    throw new Error('Price must be non-negative');
  }

  const discounted = price * (1 - discount / 100);
  return discounted * (1 + taxRate);
}
````

### Comment Complex Logic

```typescript
// ✅ Good - explains why
// Using debounce to prevent excessive API calls while user is typing
const debouncedSearch = debounce(searchUsers, 300);

// ✅ Good - clarifies complex algorithm
// Binary search requires sorted array - complexity O(log n)
function binarySearch(arr: number[], target: number): number {
  // ...
}
```

## React + TypeScript

### Type Props and State

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  children
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children || label}
    </button>
  );
};
```

### Use Discriminated Unions for State

```typescript
// ✅ Good
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function useApiData<T>(url: string) {
  const [state, setState] = useState<RequestState<T>>({ status: 'idle' });

  // TypeScript knows exactly what properties exist based on status
  if (state.status === 'success') {
    console.log(state.data); // ✅ Type-safe
  }
}
```

## Performance Considerations

### Use const assertions

```typescript
// ✅ Good - inferred as readonly tuple
const colors = ['red', 'green', 'blue'] as const;
type Color = (typeof colors)[number]; // 'red' | 'green' | 'blue'

// ✅ Good - inferred as exact object
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;
```

### Avoid Unnecessary Re-renders (React)

```typescript
// ✅ Good - memoized component
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* render */}</div>;
});

// ✅ Good - memoized values
const MemoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// ✅ Good - memoized callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## Testing Types

### Test with Type-Safe Mocks

```typescript
// ✅ Good
import { vi } from 'vitest';

const mockUserService: UserService = {
  getUser: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
};

// ✅ Type-safe mock implementation
mockUserService.getUser.mockResolvedValue({
  id: '1',
  name: 'John',
  email: 'john@example.com',
});
```

## General Rules

1. **Enable strict mode** in tsconfig.json
2. **Avoid `any`** - use `unknown` and type guards
3. **Use type inference** where possible
4. **Explicit types** for public APIs
5. **Leverage utility types** (Partial, Pick, Omit, etc.)
6. **Handle errors** properly with try-catch
7. **Document** complex logic and public APIs
8. **Test** types with proper mocking
9. **Use modern features** (optional chaining, nullish coalescing)
10. **Keep types simple** - don't over-complicate
