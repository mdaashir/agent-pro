# Agent Pro - Complete CI/CD Setup Guide

## Overview

The Agent Pro extension includes a complete CI/CD pipeline with:

- Automated testing and validation
- Markdown linting
- Code formatting checks
- Automated releases with GitHub Actions
- Security audits
- VSIX packaging

## Files Created

### CI/CD Pipeline

- `.github/workflows/ci.yml` - Continuous Integration (runs on every push/PR)
- `.github/workflows/release.yml` - Automated releases (runs on version tags)

### Configuration Files

- `.gitignore` - Git ignore patterns
- `.prettierrc.json` - Code formatting rules
- `.prettierignore` - Files to exclude from formatting
- `.markdownlint.json` - Markdown linting configuration

### Scripts

- `scripts/validate-frontmatter.js` - Validates YAML frontmatter in all agent/prompt/instruction/skill files
- `scripts/test.js` - Tests extension structure and file counts

### Documentation

- `CONTRIBUTING.md` - Contribution guidelines and development workflow

## Getting Started with GitHub

### 1. Initialize Git Repository

```bash
cd c:\Users\mdaashir\Downloads\vscode

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial commit - agent pro extension with CI/CD pipeline"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `agent-pro`
3. Description: "22+ expert agents, 5 prompts, and comprehensive skills for GitHub Copilot"
4. Set to Public or Private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 3. Push to GitHub

```bash
# Add remote origin
git remote add origin https://github.com/mdaashir/agent-pro.git

# Rename branch to main (if needed)
git branch -M main

# Push code
git push -u origin main
```

## CI/CD Pipeline Explained

### Continuous Integration (`.github/workflows/ci.yml`)

Runs automatically on:

- Every push to `main` or `develop` branches
- Every pull request

**What it does:**

1. **Validate** - Lints markdown, validates frontmatter, checks formatting
2. **Build** - Packages extension to .vsix file
3. **Test** - Verifies directory structure and resource counts
4. **Security** - Runs npm audit and scans for secrets

### Release Workflow (`.github/workflows/release.yml`)

Runs when you create a version tag (e.g., `v1.0.1`)

**What it does:**

1. Updates version in package.json
2. Builds and packages the extension
3. Creates a GitHub Release
4. Attaches the .vsix file to the release
5. Generates release notes from CHANGELOG.md

## How to Release a New Version

### Method 1: Using NPM Scripts (Recommended)

```bash
# Patch release (1.0.0 → 1.0.1) - Bug fixes
npm run release:patch

# Minor release (1.0.0 → 1.1.0) - New features
npm run release:minor

# Major release (1.0.0 → 2.0.0) - Breaking changes
npm run release:major
```

These commands:

1. Update version in package.json
2. Create a git tag
3. Push both commit and tag to GitHub
4. Trigger the release workflow automatically

### Method 2: Manual Tagging

```bash
# Update CHANGELOG.md first with new version details
# Then commit changes
git add CHANGELOG.md
git commit -m "chore: prepare release v1.0.1"

# Create and push tag
git tag v1.0.1
git push origin v1.0.1
```

### Before Each Release

1. **Update CHANGELOG.md**

   ```markdown
   ## [1.0.1] - 2026-01-12

   ### Added

   - New feature X

   ### Fixed

   - Bug fix Y
   ```

2. **Run all checks locally**

   ```bash
   npm test
   npm run validate
   npm run format:check
   npm run lint:md
   ```

3. **Test the package**
   ```bash
   npm run package
   # Test the .vsix file locally
   ```

## Development Workflow

### Daily Development

```bash
# Format code
npm run format

# Validate frontmatter
npm run validate

# Run tests
npm test

# Package extension
npm run package
```

### Before Committing

```bash
# Check formatting (don't auto-fix)
npm run format:check

# Lint markdown
npm run lint:md

# Run all validations
npm run validate

# Run all tests
npm test
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-agent

# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit with conventional commit format
git commit -m "feat: add database expert agent"

# Push to GitHub
git push origin feature/new-agent

# Create pull request on GitHub
```

## Available NPM Scripts

| Script                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run package`       | Package extension to .vsix file            |
| `npm run lint:md`       | Lint all markdown files                    |
| `npm run format`        | Format all files with Prettier             |
| `npm run format:check`  | Check formatting without changing files    |
| `npm run validate`      | Validate frontmatter in all resource files |
| `npm test`              | Run all tests                              |
| `npm run release:patch` | Create patch release                       |
| `npm run release:minor` | Create minor release                       |
| `npm run release:major` | Create major release                       |

## CI/CD Status Badges

After pushing to GitHub, add these badges to your README.md:

```markdown
![CI](https://github.com/mdaashir/agent-pro/workflows/CI%20Pipeline/badge.svg)
![Release](https://github.com/mdaashir/agent-pro/workflows/Release/badge.svg)
```

## Continuous Integration Benefits

1. **Automatic Quality Checks** - Every commit is validated
2. **Consistent Code Style** - Prettier ensures formatting
3. **Early Bug Detection** - Tests run on every change
4. **Automated Releases** - No manual packaging needed
5. **Security Scanning** - Dependency audits and secret detection
6. **Build Artifacts** - VSIX files saved for every successful build

## Troubleshooting

### CI Failing on Push

1. Check GitHub Actions tab for error details
2. Run the failing command locally:
   ```bash
   npm test
   npm run validate
   npm run lint:md
   ```
3. Fix issues and push again

### Release Not Creating

1. Ensure tag follows format: `v1.0.0` (with 'v' prefix)
2. Check GitHub Actions permissions (Settings → Actions → General)
3. Verify CHANGELOG.md has entry for the version

### Formatting Issues

```bash
# Auto-fix all formatting issues
npm run format

# Then commit
git add .
git commit -m "style: fix formatting"
```

## Next Steps

1. ✅ Push code to GitHub: `git push -u origin main`
2. ✅ Verify CI pipeline runs successfully
3. ✅ Create your first release: `npm run release:patch`
4. ✅ Share the extension with others via GitHub Releases
5. 📦 Optionally: Set up GitHub Pages for documentation

## Advanced: Marketplace Publishing (Optional)

To publish to VS Code Marketplace later:

1. Get publisher account at https://marketplace.visualstudio.com/
2. Create Personal Access Token in Azure DevOps
3. Add token as GitHub secret: `VSCE_PAT`
4. Update `.github/workflows/release.yml`:
   ```yaml
   publish-marketplace:
     if: true # Change from false to true
   ```

---

**The extension is now production-ready with enterprise-grade CI/CD.**
