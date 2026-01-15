# Feature Specification: GraphQL Microservices Skill

**Feature ID**: 033-graphql-microservices-skill
**Status**: Completed
**Created**: January 15, 2026
**Last Updated**: January 15, 2026
**Owner**: Agent Pro Team

## Overview

The GraphQL Microservices Skill provides comprehensive guidance on Apollo Federation 2.x, distributed GraphQL architecture, schema stitching, and microservices communication patterns. It bundles expertise for building scalable, federated GraphQL APIs.

## User Scenarios & Testing

### P1 Scenarios (Critical)

#### Scenario 1: Federation Architecture Design

**User Journey**:
Developer wants to design a federated GraphQL architecture for microservices.

**Acceptance Criteria**:

```gherkin
Given microservices with distinct domains
When developer invokes GraphQL Microservices skill
Then skill provides:
  - Subgraph boundary recommendations
  - Entity resolution patterns (@key directives)
  - Gateway configuration guidance
  - Cross-service type sharing (@shareable)
  - Schema composition best practices
And follows Apollo Federation 2.x specifications
```

**Test Description**:

- Test validates federation patterns for common architectures
- Edge cases: Circular dependencies, shared entities

#### Scenario 2: Schema Stitching Patterns

**User Journey**:
Developer needs to combine multiple GraphQL schemas.

**Acceptance Criteria**:

```gherkin
Given multiple existing GraphQL services
When schema combination is needed
Then skill provides:
  - Type merging strategies
  - Conflict resolution approaches
  - Gateway implementation patterns
  - Performance optimization (batching, caching)
  - Migration path from stitching to federation
```

**Test Description**:

- Test validates stitching recommendations
- Edge cases: Overlapping types, versioned schemas

### P2 Scenarios (Important)

#### Scenario 3: Performance Optimization

**User Journey**:
Developer wants to optimize federated GraphQL performance.

**Acceptance Criteria**:

```gherkin
Given federated GraphQL deployment
When performance optimization is requested
Then skill provides:
  - N+1 query prevention (DataLoader patterns)
  - Query complexity analysis and limits
  - Response caching strategies
  - Subgraph batching configuration
  - Query plan optimization
```

#### Scenario 4: Real-time Federation

**User Journey**:
Developer needs subscriptions in federated architecture.

**Acceptance Criteria**:

```gherkin
Given need for real-time updates across services
When subscription guidance is requested
Then skill provides:
  - Federated subscription patterns
  - Event-driven architecture integration
  - WebSocket gateway configuration
  - Subscription filtering strategies
```

## Requirements

### Functional Requirements

- **FR-001**: Provide Apollo Federation 2.x patterns
  - Context: @key, @shareable, @external, @provides, @requires
  - Constraint: Follow official Apollo specifications

- **FR-002**: Guide subgraph design
  - Context: Domain boundaries, entity ownership
  - Constraint: Support team independence

- **FR-003**: Include gateway configuration
  - Context: Apollo Router, Apollo Server gateway
  - Constraint: Production-ready configurations

- **FR-004**: Support schema evolution
  - Context: @deprecated, versioning strategies
  - Constraint: Backward compatibility patterns

- **FR-005**: Provide performance patterns
  - Context: DataLoader, caching, batching
  - Constraint: Measurable performance improvements

### Non-Functional Requirements

- **NFR-001**: Compatibility - Apollo Federation 2.x support
- **NFR-002**: Completeness - Cover all federation directives
- **NFR-003**: Accuracy - Examples validate with Apollo tools
- **NFR-004**: Currency - Updated for latest Apollo releases

## Dependencies

- Apollo Federation 2.x documentation
- GraphQL specification
- Microservices architecture patterns

## Success Criteria

- Federated architectures designed with skill pass Apollo validation
- Query performance meets < 200ms P95 targets
- Team autonomy maintained with clear boundaries
- Successful production deployments

## Out of Scope

- REST to GraphQL migration (separate consideration)
- GraphQL client implementations
- Non-Apollo federation solutions
- Database-specific resolvers

## Open Questions

- [NEEDS CLARIFICATION] Include alternative federation tools (Mesh, Hasura)?
- Priority for subscription vs. query optimization?

## Appendix

### Federation Directives Reference

| Directive  | Purpose                               | Example                     |
| ---------- | ------------------------------------- | --------------------------- |
| @key       | Define entity primary key             | @key(fields: "id")          |
| @shareable | Allow field in multiple subgraphs     | @shareable                  |
| @external  | Reference field from another subgraph | @external                   |
| @provides  | Declare fields resolved locally       | @provides(fields: "name")   |
| @requires  | Declare required external fields      | @requires(fields: "price")  |
| @override  | Take ownership from another subgraph  | @override(from: "products") |

### Subgraph Design Principles

1. **Single Responsibility**: Each subgraph owns one domain
2. **Entity Ownership**: Clear owner for each entity type
3. **Minimal Coupling**: Minimize cross-subgraph dependencies
4. **Team Alignment**: Subgraphs map to team boundaries
5. **Independent Deployment**: Deploy without coordinating
