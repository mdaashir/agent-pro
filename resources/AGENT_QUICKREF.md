# Agent Pro - Quick Reference Guide

A quick reference for Agent Pro's 24 expert agents with embedded resources summary.

## Language Experts

### @typescript-expert

**Embedded Standards:** TypeScript Instructions

| Rule | Requirement |
|------|-------------|
| tsconfig | `strict: true` mandatory |
| Types | PascalCase: `UserProfile` |
| Variables | camelCase: `userName` |
| Constants | UPPER_SNAKE_CASE: `MAX_RETRIES` |
| Avoid | `any` → use `unknown` |

**Best For:** Type-safe code, modern JS/TS features, generics

---

### @python-expert

**Embedded Standards:** Python Instructions (PEP 8)

| Rule | Requirement |
|------|-------------|
| Indentation | 4 spaces (never tabs) |
| Line length | 79 chars (code), 72 (docs) |
| Naming | snake_case: `user_name` |
| Classes | PascalCase: `UserProfile` |
| Type hints | Required for public APIs |

**Best For:** Pythonic code, FastAPI/Django, data science

---

## Quality & Review

### @code-reviewer

**Embedded Standards:** Code Review Prompt

| Severity | Blocks Merge | Examples |
|----------|--------------|----------|
| 🔴 Critical | YES | Security holes, data loss |
| ⚠️ High | Usually | Missing error handling |
| 💡 Medium | No | Code duplication |
| ✨ Low | No | Style improvements |

**Checklist Focus:**
- Security (injection, XSS, CSRF)
- Error handling
- Input validation
- Test coverage

---

### @testing-specialist

**Embedded Standards:** Testing Strategies Skill

```
Testing Trophy (Modern)
       /\
      /E2E\      ← Few critical paths
     /------\
    /Integr. \   ← Most tests (70%)
   /----------\
  /   Unit    \  ← Key utilities (20%)
 /--------------\
Static Analysis
```

| Metric | Target |
|--------|--------|
| Statements | 80% |
| Branches | 75% |
| Functions | 90% |

**TDD Cycle:** 🔴 Red → 🟢 Green → 🔵 Refactor

---

### @security-expert

**Embedded Standards:** Code Review Security Checklist

**OWASP Top 10 Quick Check:**
- A01: Access control at every endpoint
- A02: Encrypt sensitive data
- A03: Parameterized queries only
- A04: Threat modeling
- A05: No default configs
- A06: Update dependencies
- A07: Strong auth + MFA
- A08: Verify integrity
- A09: Logging + alerts
- A10: Validate URLs

---

## DevOps & Infrastructure

### @devops-expert

**Embedded Standards:** Conventional Commits Prompt

| Type | Description | Version |
|------|-------------|---------|
| `feat` | New feature | Minor ↑ |
| `fix` | Bug fix | Patch ↑ |
| `docs` | Documentation | - |
| `ci` | CI changes | - |
| `refactor` | Code restructure | - |

**Example:**
```
feat(api): add rate limiting

BREAKING CHANGE: rate limit now enforced
Fixes #123
```

---

### @cloud-architect

**Best For:** AWS/Azure/GCP, cloud-native patterns, cost optimization

---

### @platform-engineering-expert

**Best For:** Internal Developer Platforms, Backstage, golden paths

---

## Architecture & Design

### @architecture-expert

**Best For:** System design, scalability, microservices vs monolith

---

### @design-patterns-expert

**Best For:** GoF patterns, SOLID principles, clean architecture

---

### @microservices-expert

**Best For:** Service decomposition, event-driven, saga patterns

---

## Data & APIs

### @data-engineering-expert

**Best For:** ETL/ELT, data warehouses, streaming, Apache Spark

---

### @graphql-expert

**Best For:** Schema design, federation, subscriptions, N+1 prevention

---

## Domain Specialists

### @fintech-expert

**Best For:** Payment processing, PCI-DSS, trading systems

---

### @healthcare-expert

**Best For:** HIPAA compliance, HL7 FHIR, medical data

---

## Available Custom Tools

| Tool | Description |
|------|-------------|
| `codeAnalyzer` | Analyze code complexity and metrics |
| `testGenerator` | Generate test suggestions |
| `dependencyAnalyzer` | Check for outdated/vulnerable deps |
| `apiDesigner` | REST API design guidelines |
| `documentationBuilder` | Generate documentation suggestions |
| `performanceProfiler` | Performance analysis tips |
| `specKitConstitution` | SDD constitutional framework |
| `specKitSpecTemplate` | Specification template |
| `specKitPlanTemplate` | Implementation plan template |
| `specKitTasksTemplate` | Task breakdown template |
| `specKitChecklist` | Quality validation checklist |
| `resourceDiscovery` | Find all available resources |

## How Resources Work

### Agents Access Resources

Agents now have **critical content embedded inline**:
- Language experts have coding standards embedded
- Code reviewer has severity criteria embedded
- Testing specialist has TDD/BDD methodology embedded
- DevOps expert has commit conventions embedded
- Security expert has OWASP checklist embedded

This means agents can provide consistent, accurate guidance without needing external file access.

### Using Instructions

Instructions auto-apply based on file patterns:
- `**/*.py` → Python Instructions
- `**/*.ts, **/*.tsx` → TypeScript Instructions
- `**/*.go` → Go Instructions
- `**/*.java` → Java Instructions
- `**/*.rs` → Rust Instructions

### Skills for Deep Dives

Skills provide comprehensive multi-step guidance:
- `api-development/` - RESTful API design
- `database-design/` - Schema and optimization
- `testing-strategies/` - TDD/BDD methodology
- `graphql-microservices/` - Federation patterns
- `multi-agent-orchestration/` - Agent workflows

---

## Quick Commands

| Command | Action |
|---------|--------|
| `Agent Pro: Show Usage Statistics` | View tool usage stats |
| `Agent Pro: Reset Usage Statistics` | Clear stats |
| `Agent Pro: Show Agent Quick Reference` | View agent cheat sheet |

---

*Agent Pro v3.0 - Specification-Driven Development*
