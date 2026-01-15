---
description: 'Perform comprehensive code review focusing on quality, security, performance, and best practices'
agent: 'code-reviewer'
tools: ['codebase', 'read']
---

# Code Review

Perform a comprehensive code review of the specified files or changes.

## Review Process

### 1. Initial Assessment

- Understand the purpose of the code
- Review related files for context
- Identify the programming language and framework
- Check if there are existing patterns to follow

### 2. Analysis Areas

#### Code Quality

- **Readability**: Is the code easy to understand?
- **Maintainability**: Can it be easily modified?
- **Consistency**: Does it follow project conventions?
- **Complexity**: Is it unnecessarily complex?
- **DRY Principle**: Is there code duplication?
- **SOLID Principles**: Are they being followed?

#### Functionality

- **Correctness**: Does the code do what it's supposed to?
- **Edge Cases**: Are all scenarios handled?
- **Error Handling**: Are errors properly caught and handled?
- **Input Validation**: Are inputs validated and sanitized?
- **Business Logic**: Is it implemented correctly?

#### Security

- **Authentication**: Is auth properly implemented?
- **Authorization**: Are permissions checked?
- **Input Sanitization**: Is user input sanitized?
- **SQL Injection**: Are parameterized queries used?
- **XSS Prevention**: Is output escaped?
- **Secrets**: Are credentials properly managed?
- **CSRF Protection**: Is it in place where needed?

#### Performance

- **Algorithms**: Are efficient algorithms used?
- **Database Queries**: Are they optimized?
- **API Calls**: Are they minimized?
- **Memory Usage**: Are there potential leaks?
- **Caching**: Is caching used appropriately?
- **Lazy Loading**: Is data loaded efficiently?

#### Testing

- **Test Coverage**: Are critical paths tested?
- **Test Quality**: Are tests meaningful?
- **Edge Cases**: Are they tested?
- **Mocking**: Are dependencies properly mocked?

#### Documentation

- **Code Comments**: Are complex sections explained?
- **Function Documentation**: Are params/returns documented?
- **API Documentation**: Are endpoints documented?
- **README**: Is it up-to-date?

## Review Categories

### 🔴 Critical Issues

Issues that MUST be fixed before merging:

- Security vulnerabilities
- Data loss risks
- Breaking changes without migration
- Critical bugs
- Authentication/authorization bypasses

### ⚠️ High Priority

Should be fixed, but might not block merge:

- Performance problems
- Missing error handling
- Incomplete input validation
- Code that violates architecture
- Missing critical tests

### 💡 Medium Priority

Improvements that would be beneficial:

- Code duplication
- Unclear naming
- Missing documentation
- Inconsistent style
- Minor performance improvements

### ✨ Low Priority / Suggestions

Nice-to-have improvements:

- Readability enhancements
- Additional comments
- Alternative approaches
- Style preferences

## Review Output Format

```markdown
## Code Review Summary

**Overall Assessment**: [Brief assessment of code quality]

**Recommendation**: [APPROVE / REQUEST CHANGES / COMMENT]

---

## 🔴 Critical Issues

### [File:Line] Issue Title

**Problem**: [What's wrong]
**Impact**: [Why it matters]
**Solution**: [How to fix]

\`\`\`language
// Bad code example
\`\`\`

\`\`\`language
// Suggested fix
\`\`\`

---

## ⚠️ High Priority

[Similar format...]

---

## 💡 Medium Priority

[Similar format...]

---

## ✨ Suggestions

[Similar format...]

---

## ✅ Positive Observations

- [What was done well]
- [Good patterns used]
- [Improvements from previous version]

---

## Detailed Review

### [filename.ext]

**Line X-Y**: [Specific feedback]
**Line Z**: [Specific feedback]
```

## Review Checklist

### General

- [ ] Code follows project conventions
- [ ] No console.log or debug code
- [ ] No commented-out code
- [ ] Imports are organized
- [ ] No unused variables or imports

### TypeScript/JavaScript

- [ ] Proper type annotations
- [ ] No `any` types without justification
- [ ] Async/await used correctly
- [ ] Promises handled properly
- [ ] Error handling in place
- [ ] No hardcoded values
- [ ] Constants extracted

### Python

- [ ] Follows PEP 8
- [ ] Type hints present
- [ ] Docstrings provided
- [ ] Exception handling proper
- [ ] No global state unless necessary
- [ ] Virtual environment used

### Database

- [ ] Parameterized queries used
- [ ] Indexes considered
- [ ] Transactions where needed
- [ ] Connection pooling
- [ ] No N+1 queries

### API

- [ ] Proper HTTP methods
- [ ] Correct status codes
- [ ] Input validation
- [ ] Error responses consistent
- [ ] Authentication required
- [ ] Rate limiting considered
- [ ] API versioning

### React Components

- [ ] Proper prop types
- [ ] Keys on list items
- [ ] Hooks rules followed
- [ ] No prop drilling
- [ ] Accessibility attributes
- [ ] Proper event handlers

### Security

- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No hardcoded secrets
- [ ] Input validated
- [ ] Output sanitized
- [ ] CSRF protection
- [ ] Proper authentication
- [ ] Authorization checks

## Common Issues and Fixes

### Issue: Magic Numbers

```typescript
// ❌ Bad
if (user.age > 18) { ... }
setTimeout(callback, 5000);

// ✅ Good
const LEGAL_AGE = 18;
const TIMEOUT_MS = 5000;

if (user.age > LEGAL_AGE) { ... }
setTimeout(callback, TIMEOUT_MS);
```

### Issue: Missing Error Handling

```typescript
// ❌ Bad
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ✅ Good
async function fetchData() {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}
```

### Issue: SQL Injection

```typescript
// ❌ Bad - SQL Injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Good - Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
await db.execute(query, [userId]);
```

### Issue: Unclear Naming

```typescript
// ❌ Bad
function proc(d: any) {
  const t = d.t * 100;
  return t;
}

// ✅ Good
function calculateTotalPrice(data: OrderData): number {
  const totalInCents = data.total * 100;
  return totalInCents;
}
```

## Review Tone Guidelines

- **Be constructive**: Focus on improvement, not criticism
- **Be specific**: Point to exact lines and provide examples
- **Explain why**: Don't just say what's wrong, explain the impact
- **Offer solutions**: Suggest concrete fixes
- **Acknowledge good code**: Point out what's done well
- **Ask questions**: Use "Have you considered...?" instead of commands
- **Be respectful**: Remember there's a person behind the code

## Example Feedback

### ✅ Good Feedback

```
Line 45-50: The error handling here could be more specific.

Currently, all errors are caught and treated the same way, which makes
debugging difficult. Consider catching specific error types:

try {
  await processPayment(order);
} catch (error) {
  if (error instanceof PaymentError) {
    // Handle payment-specific errors
  } else if (error instanceof NetworkError) {
    // Handle network errors
  } else {
    // Handle unexpected errors
  }
}

This would allow different handling strategies for different error types.
```

### ❌ Poor Feedback

```
This is wrong. Fix it.
```

## Final Steps

1. **Summarize findings**: Provide clear summary at top
2. **Prioritize issues**: Separate critical from nice-to-have
3. **Provide examples**: Show both problem and solution
4. **Be actionable**: Every comment should have clear next step
5. **Consider context**: Understand constraints and trade-offs
6. **Follow up**: Be available for questions and clarifications
