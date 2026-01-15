# Feature Specification: Testing Strategies Skill

**Feature ID**: 035-testing-strategies-skill
**Status**: Completed
**Created**: January 15, 2026
**Last Updated**: January 15, 2026
**Owner**: Agent Pro Team

## Overview

The Testing Strategies Skill provides comprehensive guidance on test-driven development (TDD), behavior-driven development (BDD), test pyramid implementation, shift-left/shift-right testing, and modern testing practices. It bundles expertise for achieving high-quality, well-tested software.

## User Scenarios & Testing

### P1 Scenarios (Critical)

#### Scenario 1: Test Strategy Selection

**User Journey**:
Developer wants to establish testing strategy for a project.

**Acceptance Criteria**:

```gherkin
Given project type and requirements
When developer invokes Testing Strategies skill
Then skill provides:
  - Test pyramid recommendations (unit/integration/e2e ratio)
  - Testing approach selection (TDD, BDD, or hybrid)
  - Coverage target guidance
  - Test prioritization framework
  - CI/CD integration recommendations
And tailors advice to project context
```

**Test Description**:

- Test validates strategy recommendations for various project types
- Edge cases: Legacy codebases, microservices, monoliths

#### Scenario 2: TDD Implementation Guidance

**User Journey**:
Developer wants to practice test-driven development.

**Acceptance Criteria**:

```gherkin
Given a feature to implement
When TDD guidance is requested
Then skill provides:
  - Red-Green-Refactor cycle explanation
  - Test-first patterns for common scenarios
  - Mocking and stubbing strategies
  - When to use TDD vs other approaches
  - Common TDD pitfalls and solutions
```

**Test Description**:

- Test validates TDD patterns are practical
- Edge cases: UI testing, database interactions

### P2 Scenarios (Important)

#### Scenario 3: BDD and Specification Testing

**User Journey**:
Developer wants to implement behavior-driven development.

**Acceptance Criteria**:

```gherkin
Given feature requirements
When BDD guidance is requested
Then skill provides:
  - Given-When-Then scenario writing
  - Cucumber/SpecFlow integration
  - Living documentation patterns
  - Stakeholder collaboration approaches
  - Scenario organization strategies
```

#### Scenario 4: Shift-Left/Shift-Right Testing

**User Journey**:
Developer wants to understand modern testing timing strategies.

**Acceptance Criteria**:

```gherkin
Given software development lifecycle
When shift testing guidance is requested
Then skill provides:
  - Shift-left practices (early testing)
  - Shift-right practices (production testing)
  - Continuous testing pipeline
  - Feature flags for testing in production
  - Chaos engineering basics
```

### P3 Scenarios (Nice to Have)

#### Scenario 5: Test Quality Assessment

**User Journey**:
Developer wants to evaluate existing test suite quality.

**Acceptance Criteria**:

```gherkin
Given existing test suite
When quality assessment is requested
Then skill provides:
  - Test coverage analysis guidance
  - Test maintainability evaluation
  - Flaky test identification
  - Mutation testing introduction
  - Test refactoring recommendations
```

## Requirements

### Functional Requirements

- **FR-001**: Provide test pyramid guidance
  - Context: Unit, integration, e2e balance
  - Constraint: Adaptable to project types

- **FR-002**: Cover TDD methodology comprehensively
  - Context: Red-Green-Refactor, test doubles
  - Constraint: Practical, not academic

- **FR-003**: Include BDD and specification patterns
  - Context: Gherkin syntax, step definitions
  - Constraint: Tool-agnostic concepts

- **FR-004**: Address shift-left and shift-right
  - Context: CI/CD integration, production testing
  - Constraint: Modern DevOps alignment

- **FR-005**: Provide mocking and stubbing patterns
  - Context: Test isolation, dependency management
  - Constraint: Language-specific examples

- **FR-006**: Include property-based testing
  - Context: QuickCheck, Hypothesis patterns
  - Constraint: When to use guidance

### Non-Functional Requirements

- **NFR-001**: Completeness - Cover testing lifecycle
- **NFR-002**: Practicality - Real-world applicable
- **NFR-003**: Balance - Academic rigor + pragmatism
- **NFR-004**: Currency - 2026 testing practices

## Dependencies

- Testing framework documentation
- CI/CD platform integration guides
- Quality engineering research

## Success Criteria

- Teams adopting strategies report improved code quality
- Test suites become more maintainable
- Bug escape rate decreases
- Developer confidence in deployments increases

## Out of Scope

- Performance testing specifics (Performance Expert handles)
- Security testing details (Security Expert handles)
- Specific test framework tutorials
- Test infrastructure setup

## Open Questions

- [NEEDS CLARIFICATION] Include AI-assisted testing patterns?
- Contract testing depth?

## Appendix

### Test Pyramid Ratios

| Project Type     | Unit | Integration | E2E |
| ---------------- | ---- | ----------- | --- |
| Microservice     | 70%  | 20%         | 10% |
| Monolith         | 60%  | 25%         | 15% |
| Frontend-heavy   | 50%  | 30%         | 20% |
| Data Pipeline    | 40%  | 40%         | 20% |
| Legacy Migration | 30%  | 40%         | 30% |

### TDD Cycle

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   RED    │ ──▶ │  GREEN   │ ──▶ │ REFACTOR │
│Write fail│     │Make pass │     │Clean code│
│  test    │     │(minimal) │     │          │
└──────────┘     └──────────┘     └──────────┘
     ▲                                  │
     └──────────────────────────────────┘
```

### BDD Scenario Template

```gherkin
Feature: [Feature name]
  As a [role]
  I want [capability]
  So that [benefit]

  Scenario: [Scenario name]
    Given [initial context]
    And [additional context]
    When [action taken]
    Then [expected outcome]
    And [additional outcomes]
```

### Testing Quadrants

```
         Business-Facing
              ▲
              │
    Q2        │        Q3
  Functional  │   Exploratory
    Tests     │     Testing
              │
 ◄────────────┼────────────►
              │    Automated
    Q1        │        Q4
    Unit      │   Performance
   Tests      │     Tests
              │
              ▼
        Technology-Facing
```
