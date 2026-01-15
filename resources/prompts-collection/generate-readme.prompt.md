---
description: 'Generate comprehensive README files with all essential sections for any project'
agent: 'documentation-expert'
tools: ['codebase', 'read', 'edit']
---

# Generate README

Create a comprehensive, professional README.md file for this project.

## Analysis Steps

1. **Examine Project Structure**
   - Identify project type (library, application, CLI tool, etc.)
   - Detect programming language and framework
   - Find configuration files (package.json, pyproject.toml, etc.)
   - Locate entry points and main files

2. **Understand Project Purpose**
   - Read existing documentation
   - Analyze code to understand functionality
   - Identify key features and capabilities
   - Determine target audience

3. **Gather Technical Details**
   - List dependencies and requirements
   - Find installation steps
   - Identify usage patterns
   - Locate example code

## README Structure

Generate a README with these sections:

### 1. Header

- Project title (from package.json/pyproject.toml or directory name)
- Badges (build status, version, license, etc.)
- One-line description
- Links to demo, documentation, or website

### 2. Overview

- **What**: Clear explanation of what the project does
- **Why**: Problem it solves or value it provides
- **Who**: Target audience

### 3. Features

- Bullet list of key features and capabilities
- Use emojis for visual appeal
- Highlight unique selling points

### 4. Quick Start

- Minimal steps to get started
- Should work in under 5 minutes
- Include simple usage example

### 5. Installation

- Prerequisites (Node.js version, Python version, system dependencies)
- Step-by-step installation instructions
- Package manager commands (npm, pip, etc.)
- Alternative installation methods if applicable

### 6. Usage

- Basic usage examples with code
- Common use cases
- Configuration options
- API overview (if applicable)

### 7. Documentation

- Link to full documentation
- API reference
- Examples directory
- Tutorials

### 8. Development

- Setup development environment
- Run tests
- Build instructions
- Project structure explanation

### 9. Contributing

- Link to CONTRIBUTING.md
- Guidelines for pull requests
- Code of conduct reference

### 10. License

- License type
- Link to LICENSE file

### 11. Acknowledgments

- Credits and attributions
- Related projects
- Inspiration sources

## Code Examples

Include runnable code examples:

- Use proper syntax highlighting
- Provide complete, working examples
- Show both basic and advanced usage
- Include expected output or results

## Formatting Guidelines

- Use proper Markdown syntax
- Include table of contents for long READMEs
- Add diagrams or screenshots if beneficial
- Keep paragraphs concise (2-3 sentences)
- Use lists for better readability
- Include emojis sparingly for visual hierarchy

## Output Format

```markdown
# Project Name

[![Build Status](badge)](link)
[![License](badge)](link)
[![Version](badge)](link)

> One-line project description

## ✨ Features

- Feature 1
- Feature 2
- Feature 3

## 🚀 Quick Start

\`\`\`language
// Quick example
\`\`\`

## 📦 Installation

\`\`\`bash

# Installation command

\`\`\`

## 📖 Usage

\`\`\`language
// Usage examples
\`\`\`

## 🛠️ Development

[Development setup and contribution guide]

## 📝 License

[License information]
```

## Quality Checklist

Ensure the README:

- [ ] Clearly states project purpose in first paragraph
- [ ] Provides working quick start in under 5 minutes
- [ ] Includes all necessary installation steps
- [ ] Contains runnable code examples
- [ ] Links to additional documentation
- [ ] Specifies prerequisites and requirements
- [ ] Has proper formatting and structure
- [ ] Includes license information
- [ ] Is grammatically correct
- [ ] Is kept up-to-date with codebase
