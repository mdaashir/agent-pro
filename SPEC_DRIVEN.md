# Specification-Driven Development in Agent Pro

Agent Pro adopts **Specification-Driven Development (SDD)**, a methodology where specifications are the source of truth and implementation follows from clear, testable requirements.

## Overview

Traditional development treats specifications as temporary guides that become outdated. SDD flips this model: **specifications are executable documentation** that drive implementation, testing, and validation.

### Core Principle

> Code serves specifications, not the other way around.

In SDD, you focus on **WHAT** the feature does (specification) before **HOW** it's implemented (code). This ensures intentional design and predictable outcomes.

## Why SDD for Agent Pro?

Agent Pro manages 24+ expert agents, 6+ custom tools, 5+ skills, and multiple instruction sets. Without a systematic approach, this complexity leads to:
- Inconsistent agent behavior across updates
- Unclear requirements for new features
- Difficulty validating that features work as intended
- LLM-generated code that drifts from original intent

SDD provides:
- **Consistency**: All features follow the same specification process
- **Quality**: Testable acceptance criteria ensure features work
- **Maintainability**: Specifications document intent permanently
- **Scalability**: New contributors understand features through specs

## The SDD Workflow

```
1. SPECIFY → 2. VALIDATE → 3. PLAN → 4. TASKS → 5. IMPLEMENT
   (spec)      (checklist)    (plan)    (tasks)     (code)
```

### Step 1: SPECIFY

Create a complete specification defining WHAT the feature does.

**Template**: [resources/templates/spec-template.md](resources/templates/spec-template.md)

**Key Sections**:
- **User Scenarios**: Given/When/Then acceptance criteria (P1/P2/P3 prioritized)
- **Requirements**: Functional (FR-###) and non-functional (NFR-###) requirements
- **Success Criteria**: Measurable outcomes
- **Dependencies**: What this feature needs
- **Out of Scope**: What this feature explicitly does NOT do

**Focus**: WHAT, not HOW. Describe behavior, not implementation.

**Example**:
```markdown
## User Scenario: Accessibility Validation

Given a React component with interactive elements
When developer asks @accessibility-expert to review
Then agent identifies non-semantic elements
And suggests semantic alternatives with examples
```

### Step 2: VALIDATE

Use the quality checklist to validate specification completeness.

**Template**: [resources/templates/checklist-template.md](resources/templates/checklist-template.md)

**Checks**:
- All scenarios have Given/When/Then format
- Requirements are unambiguous and testable
- Success criteria are measurable
- Constitutional compliance verified
- No vague language or undefined terms

**Outcome**: APPROVED | APPROVED WITH CHANGES | REJECTED

### Step 3: PLAN

Create implementation plan defining HOW the feature will be built.

**Template**: [resources/templates/plan-template.md](resources/templates/plan-template.md)

**Key Sections**:
- **Technical Context**: Language, framework, dependencies
- **Constitutional Check**: Verify alignment with [Constitutional Framework](resources/constitution.md)
- **Architecture**: Component design, data models, API contracts
- **Phases**: Setup, Core Implementation, Integration, Testing, Documentation
- **Testing Strategy**: Unit, integration, manual tests

**Focus**: HOW. Technical decisions, architecture, implementation approach.

### Step 4: TASKS

Break down implementation into executable tasks.

**Template**: [resources/templates/tasks-template.md](resources/templates/tasks-template.md)

**Organization**: Tasks grouped by phase with deliverables and acceptance criteria.

**Example**:
```markdown
### Phase 1: Core Implementation
- [ ] Task 1.1: Create agent definition file
  - Deliverable: accessibility-expert.agent.md
  - Acceptance: File follows agent template structure

- [ ] Task 1.2: Implement WCAG validation logic
  - Deliverable: WCAG checker function
  - Acceptance: Unit tests pass
```

### Step 5: IMPLEMENT

Execute tasks, write tests, build the feature.

**Principles**:
- Follow the plan and tasks in order
- Write tests first or alongside code (Test-First Imperative)
- Update documentation as you build
- Commit frequently with clear messages

## The Constitutional Framework

All features must align with the [Agent Pro Constitutional Framework](resources/constitution.md).

### Eight Constitutional Articles

1. **Specification-First Development**: No code without spec
2. **Agent Isolation Principle**: Agents are independent
3. **Custom Tool Integration Mandate**: Tools available to all agents
4. **Test-First Imperative**: Tests before/with implementation
5. **Copilot-Native Integration**: Follow VS Code Chat API
6. **Privacy-First Telemetry**: Local-only, opt-out available
7. **Simplicity and Clarity**: Favor simple over clever
8. **Versioned Evolution**: Semantic versioning, backward compatibility

The constitution is **immutable** while implementation approaches evolve.

## Feature Directory Structure

Each feature gets a numbered directory:

```
specs/
└── ###-feature-name/
    ├── spec.md          (from spec-template.md)
    ├── plan.md          (from plan-template.md)
    ├── tasks.md         (from tasks-template.md)
    ├── checklist.md     (from checklist-template.md)
    └── research.md      (optional)
```

### Numbering Convention

- **001-024**: Existing agents (24 expert agents)
- **025-030**: Custom tools (6 tools)
- **031-035**: Skills (5 comprehensive skills)
- **036+**: Future features

## Using SpecKit Tools in Copilot Chat

Agent Pro provides 5 SpecKit tools accessible through Copilot Chat:

1. **specKitConstitution**: Get constitutional framework
2. **specKitSpecTemplate**: Get specification template
3. **specKitPlanTemplate**: Get implementation plan template
4. **specKitTasksTemplate**: Get task breakdown template
5. **specKitChecklist**: Get quality validation checklist

**Usage Example**:
```
@agent-pro Can you use the specKitSpecTemplate tool to help me create
a specification for a new security scanning agent?
```

Agents will invoke these tools to access templates and guide you through SDD.

## Development Workflow

### Creating a New Feature

1. **Determine Feature Number**: Check `specs/` for next number
2. **Create Directory**: `specs/###-feature-name/`
3. **Copy Templates**: From `resources/templates/`
4. **Write Specification**: Fill in `spec.md` focusing on WHAT
5. **Validate**: Use `checklist.md` to review
6. **Get Approval**: Have spec reviewed and approved
7. **Plan Implementation**: Fill in `plan.md` with HOW
8. **Break Down Tasks**: Create actionable tasks in `tasks.md`
9. **Implement**: Execute tasks, write tests, build feature
10. **Update Docs**: Update README, CHANGELOG

### Working on Existing Features

1. **Read Specification**: Understand WHAT the feature does
2. **Review Plan**: Understand HOW it's implemented
3. **Check Tasks**: See what's completed, what remains
4. **Update Spec**: If requirements change, update spec first
5. **Follow SDD**: Maintain spec → plan → tasks → code flow

## Best Practices

### Writing Specifications

- Use concrete examples, not abstract descriptions
- Prioritize scenarios: P1 (Critical), P2 (Important), P3 (Nice-to-Have)
- Mark uncertainties with `[NEEDS CLARIFICATION]`
- Focus on user value, not technical details
- Make acceptance criteria testable

### Writing Plans

- Check constitutional compliance first
- Define clear component boundaries
- Document error handling strategy
- Include migration path for breaking changes
- Keep complexity tracking transparent

### Writing Tasks

- Each task has clear deliverable and acceptance criteria
- Tasks are independent when possible
- Tasks are small enough to complete in one session
- Mark dependencies between tasks
- Update status as you work

## Quality Assurance

### Specification Quality

- **Completeness**: All required sections filled
- **Clarity**: No ambiguous language or undefined terms
- **Consistency**: No contradictions within or between documents
- **Testability**: All requirements have testable acceptance criteria

### Constitutional Compliance

Every feature must pass constitutional review:
- Spec-first approach followed
- Test strategy defined
- Privacy respected
- Simplicity favored

### Validation Scripts

Agent Pro includes validation scripts to check SDD compliance:
- `scripts/validate-spec.js`: Validates specification structure
- `scripts/validate-frontmatter.js`: Checks YAML frontmatter
- `scripts/constitutional-check.js`: Verifies constitutional alignment

## Timeline Estimates

Using SDD with AI assistance:

| Activity | Traditional | SDD + AI | Time Saved |
|----------|-------------|----------|------------|
| Specification | 4 hours | 15 min | 93% |
| Implementation Plan | 4 hours | 15 min | 93% |
| Task Breakdown | 2 hours | 10 min | 92% |
| Implementation | 8 hours | 6 hours | 25% |
| **Total** | **18 hours** | **~7 hours** | **61%** |

SDD accelerates planning dramatically while maintaining quality.

## Examples

### Example 1: Accessibility Expert Agent

- **Spec**: [specs/001-accessibility-expert-agent/spec.md](specs/001-accessibility-expert-agent/spec.md)
- Demonstrates P1/P2/P3 scenario prioritization
- Clear WCAG compliance requirements
- Measurable success criteria

### Example 2: Code Analyzer Tool

- **Spec**: [specs/025-code-analyzer-tool/spec.md](specs/025-code-analyzer-tool/spec.md)
- Shows tool integration patterns
- Defines structured JSON output format
- Multi-language support requirements

### Example 3: API Development Skill

- **Spec**: [specs/031-api-development-skill/spec.md](specs/031-api-development-skill/spec.md)
- Comprehensive skill specification
- OpenAPI generation requirements
- Security and best practices

## Resources

- [Constitutional Framework](resources/constitution.md) - Governing principles
- [Templates](resources/templates/) - Spec, plan, tasks, checklist templates
- [Specs Directory](specs/) - All feature specifications
- [AGENTS.md](AGENTS.md) - Agent integration guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution workflow

## Common Questions

### When do I need a full specification?

For any feature that:
- Adds new agent, tool, or skill
- Changes existing behavior
- Affects multiple components
- Requires architectural decisions

Simple bug fixes or documentation updates may not need full SDD.

### Can I modify the templates?

Yes, customize templates as needed for your feature. Just maintain:
- Constitutional compliance
- Clear acceptance criteria
- Measurable success criteria

### What if requirements change mid-implementation?

Update the specification first, then adjust plan and tasks. The spec is the source of truth.

### How do I validate my specification?

1. Use the quality checklist template
2. Run validation scripts (when available)
3. Have another developer review
4. Ensure all acceptance criteria are testable

## Conclusion

Specification-Driven Development ensures Agent Pro remains consistent, maintainable, and scalable as it grows. By focusing on clear specifications before implementation, we build features that solve real problems with predictable outcomes.

Remember: **Specifications first, code follows.**
