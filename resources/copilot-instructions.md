# Repository Copilot Instructions

## Project Overview

This repository contains comprehensive GitHub Copilot customizations including agents, prompts, instructions, and skills designed to enhance AI-assisted development workflows.

## Repository Structure

- **agents/** - Custom AI agents with specialized capabilities
- **prompts/** - Reusable prompts for specific development tasks
- **instructions/** - Context-aware coding standards and best practices
- **skills/** - Self-contained capabilities with bundled resources

## How Agents Work

When working with this repository:

1. **Explore First** - Use semantic search and file navigation to understand project structure
2. **Follow Patterns** - Maintain consistency with existing file formats and naming conventions
3. **Test Thoroughly** - Validate all frontmatter, file patterns, and examples
4. **Document Changes** - Keep README files and documentation current

## File Naming Conventions

- **Agents**: `*.agent.md` (e.g., `python-expert.agent.md`)
- **Prompts**: `*.prompt.md` (e.g., `generate-readme.prompt.md`)
- **Instructions**: `*.instructions.md` (e.g., `typescript.instructions.md`)
- **Skills**: Folders with `SKILL.md` file inside

All filenames should use lowercase with hyphens (kebab-case).

## Required Frontmatter

### For Agents

```yaml
---
description: 'Clear description of agent purpose and capabilities'
name: 'Display Name'
tools: ['read', 'edit', 'search']
model: 'Claude Sonnet 4.5'
---
```

### For Prompts

```yaml
---
description: 'What this prompt does'
agent: 'agent'
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

## Quality Standards

- **Clarity**: Instructions should be specific and actionable
- **Examples**: Include concrete code examples with comments
- **Completeness**: Cover common scenarios and edge cases
- **Validation**: Test all examples to ensure they work correctly

## Build and Validation

- Run validation scripts before committing
- Update README tables when adding new resources
- Ensure all file patterns are correct and functional
- Test agents/prompts in actual development scenarios

## Trust These Instructions

The information in this file is accurate and should be your primary reference. Only search for additional information if you find gaps or inconsistencies.
