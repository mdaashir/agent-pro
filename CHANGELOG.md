# Changelog

All notable changes to the "Agent Pro" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [3.0.0] - 2026-01-15

### Added

#### Specification-Driven Development (SDD)
- Complete SDD methodology framework for systematic feature development
- Constitutional framework with 8 immutable architectural principles
- 4 SDD templates: specification, implementation plan, tasks, and quality checklist
- Numbered feature specifications directory structure (001-024: agents, 025-030: tools, 031-035: skills)
- Sample specifications for accessibility expert agent, code analyzer tool, and API development skill

#### SpecKit Tools
- `specKitConstitution` - Access constitutional framework through Copilot Chat
- `specKitSpecTemplate` - Get specification template for feature definitions
- `specKitPlanTemplate` - Get implementation plan template
- `specKitTasksTemplate` - Get task breakdown template
- `specKitChecklist` - Get quality validation checklist
- Total: **11 custom tools** (6 core + 5 SpecKit)

#### Documentation
- `SPEC_DRIVEN.md` - Comprehensive SDD methodology guide
- `AGENTS.md` - Agent integration checklist and guidelines
- `resources/constitution.md` - Constitutional framework document
- `resources/templates/` - SDD template directory with usage guide
- `specs/` - Feature specifications directory

#### Validation & Quality
- `scripts/validate-spec.js` - Specification completeness validation
- `scripts/constitutional-check.js` - Constitutional compliance checking
- Automated validation for frontmatter, sections, requirements, scenarios, and success criteria
- Constitutional article compliance verification for implementation plans

### Changed
- Extension description updated to reflect SDD capabilities
- README.md enhanced with SDD overview and SpecKit tools documentation
- Version bumped to 3.0.0 (major: breaking changes with SDD introduction)
- Tool registration message updated (6 → 11 tools)

### Governance
- Established 8 constitutional articles:
  1. Specification-First Development
  2. Agent Isolation Principle
  3. Custom Tool Integration Mandate
  4. Test-First Imperative
  5. Copilot-Native Integration
  6. Privacy-First Telemetry
  7. Simplicity and Clarity
  8. Versioned Evolution
## [2.3.0] - 2026-01-15

### Added - Analytics, New Tools & Vertical-Specific Agents

#### Telemetry & Analytics

- **TelemetryReporter Class**: Privacy-respecting local-only usage analytics
- **Tool Usage Tracking**: Tracks invocations, success/failure rates, and performance metrics
- **VS Code Commands**:
  - `Agent Pro: Show Usage Statistics` - View tool usage dashboard
  - `Agent Pro: Reset Usage Statistics` - Clear analytics data
- **Configuration Option**: `agentPro.telemetry.enabled` (default: true, stored locally only)
- **Success Rate Monitoring**: Track which tools are most effective
- **Performance Insights**: Duration tracking for tool operations

#### New Custom Tools (Total: 6)

- **dependencyAnalyzer**: Scans and analyzes project dependencies
  - Supports: package.json (Node.js), requirements.txt (Python), go.mod (Go), Cargo.toml (Rust)
  - Detects outdated packages and provides update recommendations
  - Security scanning suggestions (Dependabot, Renovate, pip-audit, cargo audit)
- **apiDesigner**: REST API design and OpenAPI specification generator
  - OpenAPI 3.1 templates and best practices
  - HTTP verb mapping, resource naming conventions
  - API design patterns (pagination, filtering, sorting, HATEOAS)
  - Security guidelines (OAuth 2.0, JWT, rate limiting)
  - Framework-specific tool recommendations (FastAPI, Express, SpringDoc)

#### New Vertical-Specific Agents (Total: 24)

- **FinTechExpert**: Financial technology and compliance specialist
  - Payment processing (Stripe, PayPal, Square, Adyen)
  - PCI DSS compliance, tokenization, encryption
  - Fraud detection, KYC/AML, risk scoring
  - Double-entry accounting, idempotency patterns
  - Cryptocurrency and blockchain integration
  - Regulatory compliance (SOC 2, GDPR, CCPA)
- **HealthcareExpert**: Healthcare technology and HIPAA compliance specialist
  - HIPAA Privacy, Security, and Breach Notification rules
  - Healthcare data standards (HL7 v2, FHIR R4/R5, DICOM, X12 EDI)
  - EHR integration (Epic, Cerner, Allscripts)
  - Telemedicine and remote patient monitoring
  - Medical device software (FDA 21 CFR, IEC 62304)
  - De-identification techniques (Safe Harbor method)

#### Enhanced Validation & Testing

- **Framework Version Detection**: Warns about outdated frameworks
  - React 16, Angular 2-9, Vue 2, Webpack 4, Node.js 10-14, Python <3.7
  - TypeScript 1-3, TLS 1.0/1.1 security warnings
- **Security Pattern Detection**: Flags security concerns
  - MD5/SHA-1 deprecation warnings
  - eval() usage risks
  - Plaintext password references
- **Comprehensive Functional Tests**: 25 test cases covering:
  - Resource structure validation
  - Extension activation and tool registration
  - Package.json integrity
  - Frontmatter validation
  - Tool error handling and telemetry
  - New agent and tool presence
- **Test Scripts**:
  - `npm run test:functional` - Run 25 functional tests
  - `npm run test:all` - Run all tests (structure + functional + validation)

### Changed

- **Total Tools**: Increased from 4 to 6 custom tools
- **Total Agents**: Increased from 22 to 24 with vertical specialists
- **Total Resources**: 40+ curated resources (24 agents + 6 tools + 5 instructions + 5 prompts + 5 skills)
- **Activation Message**: Updated to reflect "24 expert agents + 6 custom tools"
- **Description**: Highlights analytics and industry-specific expertise
- **All Tools**: Integrated telemetry logging for success/failure tracking
- **Validation Script**: Enhanced with content analysis and security checks
- **Test Expectations**: Updated agent count from 22 to 24

### Technical Details

- Telemetry data stored in VS Code global state (local only, never transmitted)
- Tool usage stats include: total invocations, success/failure counts, first/last used timestamps
- Framework detection uses regex patterns with severity levels (info, warning, error)
- Functional tests use Node.js assert module (zero external dependencies)
- All new agents follow consistent frontmatter schema with tools, model, description

### Migration Notes

- No breaking changes - fully backward compatible
- Telemetry is opt-out via configuration: `"agentPro.telemetry.enabled": false`
- New tools are automatically available to all agents on activation
- New agents appear immediately in Copilot Chat's @ menu after extension update

## [2.2.0] - 2026-01-15

### Added - Custom Tools & Extended Language Support

#### Custom Tools (Phase 2)

- **4 VSCode Native Tools** registered for all Copilot Chat agents:
  - `codeAnalyzer`: Analyzes code complexity, metrics, and patterns
  - `testGenerator`: Suggests test strategies and appropriate frameworks
  - `documentationBuilder`: Generates documentation templates
  - `performanceProfiler`: Detects performance anti-patterns
- **Tool Integration**: All tools available to agents via VSCode Language Model Tool API
- **Production Ready**: Tools handle errors gracefully and work across all file types

#### Extended Language Instructions (Phase 1)

- **3 New Language Instruction Sets**:
  - `go.instructions.md`: Effective Go best practices and idioms
  - `rust.instructions.md`: Rust API Guidelines and safety patterns
  - `java.instructions.md`: Modern Java 17+ standards and features
- **Comprehensive Coverage**: Now supports Python, TypeScript, Go, Rust, and Java
- **Auto-Applied**: Instructions automatically apply based on file type (glob patterns)

#### Enhanced Validation

- **Tool Reference Validation**: Validates agent tool references against allowed tools
- **Improved Error Messages**: Detailed error messages with suggestions and examples
- **Performance Warnings**: Warns when agents exceed recommended tool count (>10)
- **Quality Checks**: Validates description length, name format, glob patterns
- **Better Developer Experience**: Clear, actionable validation feedback

### Changed

- Updated activation message to reflect 4 new custom tools
- Enhanced validation script with tool registry and quality checks
- Bumped version to 2.2.0 for feature release

### Technical Details

- Tools registered via `vscode.lm.registerTool()` API
- Validation script now tracks 9 total tools (5 built-in + 4 custom)
- All tools registered on extension activation
- Tools work with editor context (active file, selection)
- Instruction files follow same frontmatter pattern as existing resources

## [2.1.0] - 2026-01-13

### Added - GitHub Copilot Chat Integration

- **Agents in Copilot @ Menu**: All 22 expert agents now appear in GitHub Copilot Chat's @ selector
- **Direct Agent Access**: Type `@AccessibilityExpert`, `@PythonExpert`, `@SecurityExpert`, etc. in Copilot Chat
- **Seamless Integration**: Uses VS Code's `chatAgents` contribution point for native Copilot discovery
- **No Configuration Needed**: Agents automatically available after installation

### How to Use

1. Open GitHub Copilot Chat (Ctrl+Alt+I or Cmd+Option+I)
2. Type `@` to see all available agents
3. Select an expert agent (e.g., `@PythonExpert`)
4. Chat with specialized AI experts for your development needs

### Technical Details

- Added `chatAgents` contribution with 22 agent definitions
- Each agent configured with name, path, and description
- Follows Windows AI Studio implementation pattern
- Zero runtime overhead - pure declarative configuration

## [2.0.0] - 2026-01-13

### Major Architectural Overhaul

Complete rewrite following VS Code extension best practices. Agents now use global storage instead of workspace files.

### Added

- **TreeView Sidebar**: Browse agents, prompts, skills, and instructions in dedicated sidebar
- **Virtual File System**: Access agents via `agentpro:` URI scheme (read-only)
- **Global Storage**: Agents stored in VS Code's globalStorageUri (per-user, not per-workspace)
- **New Commands**:
  - `Agent Pro: Open Agent` - Opens agent in preview tab
  - `Agent Pro: Insert Agent` - Inserts agent content at cursor position
  - `Agent Pro: Export Agent to Workspace` - Explicitly exports to workspace .github
- **Automatic Updates**: Version-based updates when extension is updated
- **Instructions Support**: Now includes all instructions files in global storage

### Changed

- **Storage Location**: `~/.github` → VS Code global storage (`~/.config/Code/User/globalStorage/mdaashir.agent-pro/`)
- **Installation**: Per-workspace → Per-user (global)
- **Updates**: Manual → Automatic (version-tracked)
- **Access Pattern**: File-based → Virtual URI-based
- **Workspace Behavior**: No automatic `.github` folder creation (zero pollution)

### Removed

- `agent-pro.update` command (now automatic)
- `agent-pro.reset` command (use VS Code's extension reload)
- `agent-pro.openStorage` command (new storage architecture)
- Automatic workspace `.github` folder creation

### Architecture

**Before (v1.x):**

- Extension → `~/.github` → Every workspace `.github`
- Workspace pollution
- Manual updates required
- Per-workspace installation

**After (v2.0):**

- Extension → Global Storage → Virtual URIs → Available everywhere
- Zero workspace pollution
- Automatic version-based updates
- Per-user installation
- Works in any workspace instantly
- Professional sidebar UI
- Optional explicit export only

### Benefits

- Follows VS Code extension best practices
- Matches architecture of professional extensions (Copilot, GitLens, Docker)
- No workspace contamination
- Agents available globally across all workspaces
- Automatic updates on extension version changes
- Read-only master copies prevent accidental edits
- Better user experience with TreeView sidebar

### Migration

**For users**: No action required. Extension automatically migrates on first activation.

**Storage locations**:

- Windows: `%APPDATA%\Code\User\globalStorage\mdaashir.agent-pro\resources`
- macOS: `~/Library/Application Support/Code/User/globalStorage/mdaashir.agent-pro/resources`
- Linux: `~/.config/Code/User/globalStorage/mdaashir.agent-pro/resources`

## [1.1.0] - 2026-01-12

### Changed

- **Global Installation**: Agents installed to `~/.github` in user home directory
- GitHub Copilot automatically discovers agents from this standard location
- Zero workspace pollution - no files created in projects
- Works exactly like built-in agents - available everywhere

### Improved

- No workspace `.github` folders needed
- Proper GitHub Copilot agent discovery
- Agents automatically available across all projects
- Added "Open Agent Storage Location" command to view `~/.github`

## [1.0.1] - 2026-01-12

### Changed

- **Automatic Installation**: Extension now automatically copies the `.github` folder to your workspace when you open it
- User can choose "Yes", "No", or "Always" when prompted for installation
- Added Command Palette commands: "Agent Pro: Install Agents" and "Agent Pro: Update Agents"
- Updated README with automatic installation workflow

### Fixed

- Agents now properly appear in GitHub Copilot Chat after installation
- Resolved workspace discovery issue that prevented agents from being recognized

## [1.0.0] - 2026-01-12

### Added

- **22 Expert Agents** for GitHub Copilot
  - Accessibility Expert - WCAG 2.2, ARIA, inclusive design
  - AI/ML Engineering Expert - Agentic AI, MLOps, PyTorch, RAG
  - Architecture Expert - Clean Architecture, DDD, system design
  - Cloud Architect - AWS, Azure, GCP, multi-cloud
  - Code Reviewer - SOLID, security, maintainability
  - Data Engineering Expert - dbt, Airflow, Snowflake, Data Mesh
  - Design Patterns Expert - SOLID, GoF 23 patterns
  - Design Systems Expert - Figma Variables, Design Tokens
  - DevOps Expert - Docker, Kubernetes, CI/CD
  - Documentation Expert - Technical writing, API docs
  - Functional Programming Expert - FRP, RxJS, monads
  - GraphQL Expert - Apollo Federation 2.10
  - Microservices Expert - SAGA, Circuit Breaker, CQRS
  - Mobile Development Expert - React Native, Flutter, iOS, Android
  - Observability & SRE Expert - OpenTelemetry, SLOs
  - Performance Expert - Profiling, optimization
  - Platform Engineering Expert - Backstage IDP, Golden Paths
  - Python Expert - Python 3.12+, asyncio, type hints
  - Security Expert - OWASP Top 10, secure coding
  - Systems Programming Expert - Rust, WebAssembly
  - Testing Specialist - TDD/BDD, quality assurance
  - TypeScript Expert - TypeScript 5.x, React, Node.js

- **5 Reusable Prompts**
  - Code Review - Comprehensive code review checklist
  - Conventional Commit - Generate semantic commit messages
  - Generate README - Create comprehensive README files
  - Generate Tests - Generate test suites (unit/integration/E2E)
  - Refactor Code - Refactor for quality and maintainability

- **2 Instruction Sets**
  - Python Instructions - PEP 8 and best practices for Python files
  - TypeScript Instructions - Standards for TypeScript/TSX files

- **5 Comprehensive Skills**
  - API Development - RESTful APIs, FastAPI, Express, validation
  - Database Design - PostgreSQL, schemas, optimization
  - GraphQL & Microservices - Federation 2.10, patterns
  - Multi-Agent Orchestration - Agent HQ, workflows
  - Testing Strategies - TDD/BDD, shift-left/right

### Technical Details

- Built for VS Code 1.90.0+
- Compatible with GitHub Copilot
- Zero configuration required
- Automatic discovery of `.github/` folder customizations
