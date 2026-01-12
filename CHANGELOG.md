# Changelog

All notable changes to the "Agent Pro" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
