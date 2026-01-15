#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Utility: Extract major version from various semver formats
function getMajorVersion(version) {
  if (!version) return null;
  const match = version.match(/^[~^>=<]*(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let hasErrors = false;
let hasWarnings = false;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`✗ ERROR: ${message}`, 'red');
  hasErrors = true;
}

function warning(message) {
  log(`⚠ WARNING: ${message}`, 'yellow');
  hasWarnings = true;
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

// Valid tools available in Copilot Chat
const VALID_TOOLS = [
  'read',
  'edit',
  'search',
  'codebase',
  'terminalCommand'
];

// Custom tools registered by the extension
const CUSTOM_TOOLS = [
  'codeAnalyzer',
  'testGenerator',
  'documentationBuilder',
  'performanceProfiler',
  'dependencyAnalyzer',
  'apiDesigner'
];

const ALL_VALID_TOOLS = [...VALID_TOOLS, ...CUSTOM_TOOLS];

// Potentially outdated framework versions to warn about
const OUTDATED_PATTERNS = [
  { pattern: /React\s+16/gi, message: 'React 16 is outdated - consider React 18+', severity: 'info' },
  { pattern: /Angular\s+[2-9](?!\d)/gi, message: 'Angular 2-9 is outdated - consider Angular 17+', severity: 'info' },
  { pattern: /Vue\s+2/gi, message: 'Vue 2 is outdated - consider Vue 3+', severity: 'info' },
  { pattern: /Webpack\s+4/gi, message: 'Webpack 4 is outdated - consider Webpack 5 or Vite', severity: 'info' },
  { pattern: /Node\.?js\s+1[0-4]/gi, message: 'Node.js 10-14 is EOL - recommend Node.js 20 LTS', severity: 'warning' },
  { pattern: /Python\s+[2-3]\.[0-6]/gi, message: 'Python version is outdated - recommend Python 3.11+', severity: 'warning' },
  { pattern: /TypeScript\s+[1-3]\./gi, message: 'TypeScript 1-3 is outdated - recommend TypeScript 5.x', severity: 'info' },
  { pattern: /\bTLS\s+1\.[01]\b/gi, message: 'TLS 1.0/1.1 is deprecated - require TLS 1.2+ for security', severity: 'warning' },
  { pattern: /jQuery(?!\s+\d)/gi, message: 'jQuery usage detected - modern frameworks (React/Vue) recommended', severity: 'info' },
];

// Security-related patterns to flag
const SECURITY_PATTERNS = [
  { pattern: /MD5/gi, message: 'MD5 is cryptographically broken - use SHA-256 or better', severity: 'warning' },
  { pattern: /SHA-?1(?!\w)/gi, message: 'SHA-1 is deprecated for security - use SHA-256+', severity: 'warning' },
  { pattern: /\beval\s*\(/gi, message: 'eval() usage is a security risk', severity: 'warning' },
  { pattern: /password.*plaintext|plaintext.*password/gi, message: 'Plaintext password references detected', severity: 'error' },
];

function checkContentForIssues(filePath, content) {
  let issuesFound = false;

  // Check for outdated frameworks
  for (const { pattern, message, severity } of OUTDATED_PATTERNS) {
    if (pattern.test(content)) {
      if (severity === 'warning') {
        warning(`${path.basename(filePath)}: ${message}`);
      } else {
        info(`${path.basename(filePath)}: ${message}`);
      }
      issuesFound = true;
      pattern.lastIndex = 0; // Reset regex
    }
  }

  // Check for security concerns
  for (const { pattern, message, severity } of SECURITY_PATTERNS) {
    if (pattern.test(content)) {
      if (severity === 'error') {
        error(`${path.basename(filePath)}: ${message}`);
      } else {
        warning(`${path.basename(filePath)}: ${message}`);
      }
      issuesFound = true;
      pattern.lastIndex = 0; // Reset regex
    }
  }

  return issuesFound;
}

function extractFrontmatter(content) {
  // Remove code fence if present (e.g., ```chatagent, ```prompt)
  const cleanContent = content.replace(/^```[a-z]*\r?\n/, '');

  // Match frontmatter with flexible line endings
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = cleanContent.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  try {
    return yaml.load(match[1]);
  } catch (e) {
    throw new Error(`Invalid YAML: ${e.message}`);
  }
}

function validateAgent(filePath, content) {
  info(`Validating agent: ${path.basename(filePath)}`);

  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    error(`${filePath}: Missing frontmatter block (should start with --- and end with ---)`);
    return;
  }

  // Required fields
  const required = ['description', 'name', 'tools', 'model'];
  for (const field of required) {
    if (!frontmatter[field]) {
      error(`${filePath}: Missing required field '${field}' in frontmatter`);
    }
  }

  // Validate tools array
  if (frontmatter.tools) {
    if (!Array.isArray(frontmatter.tools)) {
      error(`${filePath}: 'tools' must be an array (e.g., tools: ['read', 'edit', 'search'])`);
    } else {
      // Validate each tool reference
      const invalidTools = frontmatter.tools.filter(tool => !ALL_VALID_TOOLS.includes(tool));
      if (invalidTools.length > 0) {
        error(
          `${filePath}: Unknown tools: ${invalidTools.join(', ')}\n` +
          `  Valid tools are: ${ALL_VALID_TOOLS.join(', ')}`
        );
      }

      // Warn if tool list is empty
      if (frontmatter.tools.length === 0) {
        warning(`${filePath}: Agent has no tools assigned`);
      }

      // Warn if excessive tools (performance concern)
      if (frontmatter.tools.length > 10) {
        warning(
          `${filePath}: Agent has ${frontmatter.tools.length} tools (recommended max: 10)\n` +
          `  Too many tools may cause slower response times and context overhead`
        );
      }
    }
  }

  // Validate model
  const validModels = ['Claude Sonnet 4.5', 'GPT-4', 'GPT-4o'];
  if (frontmatter.model && !validModels.includes(frontmatter.model)) {
    warning(
      `${filePath}: Unusual model '${frontmatter.model}'\n` +
      `  Recommended models: ${validModels.join(', ')}`
    );
  }

  // Validate name format (should be descriptive)
  if (frontmatter.name && frontmatter.name.length < 3) {
    warning(`${filePath}: Agent name '${frontmatter.name}' is very short (recommended: 3+ characters)`);
  }

  // Validate description (should be meaningful)
  if (frontmatter.description && frontmatter.description.length < 10) {
    warning(`${filePath}: Description is too short (recommended: 10+ characters for clarity)`);
  }

  // Check agent content for outdated frameworks and security issues
  checkContentForIssues(filePath, content);

  if (!hasErrors) {
    success(`${path.basename(filePath)} is valid`);
  }
}

function validatePrompt(filePath, content) {
  info(`Validating prompt: ${path.basename(filePath)}`);

  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    error(`${filePath}: Missing frontmatter block (should start with --- and end with ---)`);
    return;
  }

  // Required fields
  const required = ['description'];
  for (const field of required) {
    if (!frontmatter[field]) {
      error(`${filePath}: Missing required field '${field}' in frontmatter`);
    }
  }

  // Optional but common fields
  if (!frontmatter.agent) {
    warning(`${filePath}: No agent specified (consider adding 'agent' field for context)`);
  }

  // Validate description quality
  if (frontmatter.description && frontmatter.description.length < 10) {
    warning(`${filePath}: Description is too short (recommended: 10+ characters for clarity)`);
  }

  if (!hasErrors) {
    success(`${path.basename(filePath)} is valid`);
  }
}

function validateInstruction(filePath, content) {
  info(`Validating instruction: ${path.basename(filePath)}`);

  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    error(`${filePath}: Missing frontmatter block (should start with --- and end with ---)`);
    return;
  }

  // Required fields
  const required = ['description', 'applyTo'];
  for (const field of required) {
    if (!frontmatter[field]) {
      error(`${filePath}: Missing required field '${field}' in frontmatter`);
    }
  }

  // Validate applyTo is a valid glob pattern
  if (frontmatter.applyTo) {
    if (typeof frontmatter.applyTo !== 'string') {
      error(`${filePath}: 'applyTo' must be a string (glob pattern like '**/*.py')`);
    } else if (!frontmatter.applyTo.includes('*')) {
      warning(
        `${filePath}: 'applyTo' pattern '${frontmatter.applyTo}' doesn't contain wildcards\n` +
        `  Consider using glob patterns like '**/*.py' or '**/*.ts'`
      );
    }
  }

  // Validate description quality
  if (frontmatter.description && frontmatter.description.length < 10) {
    warning(`${filePath}: Description is too short (recommended: 10+ characters for clarity)`);
  }

  if (!hasErrors) {
    success(`${path.basename(filePath)} is valid`);
  }
}

function validateSkill(filePath, content) {
  info(`Validating skill: ${path.basename(path.dirname(filePath))}`);

  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    error(`${filePath}: Missing frontmatter block (should start with --- and end with ---)`);
    return;
  }

  // Required fields
  const required = ['name', 'description'];
  for (const field of required) {
    if (!frontmatter[field]) {
      error(`${filePath}: Missing required field '${field}' in frontmatter`);
    }
  }

  // Validate name quality
  if (frontmatter.name && frontmatter.name.length < 3) {
    warning(`${filePath}: Skill name '${frontmatter.name}' is very short (recommended: 3+ characters)`);
  }

  // Validate description quality
  if (frontmatter.description && frontmatter.description.length < 10) {
    warning(`${filePath}: Description is too short (recommended: 10+ characters for clarity)`);
  }

  if (!hasErrors) {
    success(`${path.basename(path.dirname(filePath))} is valid`);
  }
}

function scanDirectory(dir, extension, validator) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isFile() && file.name.endsWith(extension)) {
      const content = fs.readFileSync(filePath, 'utf8');
      validator(filePath, content);
      count++;
    }
  }

  return count;
}

function scanSkills(dir) {
  const skillDirs = fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let count = 0;

  for (const skillDir of skillDirs) {
    const skillPath = path.join(dir, skillDir, 'SKILL.md');

    if (fs.existsSync(skillPath)) {
      const content = fs.readFileSync(skillPath, 'utf8');
      validateSkill(skillPath, content);
      count++;
    } else {
      error(`${skillDir}: Missing SKILL.md file`);
    }
  }

  return count;
}

// Main execution
log('\nValidating Agent Pro Extension Files\n', 'blue');

const resourcesDir = path.join(process.cwd(), 'resources');

// Validate agents
if (fs.existsSync(path.join(resourcesDir, 'agents-collection'))) {
  const count = scanDirectory(
    path.join(resourcesDir, 'agents-collection'),
    '.agent.md',
    validateAgent
  );
  log(`\nValidated ${count} agents\n`);
} else {
  error('Missing resources/agents-collection directory');
}

// Validate prompts
if (fs.existsSync(path.join(resourcesDir, 'prompts-collection'))) {
  const count = scanDirectory(
    path.join(resourcesDir, 'prompts-collection'),
    '.prompt.md',
    validatePrompt
  );
  log(`\nValidated ${count} prompts\n`);
} else {
  error('Missing resources/prompts-collection directory');
}

// Validate instructions
if (fs.existsSync(path.join(resourcesDir, 'instructions'))) {
  const count = scanDirectory(
    path.join(resourcesDir, 'instructions'),
    '.instructions.md',
    validateInstruction
  );
  log(`\nValidated ${count} instructions\n`);
} else {
  error('Missing resources/instructions directory');
}

// Validate skills
if (fs.existsSync(path.join(resourcesDir, 'skills-collection'))) {
  const count = scanSkills(path.join(resourcesDir, 'skills-collection'));
  log(`\nValidated ${count} skills\n`);
} else {
  error('Missing resources/skills-collection directory');
}

// Summary
log('\n' + '='.repeat(50), 'blue');
if (hasErrors) {
  log('❌ Validation FAILED with errors', 'red');
  process.exit(1);
} else if (hasWarnings) {
  log('⚠️  Validation passed with warnings', 'yellow');
  process.exit(0);
} else {
  log('✅ All validations passed!', 'green');
  process.exit(0);
}
