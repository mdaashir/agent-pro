# Agent Pro - GitHub Copilot Experts

A comprehensive collection of **24+ expert agents** (including FinTech & Healthcare specialists), **6 custom tools** with built-in analytics, **5 language instructions**, **5 prompts**, and **5 comprehensive skills** for GitHub Copilot.

Agent Pro provides **40+ curated resources** to enhance your development workflow with AI-powered assistance across multiple domains including architecture, security, testing, cloud infrastructure, regulated industries (finance, healthcare), and more.

## Features

- **24 Expert Agents** - Specialized AI assistants accessible via `@` in Copilot Chat
- **6 Custom Tools** - Code analysis, test generation, documentation, performance profiling, dependency analysis, and API design
- **Built-in Analytics** - Track tool usage, success rates, and performance (privacy-respecting, local only)
- **Copilot Integration** - All agents appear natively in GitHub Copilot's @ menu
- **5 Language Instructions** - Auto-applied coding standards for Python, TypeScript, Go, Rust, Java
- **5 Reusable Prompts** - Pre-built templates for common tasks
- **5 Comprehensive Skills** - Bundled capabilities with best practices
- **Enhanced Validation** - Production-ready validation with framework version checks and security pattern detection
- **Comprehensive Testing** - 25 functional tests ensure production quality
- **Global Storage** - Agents available in all your projects

## Quick Start

1. Install Agent Pro from the VS Code Marketplace
2. Open GitHub Copilot Chat (`Ctrl+Alt+I` / `Cmd+Option+I`)
3. Type `@` to see all 24 expert agents
4. Select an agent (e.g., `@PythonExpert` or `@FinTechExpert`) and start chatting!
5. Agents automatically have access to 6 custom tools for enhanced capabilities
6. View usage statistics: `Ctrl+Shift+P` → "Agent Pro: Show Usage Statistics"

## Usage

### Using Agents in Copilot Chat with Custom Tools

Open GitHub Copilot Chat and type `@` to see all available agents. All agents now have access to these custom tools:

- **codeAnalyzer** - Analyzes code complexity, metrics, and patterns
- **testGenerator** - Suggests test strategies for your code
- **documentationBuilder** - Generates documentation templates
- **performanceProfiler** - Detects performance anti-patterns
- **dependencyAnalyzer** - Scans project dependencies (package.json, requirements.txt, go.mod, Cargo.toml)
- **apiDesigner** - Provides OpenAPI 3.1 specifications and REST API best practices

Example:

```
@python-expert analyze this code for complexity
@testing-specialist suggest tests for this function
@performance-expert profile this algorithm
@fintech-expert review this payment processing code for PCI DSS compliance
@healthcare-expert validate this FHIR resource
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
| **@fintech-expert**                | PCI DSS, payments, fraud, KYC/AML      | Financial applications  |
| **@functional-programming-expert** | FRP, RxJS, monads                      | Functional code         |
| **@graphql-expert**                | Apollo Federation 2.10                 | GraphQL APIs            |
| **@healthcare-expert**             | HIPAA, HL7/FHIR, EHR integration       | Healthcare applications |
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

- **Python** (`**/*.py`) - PEP 8, type hints, asyncio, modern best practices
- **TypeScript** (`**/*.ts`, `**/*.tsx`) - TS 5.x standards, React patterns
- **Go** (`**/*.go`) - Effective Go, idioms, error handling
- **Rust** (`**/*.rs`) - Rust API Guidelines, ownership, safety patterns
- **Java** (`**/*.java`) - Modern Java 17+, records, sealed classes, streams

### Available Skills

Skills are comprehensive, self-contained capabilities:

1. **API Development** - RESTful APIs, FastAPI, Express, OpenAPI
2. **Database Design** - PostgreSQL, schemas, normalization, optimization
3. **GraphQL & Microservices** - Federation 2.10, distributed patterns
4. **Multi-Agent Orchestration** - Agent HQ, workflow coordination
5. **Testing Strategies** - TDD/BDD, shift-left/right, test pyramid

## 🛠️ Custom Tools

All agents have access to 6 specialized tools:

### 1. Code Analyzer

Analyzes code complexity, metrics, and patterns:

- Total lines, code lines, comment lines
- Average line length and comment ratio
- Language-specific insights

### 2. Test Generator

Suggests test strategies and frameworks:

- Recommends appropriate testing framework (Jest, pytest, JUnit, etc.)
- Identifies test types needed (unit, integration, edge cases)
- Analyzes code structure for testability

### 3. Documentation Builder

Generates documentation templates:

- Language-specific doc formats (JSDoc, TSDoc, docstring, JavaDoc, etc.)
- Function/method documentation structure
- Usage examples and best practices

### 4. Performance Profiler

Detects performance anti-patterns:

- Array operations in loops
- Inefficient chaining (map+filter)
- Deep clone anti-patterns
- Framework-specific optimizations

### 5. Dependency Analyzer

Scans and analyzes project dependencies:

- Supports: package.json (Node.js), requirements.txt (Python), go.mod (Go), Cargo.toml (Rust)
- Detects outdated packages and provides update recommendations
- Security scanning suggestions (Dependabot, Renovate, pip-audit, cargo audit)

### 6. API Designer

REST API design and OpenAPI specification generator:

- OpenAPI 3.1 templates and best practices
- HTTP verb mapping and resource naming conventions
- API design patterns (pagination, filtering, sorting, HATEOAS)
- Security guidelines (OAuth 2.0, JWT, rate limiting)
- Framework-specific tool recommendations (FastAPI, Express, SpringDoc)

## 🎓 Quick Start Workflows

### Building a Web API

```
1. @graphql-expert design my API schema
2. Use codeAnalyzer tool to check complexity
3. @security-expert review authentication
4. @testing-specialist create integration tests (with testGenerator)
5. @documentation-expert generate API docs (with documentationBuilder)
```

### Mobile App Development

```
1. @mobile-development-expert help me structure this React Native app
2. @design-systems-expert create component library
3. @performance-expert optimize rendering (with performanceProfiler)
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
2. @python-expert optimize model code (with codeAnalyzer)
3. @platform-engineering-expert create deployment pipeline
4. @observability-sre-expert add model monitoring
```

## 📚 What's New in v2.3.0

### Custom Tools (Phase 2)

- 6 VSCode native tools for all agents
- Code analysis, test generation, documentation, performance profiling, dependency analysis, and API design
- Production-ready error handling

### Extended Language Support (Phase 1)

- 3 new instruction sets: Go, Rust, Java
- Comprehensive best practices for each language
- Auto-applied based on file type

### Enhanced Validation

- Tool reference validation
- Improved error messages with suggestions
- Performance warnings for tool count
- Quality checks for names and descriptions

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

- `resources/agents/` - 22 expert agent definitions
- `resources/prompts/` - 5 reusable prompt templates
- `resources/instructions/` - 2 automatic instruction sets
- `resources/skills/` - 5 comprehensive skill bundles
- Global access via Copilot Chat (`@agent-name`)
- Installed to `~/.config/Code/User/globalStorage/mdaashir.agent-pro/` on activation
