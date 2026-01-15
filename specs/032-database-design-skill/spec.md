# Feature Specification: Database Design Skill

**Feature ID**: 032-database-design-skill
**Status**: Completed
**Created**: January 15, 2026
**Last Updated**: January 15, 2026
**Owner**: Agent Pro Team

## Overview

The Database Design Skill provides comprehensive guidance on relational and NoSQL database design, schema optimization, query performance, and data modeling best practices. It bundles knowledge for PostgreSQL, MySQL, MongoDB, and modern data architecture patterns.

## User Scenarios & Testing

### P1 Scenarios (Critical)

#### Scenario 1: Schema Design Guidance

**User Journey**:
Developer needs to design a database schema for a new application.

**Acceptance Criteria**:
```gherkin
Given application requirements and entity descriptions
When developer invokes Database Design skill
Then skill provides:
  - Entity-relationship recommendations
  - Table structure with appropriate data types
  - Primary key and foreign key definitions
  - Normalization level recommendations (1NF-3NF/BCNF)
  - Index strategy for common query patterns
And follows database-specific best practices
```

**Test Description**:
- Test validates schema recommendations for common use cases
- Edge cases: Many-to-many relationships, hierarchical data

#### Scenario 2: Query Optimization

**User Journey**:
Developer has a slow query that needs optimization.

**Acceptance Criteria**:
```gherkin
Given a SQL query with performance issues
When optimization is requested
Then skill analyzes query structure
And identifies missing indexes
And suggests query rewrites (JOINs, subqueries)
And explains EXPLAIN plan interpretation
And provides optimized query alternatives
```

**Test Description**:
- Test validates optimization suggestions improve performance
- Edge cases: Complex JOINs, window functions, CTEs

### P2 Scenarios (Important)

#### Scenario 3: Migration Strategy

**User Journey**:
Developer needs to evolve database schema safely.

**Acceptance Criteria**:
```gherkin
Given current and desired schema states
When migration guidance is requested
Then skill provides:
  - Safe migration order
  - Backward-compatible change patterns
  - Zero-downtime migration strategies
  - Rollback procedures
  - Data validation approaches
```

#### Scenario 4: NoSQL Data Modeling

**User Journey**:
Developer needs guidance on document/key-value store design.

**Acceptance Criteria**:
```gherkin
Given application access patterns
When NoSQL design guidance is requested
Then skill provides:
  - Document structure recommendations
  - Embedding vs. referencing decisions
  - Partition key selection (for distributed DBs)
  - Index strategies for document stores
```

## Requirements

### Functional Requirements

- **FR-001**: Provide relational schema design patterns
  - Context: PostgreSQL, MySQL, SQLite
  - Constraint: Follow ACID principles

- **FR-002**: Guide normalization decisions
  - Context: 1NF through BCNF
  - Constraint: Include denormalization trade-offs

- **FR-003**: Recommend indexing strategies
  - Context: B-tree, hash, GIN, GiST indexes
  - Constraint: Balance read/write performance

- **FR-004**: Provide query optimization guidance
  - Context: EXPLAIN analysis, query rewriting
  - Constraint: Database-specific optimizations

- **FR-005**: Support NoSQL data modeling
  - Context: MongoDB, DynamoDB, Redis
  - Constraint: Access pattern-driven design

- **FR-006**: Include migration best practices
  - Context: Schema evolution, data migrations
  - Constraint: Zero-downtime strategies

### Non-Functional Requirements

- **NFR-001**: Coverage - Support 5+ database systems
- **NFR-002**: Accuracy - Recommendations follow vendor best practices
- **NFR-003**: Actionability - Include executable SQL examples
- **NFR-004**: Currency - Patterns updated for latest DB versions

## Dependencies

- PostgreSQL, MySQL documentation
- MongoDB, Redis documentation
- Query optimization research

## Success Criteria

- Schemas designed with skill guidance pass performance testing
- Query optimization suggestions show measurable improvement
- Developers report reduced time designing databases
- Migration strategies execute without data loss

## Out of Scope

- Database administration (backups, replication)
- Specific cloud database configuration (RDS, Cloud SQL)
- Data warehouse design (use Data Engineering agent)
- Real-time streaming databases

## Open Questions

- [NEEDS CLARIFICATION] Include time-series database patterns?
- Graph database modeling guidance?

## Appendix

### Normalization Quick Reference

| Form | Rule                                      | When to Use          |
|------|-------------------------------------------|----------------------|
| 1NF  | Atomic values, no repeating groups        | Always               |
| 2NF  | 1NF + no partial dependencies             | Always               |
| 3NF  | 2NF + no transitive dependencies          | Most applications    |
| BCNF | 3NF + every determinant is candidate key  | Complex relationships|

### Index Types

| Type    | Use Case                  | Database          |
|---------|---------------------------|-------------------|
| B-tree  | Range queries, equality   | All               |
| Hash    | Equality only             | PostgreSQL, MySQL |
| GIN     | Full-text, arrays, JSONB  | PostgreSQL        |
| GiST    | Geometric, spatial        | PostgreSQL        |
| Text    | Full-text search          | MongoDB           |
