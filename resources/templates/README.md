# Template Index

This directory contains templates for Specification-Driven Development (SDD) in Agent Pro.

## Templates

### Core Templates

1. **[spec-template.md](spec-template.md)** - Feature specification template
   - Use for: Defining new agents, tools, skills, or features
   - Contains: User scenarios, requirements, success criteria
   - Focus: WHAT the feature does, not HOW

2. **[plan-template.md](plan-template.md)** - Implementation plan template
   - Use for: Technical planning after specification approval
   - Contains: Architecture, phases, data models, API contracts
   - Focus: HOW the feature will be implemented

3. **[tasks-template.md](tasks-template.md)** - Task breakdown template
   - Use for: Breaking down implementation into actionable steps
   - Contains: Phase-organized tasks with deliverables and acceptance criteria
   - Focus: Executable tasks with clear completion criteria

4. **[checklist-template.md](checklist-template.md)** - Quality checklist template
   - Use for: Validating specification completeness and quality
   - Contains: Completeness checks, clarity checks, constitutional compliance
   - Focus: Quality assurance before implementation

## Usage Workflow

The SDD workflow follows this sequence:

```
1. SPECIFY → 2. VALIDATE → 3. PLAN → 4. BREAK DOWN → 5. IMPLEMENT
   (spec)      (checklist)    (plan)      (tasks)       (code)
```

### Step-by-Step Process

1. **Create Specification**
   - Copy `spec-template.md` to your feature directory
   - Fill in user scenarios, requirements, success criteria
   - Focus on WHAT, avoid HOW

2. **Validate Specification**
   - Use `checklist-template.md` to review spec
   - Ensure completeness and clarity
   - Get approval before proceeding

3. **Create Implementation Plan**
   - Copy `plan-template.md` to your feature directory
   - Define architecture and technical approach
   - Verify constitutional compliance

4. **Break Down into Tasks**
   - Copy `tasks-template.md` to your feature directory
   - Create actionable tasks from plan phases
   - Assign deliverables and acceptance criteria

5. **Implement**
   - Execute tasks in order
   - Write tests first (or alongside code)
   - Update documentation as you go

## Feature Directory Structure

For each feature, create a numbered directory:

```
specs/
└── ###-feature-name/
    ├── spec.md          (from spec-template.md)
    ├── plan.md          (from plan-template.md)
    ├── tasks.md         (from tasks-template.md)
    ├── checklist.md     (from checklist-template.md)
    └── research.md      (optional: research notes)
```

Example:
```
specs/
├── 001-accessibility-expert-agent/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── checklist.md
└── 025-code-analyzer-tool/
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    └── checklist.md
```

## Template Customization

While templates provide structure, customize them as needed:
- Add sections relevant to your feature
- Remove sections that don't apply (with justification)
- Maintain constitutional compliance

## Quick Reference

| Template | Primary Purpose | Key Output |
|----------|----------------|------------|
| spec-template.md | Define feature requirements | User scenarios + acceptance criteria |
| plan-template.md | Design implementation | Architecture + phases |
| tasks-template.md | Execute implementation | Actionable tasks |
| checklist-template.md | Ensure quality | Validation results |

## Related Documentation

- [Constitutional Framework](../constitution.md) - Governing principles
- [SPEC_DRIVEN.md](../../SPEC_DRIVEN.md) - SDD methodology guide
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution workflow
