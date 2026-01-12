# Agent Pro - GitHub Copilot Experts

A comprehensive collection of 22+ expert agents, 5 prompts, and comprehensive skills for GitHub Copilot.

Agent Pro provides 34 curated resources to enhance your development workflow with AI-powered assistance across multiple domains including architecture, security, testing, cloud infrastructure, and more.

## ✨ Features

- **22 Expert Agents** - Specialized AI assistants accessible via `@` in Copilot Chat
- **Copilot Integration** - All agents appear natively in GitHub Copilot's @ menu
- **5 Reusable Prompts** - Pre-built templates for common tasks
- **2 Instruction Sets** - Automatic coding standards for Python and TypeScript
- **5 Comprehensive Skills** - Bundled capabilities with best practices
- **Sidebar Access** - Browse and manage all agents from the TreeView
- **Global Storage** - Agents available in all your projects

## 🚀 Quick Start

1. Install Agent Pro from the VS Code Marketplace
2. Open GitHub Copilot Chat (`Ctrl+Alt+I` / `Cmd+Option+I`)
3. Type `@` to see all 22 expert agents
4. Select an agent (e.g., `@PythonExpert`) and start chatting!

## 💡 Usage

### Using Agents in Copilot Chat

Open GitHub Copilot Chat and type `@` to see all available agents:

- **Agent Pro: Update Global Agents** - Update to latest version
- **Agent Pro: Reset and Reinstall** - Reinstall all agents
- **Agent Pro: Open Agent Storage Location** - View `~/.github` folder

### Using Agents

Open GitHub Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`) and type `@` to see all available agents:

```
@python-expert help me optimize this function
@security-expert review this authentication code
@testing-specialist generate tests for this component
```

### Available Agents

| Agent                              | Specialization                         | Use When                |
| ---------------------------------- | -------------------------------------- | ----------------------- |
| **@accessibility-expert**          | WCAG 2.2, ARIA, inclusive design       | Building accessible UIs |
| **@ai-ml-engineering-expert**      | Agentic AI, MLOps, PyTorch, RAG        | ML/AI development       |
| **@architecture-expert**           | Clean Architecture, DDD, system design | Designing systems       |
| **@cloud-architect**               | AWS, Azure, GCP, multi-cloud           | Cloud infrastructure    |
| **@code-reviewer**                 | SOLID, security, maintainability       | Code reviews            |
| **@data-engineering-expert**       | dbt, Airflow, Snowflake, Data Mesh     | Data pipelines          |
| **@design-patterns-expert**        | SOLID, GoF 23 patterns                 | Design patterns         |
| **@design-systems-expert**         | Figma Variables, Design Tokens         | Design systems          |
| **@devops-expert**                 | Docker, Kubernetes, CI/CD              | DevOps workflows        |
| **@documentation-expert**          | Technical writing, API docs            | Documentation           |
| **@functional-programming-expert** | FRP, RxJS, monads                      | Functional code         |
| **@graphql-expert**                | Apollo Federation 2.10                 | GraphQL APIs            |
| **@microservices-expert**          | SAGA, Circuit Breaker, CQRS            | Microservices           |
| **@mobile-development-expert**     | React Native, Flutter, iOS, Android    | Mobile apps             |
| **@observability-sre-expert**      | OpenTelemetry, SLOs                    | Monitoring & SRE        |
| **@performance-expert**            | Profiling, optimization                | Performance tuning      |
| **@platform-engineering-expert**   | Backstage IDP, Golden Paths            | Platform engineering    |
| **@python-expert**                 | Python 3.12+, asyncio, type hints      | Python development      |
| **@security-expert**               | OWASP Top 10, secure coding            | Security reviews        |
| **@systems-programming-expert**    | Rust, WebAssembly                      | Systems programming     |
| **@testing-specialist**            | TDD/BDD, quality assurance             | Testing strategies      |
| **@typescript-expert**             | TypeScript 5.x, React, Node.js         | TypeScript/JavaScript   |

### Using Prompts

Prompts are reusable templates that work with specific agents:

- **Code Review** - Comprehensive code review checklist
- **Conventional Commit** - Generate semantic commit messages
- **Generate README** - Create comprehensive README files
- **Generate Tests** - Generate test suites (unit/integration/E2E)
- **Refactor Code** - Refactor for quality and maintainability

### Automatic Instructions

Instructions automatically apply to files matching patterns:

- **Python** (`**/*.py`) - PEP 8, type hints, modern best practices
- **TypeScript** (`**/*.ts`, `**/*.tsx`) - TS 5.x standards, React patterns

### Available Skills

Skills are comprehensive, self-contained capabilities:

1. **API Development** - RESTful APIs, FastAPI, Express, OpenAPI
2. **Database Design** - PostgreSQL, schemas, normalization, optimization
3. **GraphQL & Microservices** - Federation 2.10, distributed patterns
4. **Multi-Agent Orchestration** - Agent HQ, workflow coordination
5. **Testing Strategies** - TDD/BDD, shift-left/right, test pyramid

## 🎓 Quick Start Workflows

### Building a Web API

```
1. @graphql-expert design my API schema
2. @security-expert review authentication
3. @testing-specialist create integration tests
4. @documentation-expert generate API docs
```

### Mobile App Development

```
1. @mobile-development-expert help me structure this React Native app
2. @design-systems-expert create component library
3. @performance-expert optimize rendering
4. @accessibility-expert ensure WCAG compliance
```

### Data Pipeline

```
1. @data-engineering-expert design ETL pipeline
2. @cloud-architect set up infrastructure
3. @observability-sre-expert add monitoring
4. @testing-specialist create data quality tests
```

### AI/ML Project

```
1. @ai-ml-engineering-expert help build RAG system
2. @python-expert optimize model code
3. @platform-engineering-expert create deployment pipeline
4. @observability-sre-expert add model monitoring
```

## Documentation

For detailed documentation on each agent, prompt, and skill, see the [INDEX.md](.github/INDEX.md) file.

## Building from Source

To package this extension yourself:

```bash
# Install vsce globally
npm install -g @vscode/vsce

# Package the extension
cd /path/to/agent-pro
vsce package

# This creates agent-pro-1.0.0.vsix
```

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **Repository**: [github.com/mdaashir/agent-pro](https://github.com/mdaashir/agent-pro)
- **Issues**: [github.com/mdaashir/agent-pro/issues](https://github.com/mdaashir/agent-pro/issues)

## Requirements

- **VS Code**: 1.90.0 or higher
- **GitHub Copilot**: Active subscription required
- **GitHub Copilot Chat**: Extension must be installed

## Package Contents

- `.github/agents/` - 22 expert agent definitions
- `.github/prompts/` - 5 reusable prompt templates
- `.github/instructions/` - 2 automatic instruction sets
- `.github/skills/` - 5 comprehensive skill bundles
- `INDEX.md` - Complete reference guide
- `copilot-instructions.md` - Repository-level instructions
