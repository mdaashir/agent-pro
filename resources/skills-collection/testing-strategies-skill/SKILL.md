---
name: testing-strategies
description: 'Modern testing strategies covering TDD/BDD, shift-left/shift-right, test automation, and quality assurance patterns (2025-2026 standards)'
---

# Testing Strategies

A comprehensive skill covering modern testing methodologies, automation strategies, and quality assurance practices based on 2025-2026 industry standards.

## Table of Contents

1. [Testing Pyramid & Trophy](#testing-pyramid--trophy)
2. [Test-Driven Development (TDD)](#test-driven-development-tdd)
3. [Behavior-Driven Development (BDD)](#behavior-driven-development-bdd)
4. [Shift-Left Testing](#shift-left-testing)
5. [Shift-Right Testing](#shift-right-testing)
6. [Test Automation](#test-automation)
7. [Quality Metrics](#quality-metrics)
8. [Testing Tools](#testing-tools)

## Testing Pyramid & Trophy

### Testing Pyramid (Traditional)

```
        /\
       /E2E\      ← Few, slow, expensive
      /------\
     /  API   \   ← Medium quantity, faster
    /----------\
   /   Unit     \ ← Many, fast, cheap
  /--------------\
```

### Testing Trophy (Modern, Recommended)

```
        /\
       /E2E\      ← Few critical paths
      /------\
     /Integr. \  ← Most tests here (70%)
    /----------\
   /   Unit    \  ← Important utilities (20%)
  /--------------\
 Static Analysis  ← TypeScript, ESLint, etc.
```

**Why Testing Trophy?**

- Integration tests catch more real bugs
- Provide better confidence
- Good balance of speed and reliability
- Reflect actual user workflows

## Test-Driven Development (TDD)

### The Red-Green-Refactor Cycle

```
1. 🔴 RED: Write a failing test
   ↓
2. 🟢 GREEN: Make it pass (minimal code)
   ↓
3. 🔵 REFACTOR: Improve the code
   ↓
   Repeat
```

### TDD Example: User Registration

```typescript
// 1. RED: Write failing test first
describe('UserRegistration', () => {
  it('should create a new user with hashed password', async () => {
    const service = new UserRegistrationService();
    const userData = {
      email: 'user@example.com',
      password: 'SecurePass123!',
      name: 'John Doe',
    };

    const user = await service.register(userData);

    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.password).not.toBe(userData.password); // Should be hashed
    expect(user.password).toHaveLength(60); // bcrypt hash length
  });

  it('should reject duplicate email', async () => {
    const service = new UserRegistrationService();
    const userData = {
      email: 'existing@example.com',
      password: 'SecurePass123!',
      name: 'Jane Doe',
    };

    await service.register(userData);

    await expect(service.register(userData)).rejects.toThrow('Email already exists');
  });
});

// 2. GREEN: Implement minimal code to pass
class UserRegistrationService {
  constructor(private userRepo: UserRepository) {}

  async register(userData: RegisterUserDTO): Promise<User> {
    // Check for existing email
    const existing = await this.userRepo.findByEmail(userData.email);
    if (existing) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = new User({
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
    });

    await this.userRepo.save(user);

    return user;
  }
}

// 3. REFACTOR: Extract hash logic, add validation, etc.
```

### TDD Benefits

- **Better Design**: Forces you to think about interfaces first
- **Regression Safety**: Tests act as safety net
- **Documentation**: Tests show how code should be used
- **Confidence**: Refactor without fear

## Behavior-Driven Development (BDD)

### Given-When-Then Format

```gherkin
Feature: User Authentication

  Scenario: Successful login with valid credentials
    Given a registered user with email "user@example.com"
    And the user's password is "SecurePass123!"
    When the user attempts to login
    Then the login should succeed
    And an authentication token should be generated

  Scenario: Failed login with invalid password
    Given a registered user with email "user@example.com"
    And the user's password is "SecurePass123!"
    When the user attempts to login with password "WrongPass"
    Then the login should fail
    And an error message "Invalid credentials" should be shown
```

### BDD Implementation (Cucumber/Jest)

```typescript
import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'chai';

let user: User;
let authResult: AuthResult;
let authService: AuthService;

Before(async () => {
  authService = new AuthService();
  await setupTestDatabase();
});

Given('a registered user with email {string}', async (email: string) => {
  user = await createTestUser({ email, password: 'SecurePass123!' });
});

When('the user attempts to login', async () => {
  authResult = await authService.login({
    email: user.email,
    password: 'SecurePass123!',
  });
});

When('the user attempts to login with password {string}', async (password: string) => {
  try {
    authResult = await authService.login({
      email: user.email,
      password,
    });
  } catch (error) {
    authResult = { success: false, error: error.message };
  }
});

Then('the login should succeed', () => {
  expect(authResult.success).to.be.true;
});

Then('an authentication token should be generated', () => {
  expect(authResult.token).to.be.a('string');
  expect(authResult.token).to.have.lengthOf.at.least(20);
});

Then('the login should fail', () => {
  expect(authResult.success).to.be.false;
});

Then('an error message {string} should be shown', (message: string) => {
  expect(authResult.error).to.equal(message);
});
```

## Shift-Left Testing

**Shift-Left**: Find bugs early in development cycle

### Static Analysis (Leftmost)

```typescript
// TypeScript catches errors before runtime
interface User {
  id: string;
  email: string;
  age: number;
}

function getUser(id: string): User {
  // TypeScript enforces return type
  return {
    id,
    email: 'user@example.com',
    age: 25,
  };
}

// ✅ Compile-time error
const user = getUser(123); // Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

### Pre-Commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write", "jest --bail --findRelatedTests"]
  }
}
```

### IDE Integration

- **Real-time linting**: ESLint, TSLint
- **Type checking**: TypeScript language server
- **Test running**: Jest, Vitest integrations
- **Code coverage**: Inline coverage indicators

### Code Review Automation

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi

      - name: Security audit
        run: npm audit --audit-level=moderate
```

## Shift-Right Testing

**Shift-Right**: Test in production-like environments

### Canary Releases

```typescript
class CanaryDeployment {
  async deploy(newVersion: string, canaryPercentage: number) {
    // Deploy to small subset of users
    await this.deployToCanary(newVersion, canaryPercentage);

    // Monitor metrics
    const metrics = await this.monitorCanary(duration: 30 * 60 * 1000); // 30 min

    // Validate success criteria
    if (this.meetsSuccessCriteria(metrics)) {
      await this.promoteToProduction(newVersion);
    } else {
      await this.rollback(newVersion);
      throw new Error('Canary deployment failed validation');
    }
  }

  private meetsSuccessCriteria(metrics: Metrics): boolean {
    return (
      metrics.errorRate < 0.01 &&        // < 1% error rate
      metrics.p95Latency < 500 &&        // < 500ms P95 latency
      metrics.successRate > 0.99         // > 99% success rate
    );
  }
}
```

### Feature Flags

```typescript
class FeatureFlagService {
  async isEnabled(feature: string, user: User): Promise<boolean> {
    const flag = await this.getFeatureFlag(feature);

    if (!flag.enabled) return false;

    // Gradual rollout
    if (flag.rolloutPercentage < 100) {
      const userHash = this.hashUser(user.id);
      if (userHash % 100 >= flag.rolloutPercentage) {
        return false;
      }
    }

    // User targeting
    if (flag.targetUsers && !flag.targetUsers.includes(user.id)) {
      return false;
    }

    return true;
  }
}

// Usage
if (await featureFlags.isEnabled('new-checkout-flow', user)) {
  return await newCheckoutFlow(order);
} else {
  return await legacyCheckoutFlow(order);
}
```

### Synthetic Monitoring

```typescript
// Monitor critical user journeys in production
class SyntheticMonitor {
  async runUserJourney(): Promise<void> {
    const startTime = Date.now();

    try {
      // Simulate user login
      const loginResponse = await this.login({
        email: 'synthetic-user@example.com',
        password: process.env.SYNTHETIC_PASSWORD,
      });

      // Simulate browsing products
      const products = await this.getProducts();
      expect(products).to.have.length.greaterThan(0);

      // Simulate adding to cart
      await this.addToCart(products[0].id);

      // Record success
      await this.recordMetric('user-journey', {
        success: true,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      // Alert on failure
      await this.alert('User journey failed', error);

      await this.recordMetric('user-journey', {
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
      });
    }
  }
}

// Run every 5 minutes
setInterval(() => new SyntheticMonitor().runUserJourney(), 5 * 60 * 1000);
```

### Chaos Engineering

```typescript
class ChaosMonkey {
  async introduceLatency(service: string, latencyMs: number, percentage: number) {
    // Add latency to X% of requests
    return (req, res, next) => {
      if (Math.random() < percentage / 100) {
        setTimeout(() => next(), latencyMs);
      } else {
        next();
      }
    };
  }

  async killRandomInstance(serviceName: string) {
    const instances = await this.getServiceInstances(serviceName);
    const randomInstance = instances[Math.floor(Math.random() * instances.length)];

    console.log(`Killing instance: ${randomInstance.id}`);
    await this.terminateInstance(randomInstance.id);
  }

  async corruptData(percentage: number) {
    // Introduce data corruption to test error handling
  }
}

// Schedule chaos experiments
if (process.env.NODE_ENV === 'staging') {
  const chaosMonkey = new ChaosMonkey();

  // Every hour, kill a random instance
  setInterval(
    () => {
      chaosMonkey.killRandomInstance('api-service');
    },
    60 * 60 * 1000
  );
}
```

## Test Automation

### Unit Testing Best Practices

```typescript
// ✅ Good: Focused, single assertion
describe('PasswordValidator', () => {
  it('should require minimum 8 characters', () => {
    const validator = new PasswordValidator();
    expect(validator.validate('short')).toBe(false);
  });

  it('should require at least one uppercase letter', () => {
    const validator = new PasswordValidator();
    expect(validator.validate('lowercase123')).toBe(false);
  });

  it('should accept valid password', () => {
    const validator = new PasswordValidator();
    expect(validator.validate('ValidPass123!')).toBe(true);
  });
});

// ❌ Bad: Multiple assertions, unclear purpose
it('should validate password', () => {
  const validator = new PasswordValidator();
  expect(validator.validate('short')).toBe(false);
  expect(validator.validate('lowercase123')).toBe(false);
  expect(validator.validate('ValidPass123!')).toBe(true);
});
```

### Integration Testing

```typescript
describe('User API', () => {
  let app: Express;
  let db: Database;

  beforeAll(async () => {
    db = await setupTestDatabase();
    app = createApp(db);
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.clear();
  });

  it('POST /users should create new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'SecurePass123!',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      email: 'test@example.com',
      name: 'Test User',
    });
    expect(response.body.password).toBeUndefined(); // Should not return password
    expect(response.body.id).toBeDefined();

    // Verify in database
    const user = await db.users.findById(response.body.id);
    expect(user).toBeDefined();
    expect(user.password).not.toBe('SecurePass123!'); // Should be hashed
  });
});
```

### E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete purchase successfully', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');

    // 2. Browse products
    await page.goto('/products');
    await page.click('text=Add to Cart', { first: true });

    // 3. View cart
    await page.click('[aria-label="Cart"]');
    await expect(page.locator('.cart-item')).toHaveCount(1);

    // 4. Checkout
    await page.click('text=Proceed to Checkout');

    // 5. Fill shipping info
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'San Francisco');
    await page.fill('[name="zip"]', '94105');

    // 6. Fill payment info (using test card)
    await page.fill('[name="cardNumber"]', '4242424242424242');
    await page.fill('[name="expiry"]', '12/25');
    await page.fill('[name="cvc"]', '123');

    // 7. Submit
    await page.click('button:has-text("Place Order")');

    // 8. Verify success
    await expect(page.locator('text=Order Confirmed')).toBeVisible();
    await expect(page.locator('.order-number')).toHaveText(/ORD-\d+/);
  });
});
```

### Visual Regression Testing

```typescript
import { test, expect } from '@playwright/test';

test('Homepage visual regression', async ({ page }) => {
  await page.goto('/');

  // Take screenshot and compare to baseline
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100, // Allow minor differences
  });
});

test('Responsive design', async ({ page }) => {
  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage-desktop.png');

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('homepage-tablet.png');

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('homepage-mobile.png');
});
```

## Quality Metrics

### Code Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Coverage thresholds (jest.config.js)
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Mutation Testing

```typescript
// Original code
function isEven(n: number): boolean {
  return n % 2 === 0;
}

// Mutated code (tool generates this)
function isEven(n: number): boolean {
  return n % 2 === 1; // Mutation: === changed to !==
}

// If tests still pass, mutation survived = weak tests!
```

### Test Quality Metrics

- **Test Coverage**: % of code executed by tests
- **Mutation Score**: % of mutations killed by tests
- **Test Execution Time**: How fast tests run
- **Flakiness Rate**: % of tests that fail intermittently
- **Bug Escape Rate**: Bugs found in production vs. caught by tests

## Testing Tools

### Unit & Integration Testing

- **Jest**: JavaScript/TypeScript testing framework
- **Vitest**: Next-gen Vite-native testing
- **Mocha + Chai**: Flexible testing combo
- **pytest**: Python testing framework

### E2E Testing

- **Playwright**: Modern cross-browser testing
- **Cypress**: Developer-friendly E2E testing
- **Selenium**: Legacy but widely supported

### API Testing

- **Supertest**: HTTP assertion library
- **Postman**: API testing platform
- **REST Client**: VS Code extension

### Performance Testing

- **k6**: Load testing tool
- **Artillery**: Modern load testing
- **JMeter**: Traditional load testing

### Accessibility Testing

- **axe-core**: Accessibility engine
- **Pa11y**: Accessibility testing tool
- **Lighthouse**: Automated auditing

## Summary

Modern testing strategies emphasize:

1. **Shift-Left**: Catch bugs early with static analysis and TDD
2. **Automation**: 80%+ test automation coverage
3. **Integration Focus**: Most tests at integration level
4. **Shift-Right**: Production monitoring and canary releases
5. **Continuous Testing**: Tests run on every commit
6. **Quality Metrics**: Track and improve test effectiveness

Choose the right testing level:

- **Unit**: Pure functions, utilities, algorithms
- **Integration**: API endpoints, database operations
- **E2E**: Critical user journeys
- **Production**: Synthetic monitoring, chaos engineering
