# Agent Integration Guide

This guide explains how to integrate new agents into Agent Pro following the Specification-Driven Development (SDD) methodology.

## Overview

Agent Pro currently includes 24 expert agents, each specialized in a specific domain. All agents follow a consistent structure and integration process to ensure quality and maintainability.

## Agent Integration Checklist

Use this checklist when adding a new agent:

### 1. Specification Phase

- [ ] Create feature directory: `specs/###-agent-name/`
- [ ] Copy spec template: `resources/templates/spec-template.md`
- [ ] Define agent purpose and expertise areas
- [ ] Write P1 user scenarios with Given/When/Then acceptance criteria
- [ ] Define P2 and P3 scenarios (if applicable)
- [ ] List functional requirements (FR-###)
- [ ] Define non-functional requirements (NFR-###)
- [ ] Set measurable success criteria
- [ ] Document dependencies and out-of-scope items
- [ ] Mark any uncertainties with `[NEEDS CLARIFICATION]`
- [ ] Validate specification using checklist template
- [ ] Get specification approved

### 2. Planning Phase

- [ ] Copy plan template: `resources/templates/plan-template.md`
- [ ] Fill in technical context (language, dependencies, framework)
- [ ] Complete constitutional check for all 8 articles
- [ ] Define agent file structure and location
- [ ] Document expertise areas and capabilities
- [ ] Define tool access requirements
- [ ] Plan example interactions
- [ ] Define testing strategy
- [ ] Document any architectural deviations with justification

### 3. Implementation Phase

- [ ] Create agent file: `resources/agents-collection/[agent-name].agent.md`
- [ ] Add YAML frontmatter with required fields
- [ ] Document expertise areas comprehensively
- [ ] Provide code examples for common scenarios
- [ ] Include best practices and guidelines
- [ ] Define interaction patterns
- [ ] Specify tool usage if applicable
- [ ] Add validation rules and quality standards

### 4. Registration Phase

- [ ] Update `package.json` contributes.chatAgents section
- [ ] Add agent entry with name, path, description
- [ ] Ensure description is clear and concise (< 100 chars)
- [ ] Verify agent name follows convention (PascalCase, no spaces)

### 5. Testing Phase

- [ ] Test agent in Copilot Chat (@agent-name)
- [ ] Verify agent appears in @ menu
- [ ] Test P1 scenarios from specification
- [ ] Test P2 scenarios (if applicable)
- [ ] Verify tool access works correctly
- [ ] Test edge cases and error handling
- [ ] Document any issues or limitations

### 6. Documentation Phase

- [ ] Update README.md agents table
- [ ] Add agent to "Available Agents" section
- [ ] Update agent count in features section
- [ ] Update CHANGELOG.md with new agent
- [ ] Add usage examples if needed
- [ ] Update version in package.json

### 7. Quality Assurance

- [ ] Run validation scripts
- [ ] Verify no syntax errors in agent file
- [ ] Check YAML frontmatter is valid
- [ ] Ensure constitutional compliance
- [ ] Verify specification matches implementation
- [ ] Test with multiple Copilot queries
- [ ] Get peer review

## Agent File Structure

Every agent file must follow this structure:

```markdown
---
description: 'Agent description (clear, concise, < 200 chars)'
name: 'Agent Display Name'
tools: ['read', 'edit', 'search', 'codebase', 'terminalCommand']
model: 'Claude Sonnet 4.5'
---

# Agent Name - Tagline

Brief overview of what this agent does and when to use it.

## Your Expertise Areas

### 1. Primary Expertise Domain

- Specific capability 1
- Specific capability 2
- Specific capability 3

### 2. Secondary Expertise Domain

- Specific capability 1
- Specific capability 2

## Code Examples

### Example 1: Common Use Case

**Context**: When to use this pattern

```language
// Code example
```

**Explanation**: Why this approach

### Example 2: Advanced Pattern

```language
// Advanced example
```

## Best Practices

- Best practice 1
- Best practice 2
- Best practice 3

## Common Pitfalls

- Pitfall 1 and how to avoid it
- Pitfall 2 and how to avoid it

## When to Use This Agent

- Use case 1
- Use case 2
- Use case 3

## Related Tools

If this agent works particularly well with custom tools:
- Tool name: Use case

## Resources

- External documentation links
- Reference materials
- Community resources
```

## YAML Frontmatter Requirements

### Required Fields

```yaml
---
description: 'Brief agent description for Copilot menu'
name: 'Agent Display Name'
---
```

### Optional Fields

```yaml
tools: ['read', 'edit', 'search', 'codebase', 'terminalCommand']
model: 'Claude Sonnet 4.5'
```

### Validation Rules

- **description**:
  - Required
  - String in single quotes
  - < 200 characters
  - No line breaks
  - Describes what agent does, not who it is

- **name**:
  - Required
  - String in single quotes
  - Human-readable display name
  - Matches package.json registration

- **tools**:
  - Optional
  - Array of tool names
  - Standard tools: read, edit, search, codebase, terminalCommand

- **model**:
  - Optional
  - Specifies preferred model
  - Default: Claude Sonnet 4.5

## Naming Conventions

### Agent File Names

- Format: `[domain]-expert.agent.md` or `[domain]-specialist.agent.md`
- Lowercase with hyphens
- Descriptive and specific
- Examples:
  - `accessibility-expert.agent.md`
  - `python-expert.agent.md`
  - `testing-specialist.agent.md`

### Agent Display Names

- Format: Domain + "Expert" or "Specialist"
- PascalCase (no spaces)
- Examples:
  - `AccessibilityExpert`
  - `PythonExpert`
  - `TestingSpecialist`

### Agent @ Mentions

- Format: @agent-display-name
- Lowercase with hyphens
- Examples:
  - `@accessibility-expert`
  - `@python-expert`
  - `@testing-specialist`

## Content Guidelines

### Expertise Areas

- Be specific about what agent knows
- Include versions of technologies (Python 3.12+, TypeScript 5.x)
- List frameworks, libraries, tools in agent's domain
- Organize by primary and secondary expertise

### Code Examples

- Use real-world scenarios
- Include context (when/why to use)
- Add explanatory comments
- Show best practices
- Cover common use cases first

### Best Practices

- Actionable advice
- Specific, not vague
- Backed by reasoning
- Current standards (2026)
- Industry-accepted patterns

### Common Pitfalls

- Real mistakes developers make
- Clear explanation of why it's wrong
- Better alternative provided
- Specific to agent's domain

## Package.json Registration

Add agent to `contributes.chatAgents` array:

```json
{
  "name": "AgentDisplayName",
  "path": "./resources/agents-collection/agent-file-name.agent.md",
  "description": "Agent description matching frontmatter"
}
```

### Registration Rules

- **name**: Matches YAML frontmatter `name` field
- **path**: Relative path from extension root
- **description**: Matches YAML frontmatter `description` field
- Order alphabetically by name

## Testing Agents

### Manual Testing

1. Install extension in development mode
2. Open Copilot Chat
3. Type `@` to see agent in menu
4. Select agent and ask domain-specific question
5. Verify response quality and accuracy
6. Test tool invocation (if applicable)

### Automated Testing

```javascript
// Add to scripts/functional-tests.js
test('AgentName appears in agent list', async () => {
  const packageJson = require('../package.json');
  const agent = packageJson.contributes.chatAgents.find(
    a => a.name === 'AgentDisplayName'
  );
  expect(agent).toBeDefined();
  expect(agent.description).toBeTruthy();
});
```

## Constitutional Compliance

Every agent must comply with the [Constitutional Framework](resources/constitution.md):

### Article I: Specification-First

- [ ] Complete specification exists before implementation
- [ ] Specification approved before coding

### Article II: Agent Isolation

- [ ] Agent is self-contained
- [ ] No dependencies on other agents' implementation
- [ ] Clear domain boundaries

### Article III: Tool Integration

- [ ] Uses standardized tool interfaces
- [ ] Tools accessible through Copilot registry
- [ ] Tool invocation follows patterns

### Article IV: Test-First

- [ ] Test scenarios defined in spec
- [ ] Acceptance criteria are testable
- [ ] Tests verify behavior

### Article V: Copilot-Native

- [ ] Follows VS Code Chat API
- [ ] Appears in @ mention menu
- [ ] Native Copilot integration

### Article VI: Privacy-First

- [ ] No PII collection
- [ ] Respects user privacy
- [ ] Telemetry is opt-in

### Article VII: Simplicity

- [ ] Clear and maintainable structure
- [ ] No unnecessary complexity
- [ ] Readable by all skill levels

### Article VIII: Versioned Evolution

- [ ] Semantic versioning applied
- [ ] Breaking changes documented
- [ ] Backward compatibility considered

## Example: Adding Security Scanner Agent

### 1. Create Specification

```bash
mkdir specs/036-security-scanner-agent
cp resources/templates/spec-template.md specs/036-security-scanner-agent/spec.md
```

Edit `spec.md`:
```markdown
# Feature Specification: Security Scanner Agent

**Feature ID**: 036-security-scanner-agent
**Status**: Draft

## Overview
Agent specialized in detecting security vulnerabilities...

## User Scenarios & Testing

### P1 Scenario: SQL Injection Detection

**User Journey**: Developer wants to scan code for SQL injection risks

**Acceptance Criteria**:
```gherkin
Given code with database queries
When developer asks @security-scanner to review
Then agent identifies potential SQL injection points
And suggests parameterized query alternatives
```

### 2. Implement Agent

Create `resources/agents-collection/security-scanner.agent.md`:
```markdown
---
description: 'Security vulnerability scanning and secure coding practices'
name: 'Security Scanner'
---

# Security Scanner - Your Security Audit Assistant

Specialized in detecting vulnerabilities and secure coding.

## Your Expertise Areas

### 1. Vulnerability Detection
- SQL Injection
- XSS (Cross-Site Scripting)
- CSRF
...
```

### 3. Register in package.json

```json
{
  "name": "SecurityScanner",
  "path": "./resources/agents-collection/security-scanner.agent.md",
  "description": "Security vulnerability scanning and secure coding practices"
}
```

### 4. Test

```bash
# Test in Copilot Chat
@security-scanner can you review this database query for SQL injection risks?
```

### 5. Document

Update README.md:
```markdown
| **@security-scanner** | Security vulnerabilities, secure coding | Security audits |
```

## Version History

- **v3.0.0**: Introduced SDD methodology and agent specifications
- **v2.3.0**: 24 agents + 6 tools
- **v2.0.0**: Initial agent framework

## Support

For questions or issues:
- Review [SPEC_DRIVEN.md](SPEC_DRIVEN.md) for SDD workflow
- Check [Constitutional Framework](resources/constitution.md)
- See existing agents in `resources/agents-collection/` for examples
- Open issue on GitHub repository
