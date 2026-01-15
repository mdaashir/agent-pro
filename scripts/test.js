#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

log('\nRunning Agent Pro Tests\n', 'blue');

// Test 1: Directory structure
log('Test 1: Checking directory structure...', 'blue');
const requiredDirs = [
  'resources/agents',
  'resources/prompts',
  'resources/instructions',
  'resources/skills',
];

let allDirsExist = true;
for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    console.error(`✗ Missing directory: ${dir}`);
    allDirsExist = false;
  }
}

if (allDirsExist) {
  log('✓ All required directories exist', 'green');
}

// Test 2: File counts
log('\nTest 2: Verifying resource counts...', 'blue');

const agentCount = fs.readdirSync('resources/agents')
  .filter(f => f.endsWith('.agent.md')).length;
const promptCount = fs.readdirSync('resources/prompts')
  .filter(f => f.endsWith('.prompt.md')).length;
const instructionCount = fs.readdirSync('resources/instructions')
  .filter(f => f.endsWith('.instructions.md')).length;
const skillCount = fs.readdirSync('resources/skills', { withFileTypes: true })
  .filter(d => d.isDirectory()).length;

log(`  Agents: ${agentCount}`, agentCount === 22 ? 'green' : 'reset');
log(`  Prompts: ${promptCount}`, promptCount === 5 ? 'green' : 'reset');
log(`  Instructions: ${instructionCount}`, instructionCount === 5 ? 'green' : 'reset');
log(`  Skills: ${skillCount}`, skillCount === 5 ? 'green' : 'reset');

const expectedCounts = {
  agents: 22,
  prompts: 5,
  instructions: 5,
  skills: 5,
};

if (
  agentCount === expectedCounts.agents &&
  promptCount === expectedCounts.prompts &&
  instructionCount === expectedCounts.instructions &&
  skillCount === expectedCounts.skills
) {
  log('✓ All resource counts match expectations', 'green');
} else {
  console.error('✗ Resource counts do not match expectations');
  process.exit(1);
}

// Test 3: Required files
log('\nTest 3: Checking required files...', 'blue');
const requiredFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  '.gitignore',
  'icon.png',
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`✗ Missing file: ${file}`);
    allFilesExist = false;
  }
}

if (allFilesExist) {
  log('✓ All required files exist', 'green');
}

// Test 4: Package.json validation
log('\nTest 4: Validating package.json...', 'blue');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredPkgFields = ['name', 'version', 'publisher', 'engines', 'repository'];
let pkgValid = true;

for (const field of requiredPkgFields) {
  if (!pkg[field]) {
    console.error(`✗ Missing package.json field: ${field}`);
    pkgValid = false;
  }
}

if (pkgValid) {
  log('✓ package.json is valid', 'green');
}

log('\nAll tests passed\n', 'green');
process.exit(0);
