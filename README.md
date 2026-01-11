# Agent Pro - GitHub Copilot Experts

A comprehensive collection of 22+ expert agents, 5 prompts, and comprehensive skills for GitHub Copilot.

Agent Pro provides 34 curated resources to enhance your development workflow with AI-powered assistance across multiple domains including architecture, security, testing, cloud infrastructure, and more.

## Important Note

GitHub Copilot agents work **per-workspace**, not as global VS Code extensions. After downloading this package, you need to **copy the `.github` folder to your project workspace** for the agents to appear in GitHub Copilot Chat.

## Features

- **22 Expert Agents** - Specialized AI assistants for every development domain
- **5 Reusable Prompts** - Pre-built templates for common tasks
- **2 Instruction Sets** - Automatic coding standards for Python and TypeScript
- **5 Comprehensive Skills** - Bundled capabilities with best practices

## Installation

### Step 1: Download the Package

1. Download the `agent-pro-1.0.0.vsix` file from [Releases](https://github.com/mdaashir/agent-pro/releases)
2. Extract the `.vsix` file (it's a ZIP archive) OR install it as an extension to get the files

### Step 2: Copy to Your Workspace

**This is the critical step:**

```bash
# Navigate to your project
cd /path/to/your/project

# Copy the .github folder from the extracted extension
cp -r /path/to/agent-pro/.github ./

# Or if you installed the extension, find it in:
# Windows: %USERPROFILE%\.vscode\extensions\mdaashir.agent-pro-1.0.0\
# macOS/Linux: ~/.vscode/extensions/mdaashir.agent-pro-1.0.0/
```

**Windows PowerShell:**
```powershell
# Copy from installed extension
Copy-Item -Recurse "$env:USERPROFILE\.vscode\extensions\mdaashir.agent-pro-1.0.0\.github" -Destination .
```

### Step 3: Verify Installation

1. Open your project in VS Code
2. Open GitHub Copilot Chat (`Ctrl+Shift+I` or `Cmd+Shift+I`)
3. Type `@` in the chat input
4. You should see all 22 custom agents listed

## Usage

### Using Agents

Open GitHub Copilot Chat and type `@` to see all available agents:

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
