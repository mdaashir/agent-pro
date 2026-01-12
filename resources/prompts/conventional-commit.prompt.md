---
description: 'Generate conventional commit messages following the Conventional Commits specification'
agent: 'agent'
tools: ['codebase']
---

# Conventional Commit

Generate a commit message following the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Type

Must be one of:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (white-space, formatting, missing semi-colons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

## Scope

Optional. Refers to the section of the codebase affected:

- Component name (e.g., `button`, `auth`, `api`)
- Module name (e.g., `parser`, `validator`)
- Package name (e.g., `core`, `utils`)

Examples:

- `feat(auth): add OAuth2 support`
- `fix(button): resolve click handler bug`
- `docs(readme): update installation instructions`

## Description

- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize first letter
- No period (.) at the end
- Maximum 50 characters (soft limit) or 72 characters (hard limit)
- Should complete the sentence: "If applied, this commit will..."

## Body

Optional. Provides additional context:

- Separate from description with a blank line
- Wrap at 72 characters
- Explain **what** and **why**, not **how**
- Can have multiple paragraphs

## Footer

Optional. Used for:

- **Breaking changes**: Start with `BREAKING CHANGE:` or `BREAKING-CHANGE:`
- **Issue references**: `Fixes #123`, `Closes #456`, `Refs #789`
- **Deprecations**: `Deprecated: xyz will be removed in v2.0`
- **PR references**: `PR #123`

## Examples

### Simple Feature

```
feat: add user registration endpoint
```

### Feature with Scope

```
feat(api): add rate limiting middleware
```

### Bug Fix with Issue Reference

```
fix(auth): resolve token expiration bug

Tokens were expiring immediately due to incorrect time
calculation. Fixed by using UTC timestamps.

Fixes #234
```

### Breaking Change

```
feat(api)!: redesign authentication flow

BREAKING CHANGE: Authentication now requires OAuth2.
The previous API key authentication method is no longer
supported. Users must migrate to OAuth2.

See migration guide: docs/migration-v2.md

Refs #567
```

### Performance Improvement

```
perf(database): optimize user query performance

Reduced query time from 500ms to 50ms by adding
composite index on (email, status) columns.
```

### Refactor

```
refactor(utils): extract common validation logic

Moved email and phone validation to shared utility
functions to reduce code duplication across controllers.
```

### Documentation

```
docs(contributing): add code review guidelines
```

### Revert

```
revert: feat(api): add rate limiting middleware

This reverts commit 1234567890abcdef.
Reason: Rate limiting caused issues in production.
```

## Multi-change Commits

If your commit includes multiple related changes, use the body:

```
feat(dashboard): enhance user analytics

- Add user activity timeline
- Add export to CSV functionality
- Add date range filter
- Improve chart performance

Closes #123, #124, #125
```

## Analysis Process

When generating a commit message:

1. **Review Changes**: Examine all modified files
2. **Identify Type**: Determine if it's feat, fix, refactor, etc.
3. **Find Scope**: Identify the affected component/module
4. **Summarize Impact**: Write clear description
5. **Add Context**: Include body if changes need explanation
6. **Reference Issues**: Add issue/PR references in footer

## Common Patterns

### API Changes

```
feat(api): add pagination to user list endpoint
fix(api): correct response status codes
```

### UI Changes

```
feat(ui): implement dark mode
fix(button): resolve hover state styling
```

### Database Changes

```
feat(db): add user preferences table
refactor(db): normalize user address data
```

### Testing

```
test(auth): add integration tests for login flow
test(api): increase coverage for error cases
```

### Configuration

```
chore(config): update ESLint rules
build(deps): upgrade React to v18
```

## Validation Rules

A good commit message:

- [ ] Has a valid type
- [ ] Uses imperative mood in description
- [ ] Keeps description under 72 characters
- [ ] Starts description with lowercase
- [ ] Has no period at end of description
- [ ] Separates body with blank line (if present)
- [ ] Wraps body at 72 characters (if present)
- [ ] Marks breaking changes with `!` and/or `BREAKING CHANGE:` footer
- [ ] References relevant issues/PRs in footer (if applicable)

## Anti-patterns to Avoid

❌ **Too vague**

```
fix: fix bug
chore: update stuff
```

✅ **Specific**

```
fix(auth): resolve session timeout issue
chore(deps): update lodash to v4.17.21
```

❌ **Past tense**

```
fixed login bug
added new feature
```

✅ **Imperative mood**

```
fix login bug
add new feature
```

❌ **Too long**

```
feat: add a new feature that allows users to export their data to CSV format with custom column selection
```

✅ **Concise**

```
feat(export): add CSV export with column selection
```

## Output

Generate a commit message that:

1. Follows the conventional commits format
2. Accurately describes the changes
3. Includes appropriate scope if applicable
4. Adds body for complex changes
5. References issues/PRs if mentioned in changes
