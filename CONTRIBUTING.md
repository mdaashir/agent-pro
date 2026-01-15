# Contributing to Agent Pro

Thank you for your interest in contributing to Agent Pro! This document provides guidelines for contributing to this GitHub Copilot extension.

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git
- VS Code with GitHub Copilot extension

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/mdaashir/agent-pro.git
cd agent-pro

# Install dependencies
npm install

# Run validation
npm run validate

# Run tests
npm test
```

## Project Structure

```
agent-pro/
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
├── resources/
│   ├── agents/           # 24 agent definitions (.agent.md)
│   ├── prompts/          # 5 reusable prompts (.prompt.md)
│   ├── instructions/     # 5 language instructions (.instructions.md)
│   ├── skills/           # 5 comprehensive skills (SKILL.md)
│   ├── INDEX.md          # Resource reference
│   └── copilot-instructions.md
├── scripts/              # Build and validation scripts
├── extension.js          # Extension entry point (58 lines)
├── package.json          # Extension manifest
└── README.md            # Documentation
```

## Adding New Resources

### Adding a New Agent

1. Create a new file in `resources/agents/` with the `.agent.md` extension
2. Use kebab-case naming (e.g., `my-expert.agent.md`)
3. Include required frontmatter:

```yaml
---
description: 'Clear description of agent purpose and capabilities'
name: 'Display Name'
tools: ['read', 'edit', 'search', 'codebase', 'terminalCommand']
model: 'Claude Sonnet 4.5'
---
```

4. Add comprehensive content with examples
5. Update counts in test scripts
6. Update [resources/INDEX.md](resources/INDEX.md)
7. Update `package.json` chatAgents section

### Adding a New Prompt

1. Create file in `resources/prompts/` with `.prompt.md` extension
2. Include frontmatter:

```yaml
---
description: 'What this prompt does'
agent: 'agent-name'
tools: ['codebase', 'terminalCommand']
---
```

3. Update counts and INDEX.md

### Adding New Instructions

1. Create file in `resources/instructions/` with `.instructions.md` extension
2. Include frontmatter with `applyTo` glob pattern:

```yaml
---
description: 'Brief description'
applyTo: '**/*.ext'
---
```

### Adding a New Skill

1. Create a folder in `resources/skills/`
2. Add `SKILL.md` file with frontmatter:

```yaml
---
name: skill-name
description: 'Skill description'
---
```

3. Include capabilities, use cases, and examples

## Code Quality

### Before Committing

Run all quality checks:

```bash
# Format code
npm run format

# Lint markdown
npm run lint:md

# Validate frontmatter
npm run validate

# Run tests
npm test
```

### Formatting Rules

- Use Prettier for consistent formatting
- Follow existing markdown style
- Keep line length reasonable (suggested 100 chars)
- Use proper heading hierarchy

### Frontmatter Validation

All `.agent.md`, `.prompt.md`, `.instructions.md`, and `SKILL.md` files must have valid YAML frontmatter. Run `npm run validate` to check.

## Git Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new security expert agent
fix: correct typo in python instructions
docs: update README with new agents
chore: update dependencies
```

### Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Run all quality checks (`npm test`)
4. Commit with conventional commit messages
5. Push to your fork
6. Create a Pull Request to `develop`
7. Wait for CI checks to pass
8. Request review

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Validate frontmatter
npm run validate

# Check formatting
npm run format:check
```

### What Gets Tested

- Directory structure
- File counts (agents, prompts, instructions, skills)
- Frontmatter validity
- Required files presence
- Package.json structure
- Markdown linting

## CI/CD Pipeline

### Continuous Integration

On every push and PR to `main` or `develop`:

1. **Validation** - Lint markdown, validate frontmatter, check formatting
2. **Build** - Package extension to .vsix
3. **Test** - Run structure tests, count resources
4. **Security** - Audit dependencies, scan for secrets

### Release Process

Releases are automated via GitHub Actions:

#### Manual Release

```bash
# Patch release (1.0.0 → 1.0.1)
npm run release:patch

# Minor release (1.0.0 → 1.1.0)
npm run release:minor

# Major release (1.0.0 → 2.0.0)
npm run release:major
```

#### Automated Release

1. Push a tag: `git tag v1.0.1 && git push --tags`
2. GitHub Actions automatically:
   - Builds the extension
   - Creates a GitHub Release
   - Attaches the .vsix file
   - Generates release notes from CHANGELOG.md

### Updating CHANGELOG

Before releasing, update [CHANGELOG.md](CHANGELOG.md):

```markdown
## [1.1.0] - 2026-01-15

### Added

- New agent: Database Expert
- New skill: API Security

### Changed

- Updated Python instructions for 3.13

### Fixed

- Typo in TypeScript expert description
```

## Building the Extension

```bash
# Package extension
npm run package

# This creates agent-pro-{version}.vsix
```

### Local Testing

1. Build: `npm run package`
2. In VS Code: Extensions → Install from VSIX
3. Test all agents in Copilot Chat

## Documentation

### README Updates

Keep [README.md](README.md) current:

- Agent table with all agents
- Usage examples
- Feature list
- Installation instructions

### INDEX.md

Update [.github/INDEX.md](.github/INDEX.md) when adding resources:

- Alphabetical agent list
- Prompt descriptions
- Skill summaries
- Quick reference workflows

## Questions or Issues?

- Open an [issue](https://github.com/mdaashir/agent-pro/issues)
- Check existing documentation
- Review closed issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
