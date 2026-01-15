# Specifications Directory

This directory contains all feature specifications for Agent Pro, organized using Specification-Driven Development (SDD) methodology.

## Current Specifications

| ID | Feature | Type | Status |
|----|---------|------|--------|
| 001 | accessibility-expert-agent | Agent | Completed |
| 025 | code-analyzer-tool | Tool | Completed |
| 026 | test-generator-tool | Tool | Completed |
| 027 | documentation-builder-tool | Tool | Completed |
| 028 | performance-profiler-tool | Tool | Completed |
| 029 | dependency-analyzer-tool | Tool | Completed |
| 030 | api-designer-tool | Tool | Completed |
| 031 | api-development-skill | Skill | Completed |
| 032 | database-design-skill | Skill | Completed |
| 033 | graphql-microservices-skill | Skill | Completed |
| 034 | multi-agent-orchestration-skill | Skill | Completed |
| 035 | testing-strategies-skill | Skill | Completed |

**Total: 12 specifications**

## Structure

Each feature is assigned a unique number and directory:

```
specs/
├── 001-accessibility-expert-agent/
├── 025-code-analyzer-tool/
├── 026-test-generator-tool/
├── 027-documentation-builder-tool/
├── 028-performance-profiler-tool/
├── 029-dependency-analyzer-tool/
├── 030-api-designer-tool/
├── 031-api-development-skill/
├── 032-database-design-skill/
├── 033-graphql-microservices-skill/
├── 034-multi-agent-orchestration-skill/
├── 035-testing-strategies-skill/
└── README.md (this file)
```

## Numbering Convention

Features are numbered sequentially starting from 001:
- **001-024**: Existing agents (24 expert agents)
- **025-030**: Custom tools (6 tools)
- **031-035**: Skills (5 comprehensive skills)
- **036+**: Future features and enhancements

## Feature Directory Structure

Each feature directory contains:

```
###-feature-name/
├── spec.md          # Feature specification (WHAT)
├── plan.md          # Implementation plan (HOW)
├── tasks.md         # Task breakdown (EXECUTE)
├── checklist.md     # Quality validation (VALIDATE)
└── research.md      # Optional research and context
```

## Creating a New Feature

1. Determine next available feature number
2. Create directory: `specs/###-feature-name/`
3. Copy templates from `resources/templates/`
4. Fill in specification following SDD workflow
5. Get approval before implementation

## Feature Status

Features progress through these states:
- **Draft**: Specification in progress
- **Review**: Under review for approval
- **Approved**: Ready for implementation
- **In Progress**: Implementation underway
- **Completed**: Feature shipped
- **Deprecated**: Feature removed or superseded

## Quick Reference

| Feature Range | Category | Count |
|--------------|----------|-------|
| 001-024 | Expert Agents | 24 |
| 025-030 | Custom Tools | 6 |
| 031-035 | Skills | 5 |
| 036+ | Future Features | TBD |

## Related Documentation

- [Constitutional Framework](../constitution.md)
- [Templates](../templates/)
- [SPEC_DRIVEN.md](../SPEC_DRIVEN.md)
- [AGENTS.md](../AGENTS.md)
