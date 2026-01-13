#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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
    error(`${filePath}: Missing frontmatter`);
    return;
  }

  // Required fields
  const required = ['description', 'name', 'tools', 'model'];
  for (const field of required) {
    if (!frontmatter[field]) {
      error(`${filePath}: Missing required field '${field}'`);
    }
  }

  // Validate tools array
  if (frontmatter.tools && !Array.isArray(frontmatter.tools)) {
    error(`${filePath}: 'tools' must be an array`);
  }

  // Validate model
  const validModels = ['Claude Sonnet 4.5', 'GPT-4', 'GPT-4o'];
  if (frontmatter.model && !validModels.includes(frontmatter.model)) {
    warning(`${filePath}: Unusual model '${frontmatter.model}'`);
  }

  if (!hasErrors) {
    success(`${path.basename(filePath)} is valid`);
  }
}

function validatePrompt(filePath, content) {
  info(`Validating prompt: ${path.basename(filePath)}`);

  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    error(`${filePath}: Missing frontmatter`);
    return;
  }

  // Required fields
  const required = ['description'];
  for (const field of required) {
    if (!frontmatter[field]) {
      error(`${filePath}: Missing required field '${field}'`);
    }
  }

  // Optional but common fields
  if (!frontmatter.agent) {
    warning(`${filePath}: No agent specified`);
  }

  if (!hasErrors) {
    success(`${path.basename(filePath)} is valid`);
  }
}

function validateInstruction(filePath, content) {
  info(`Validating instruction: ${path.basename(filePath)}`);

  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    error(`${filePath}: Missing frontmatter`);
    return;
  }

  // Required fields
  const required = ['description', 'applyTo'];
  for (const field of required) {
    if (!frontmatter[field]) {
      error(`${filePath}: Missing required field '${field}'`);
    }
  }

  // Validate applyTo is a valid glob pattern
  if (frontmatter.applyTo && typeof frontmatter.applyTo !== 'string') {
    error(`${filePath}: 'applyTo' must be a string (glob pattern)`);
  }

  if (!hasErrors) {
    success(`${path.basename(filePath)} is valid`);
  }
}

function validateSkill(filePath, content) {
  info(`Validating skill: ${path.basename(path.dirname(filePath))}`);

  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    error(`${filePath}: Missing frontmatter`);
    return;
  }

  // Required fields
  const required = ['name', 'description'];
  for (const field of required) {
    if (!frontmatter[field]) {
      error(`${filePath}: Missing required field '${field}'`);
    }
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
if (fs.existsSync(path.join(resourcesDir, 'agents'))) {
  const count = scanDirectory(
    path.join(resourcesDir, 'agents'),
    '.agent.md',
    validateAgent
  );
  log(`\nValidated ${count} agents\n`);
} else {
  error('Missing resources/agents directory');
}

// Validate prompts
if (fs.existsSync(path.join(resourcesDir, 'prompts'))) {
  const count = scanDirectory(
    path.join(resourcesDir, 'prompts'),
    '.prompt.md',
    validatePrompt
  );
  log(`\nValidated ${count} prompts\n`);
} else {
  error('Missing resources/prompts directory');
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
if (fs.existsSync(path.join(resourcesDir, 'skills'))) {
  const count = scanSkills(path.join(resourcesDir, 'skills'));
  log(`\nValidated ${count} skills\n`);
} else {
  error('Missing resources/skills directory');
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
