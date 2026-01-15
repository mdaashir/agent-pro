# Agent Pro - Copilot Instructions

## Project Overview

Agent Pro is a comprehensive GitHub Copilot extension providing 24+ expert agents, 11 custom tools, 5 language instructions, 5 prompts, 5 skills, and a complete **Specification-Driven Development (SDD)** framework.

## Specification-Driven Development

Agent Pro follows SDD methodology where specifications are the source of truth:

### Core Workflow

```
SPECIFY -> VALIDATE -> PLAN -> TASKS -> IMPLEMENT
```

1. **SPECIFY**: Define WHAT (spec-template.md)
2. **VALIDATE**: Check completeness (checklist-template.md)
3. **PLAN**: Define HOW (plan-template.md)
4. **TASKS**: Break down work (tasks-template.md)
5. **IMPLEMENT**: Execute tasks

### Constitutional Framework

All development follows 8 constitutional articles:

1. **Specification-First Development** - No code without spec
2. **Agent Isolation Principle** - Agents are independent
3. **Custom Tool Integration Mandate** - Tools available to all agents
4. **Test-First Imperative** - Tests with implementation
5. **Copilot-Native Integration** - Follow VS Code Chat API
6. **Privacy-First Telemetry** - Local-only analytics
7. **Simplicity and Clarity** - Favor simple over clever
8. **Versioned Evolution** - Semantic versioning

### Using SDD Tools

Agents have access to these SpecKit tools:
- `specKitConstitution` - Get constitutional framework
- `specKitSpecTemplate` - Get specification template
- `specKitPlanTemplate` - Get implementation plan template
- `specKitTasksTemplate` - Get task breakdown template
- `specKitChecklist` - Get quality validation checklist

## Repository Structure

```
agent-pro/
├── resources/
│   ├── agents/           # 24 expert agents
│   ├── prompts/          # 5 reusable prompts
│   ├── instructions/     # 5 language instructions
│   ├── skills/           # 5 comprehensive skills
│   ├── templates/        # SDD templates
│   └── constitution.md   # Constitutional framework
├── specs/                # Feature specifications
├── scripts/              # Validation scripts
└── extension.js          # Extension entry point
```

## How Agents Work

Agents are Markdown files with YAML frontmatter registered in package.json. They:
- Appear in Copilot Chat @-mention menu
- Have access to all custom tools
- Are copied to global storage on activation
- Reference related prompts, skills, and instructions inline

## File Naming Conventions

- **Agents**: `*.agent.md` (e.g., `python-expert.agent.md`)
- **Prompts**: `*.prompt.md` (e.g., `generate-readme.prompt.md`)
- **Instructions**: `*.instructions.md` (e.g., `typescript.instructions.md`)
- **Skills**: Folders with `SKILL.md` file inside
- **Specs**: `specs/###-feature-name/spec.md`

All filenames use lowercase with hyphens (kebab-case).

## Required Frontmatter

### For Agents

```yaml
---
description: 'Clear description of agent purpose and capabilities'
name: 'Display Name'
tools: ['read', 'edit', 'search', 'codebase', 'terminalCommand']
model: 'Claude Sonnet 4.5'
---
```

### For Prompts

```yaml
---
description: 'What this prompt does'
agent: 'agent-name'
tools: ['codebase', 'terminalCommand']
---
```

### For Instructions

```yaml
---
description: 'Brief description of purpose'
applyTo: '**/*.ts, **/*.tsx'
---
```

### For Skills

```yaml
---
name: skill-name
description: 'What this skill does and when to use it'
---
```

## Agent Development Guidelines

### When Creating New Agents

1. First create specification in `specs/###-agent-name/spec.md`
2. Validate spec with checklist template
3. Create agent file in `resources/agents/`
4. Register in `package.json` contributes.chatAgents
5. Test in Copilot Chat

### Agent Structure

```markdown
---
description: 'Concise description'
name: 'Agent Name'
tools: ['read', 'edit', 'search', 'codebase', 'terminalCommand']
---

# Agent Name - Tagline

Brief overview paragraph.

## Your Expertise Areas

### 1. Primary Domain
- Capability 1
- Capability 2

### 2. Secondary Domain
- Capability 1
- Capability 2

## Code Examples

### Example 1: Common Use Case

```language
// Code with comments
```

## Best Practices

- Practice 1
- Practice 2

## Related Resources

- **Prompt**: [Related Prompt](../prompts/related.prompt.md)
- **Skill**: [Related Skill](../skills/related/SKILL.md)
- **Instruction**: [Related Instruction](../instructions/related.instructions.md)
```

## Custom Tools

### Core Tools (6)
- `codeAnalyzer` - Code complexity and metrics
- `testGenerator` - Test strategy suggestions
- `documentationBuilder` - Documentation templates
- `performanceProfiler` - Performance anti-patterns
- `dependencyAnalyzer` - Dependency scanning
- `apiDesigner` - OpenAPI specifications

### SpecKit Tools (5)
- `specKitConstitution` - Constitutional framework
- `specKitSpecTemplate` - Specification template
- `specKitPlanTemplate` - Implementation plan template
- `specKitTasksTemplate` - Task breakdown template
- `specKitChecklist` - Quality checklist

## Quality Standards

- **Clarity**: Instructions should be specific and actionable
- **Examples**: Include concrete code examples with comments
- **Completeness**: Cover common scenarios and edge cases
- **Validation**: Test all examples to ensure they work correctly
- **Constitutional Compliance**: Follow the 8 articles

## Build and Validation

```bash
# Validate all specifications
node scripts/validate-spec.js

# Check constitutional compliance
node scripts/constitutional-check.js constitution

# Validate frontmatter
node scripts/validate-frontmatter.js

# Run all tests
npm run test:all
```

## Trust These Instructions

This file is the primary reference for Agent Pro development. Follow SDD methodology and constitutional principles for all changes.
