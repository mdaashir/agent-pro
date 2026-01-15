/**
 * Functional Tests for Agent Pro Extension
 * Tests tool registration, resource installation, and core functionality
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Utility: Extract major version from various semver formats
function getMajorVersion(version) {
  if (!version) return null;
  const match = version.match(/^[~^>=<]*(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// Test configuration
const RESOURCES_DIR = path.join(__dirname, '..', 'resources');
const EXTENSION_JS = path.join(__dirname, '..', 'extension.js');
const PACKAGE_JSON = path.join(__dirname, '..', 'package.json');

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  testsRun++;
  try {
    fn();
    testsPassed++;
    log(`✓ ${name}`, 'green');
  } catch (error) {
    testsFailed++;
    log(`✗ ${name}`, 'red');
    log(`  ${error.message}`, 'red');
  }
}

// ============================================================================
// Resource Structure Tests
// ============================================================================

test('resources directory exists', () => {
  assert(fs.existsSync(RESOURCES_DIR), 'resources directory not found');
});

test('agents directory exists with .agent.md files', () => {
  const agentsDir = path.join(RESOURCES_DIR, 'agents');
  assert(fs.existsSync(agentsDir), 'agents directory not found');

  const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.agent.md'));
  assert(agents.length >= 24, `Expected at least 24 agents, found ${agents.length}`);
});

test('prompts directory exists with .prompt.md files', () => {
  const promptsDir = path.join(RESOURCES_DIR, 'prompts');
  assert(fs.existsSync(promptsDir), 'prompts directory not found');

  const prompts = fs.readdirSync(promptsDir).filter(f => f.endsWith('.prompt.md'));
  assert(prompts.length >= 5, `Expected at least 5 prompts, found ${prompts.length}`);
});

test('instructions directory exists with .instructions.md files', () => {
  const instructionsDir = path.join(RESOURCES_DIR, 'instructions');
  assert(fs.existsSync(instructionsDir), 'instructions directory not found');

  const instructions = fs.readdirSync(instructionsDir).filter(f => f.endsWith('.instructions.md'));
  assert(instructions.length >= 5, `Expected at least 5 instructions, found ${instructions.length}`);
});

test('skills directory exists with SKILL.md files', () => {
  const skillsDir = path.join(RESOURCES_DIR, 'skills');
  assert(fs.existsSync(skillsDir), 'skills directory not found');

  const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  let skillCount = 0;
  for (const dir of skillDirs) {
    const skillFile = path.join(skillsDir, dir.name, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      skillCount++;
    }
  }

  assert(skillCount >= 5, `Expected at least 5 skills, found ${skillCount}`);
});

// ============================================================================
// Extension File Tests
// ============================================================================

test('extension.js exists and is readable', () => {
  assert(fs.existsSync(EXTENSION_JS), 'extension.js not found');
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(content.length > 0, 'extension.js is empty');
});

test('extension.js exports activate and deactivate', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(content.includes('function activate'), 'Missing activate function');
  assert(content.includes('function deactivate'), 'Missing deactivate function');
  assert(content.includes('module.exports'), 'Missing module.exports');
});

test('extension.js registers all 12 custom tools', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');

  // Core tools
  const coreTools = [
    'codeAnalyzer',
    'testGenerator',
    'documentationBuilder',
    'performanceProfiler',
    'dependencyAnalyzer',
    'apiDesigner'
  ];

  // SpecKit tools
  const specKitTools = [
    'specKitConstitution',
    'specKitSpecTemplate',
    'specKitPlanTemplate',
    'specKitTasksTemplate',
    'specKitChecklist'
  ];

  // Discovery tool
  const discoveryTools = ['resourceDiscovery'];

  const allTools = [...coreTools, ...specKitTools, ...discoveryTools];

  for (const tool of allTools) {
    assert(
      content.includes(`vscode.lm.registerTool('${tool}'`),
      `Tool '${tool}' not registered`
    );
  }
});

test('extension.js includes TelemetryReporter class', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(content.includes('class TelemetryReporter'), 'TelemetryReporter class not found');
  assert(content.includes('logToolUsage'), 'logToolUsage method not found');
  assert(content.includes('getStats'), 'getStats method not found');
  assert(content.includes('resetStats'), 'resetStats method not found');
});

test('extension.js registers VS Code commands', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(
    content.includes("vscode.commands.registerCommand('agentPro.showStats'"),
    'showStats command not registered'
  );
  assert(
    content.includes("vscode.commands.registerCommand('agentPro.resetStats'"),
    'resetStats command not registered'
  );
});

// ============================================================================
// Package.json Tests
// ============================================================================

test('package.json exists and is valid JSON', () => {
  assert(fs.existsSync(PACKAGE_JSON), 'package.json not found');
  const content = fs.readFileSync(PACKAGE_JSON, 'utf8');
  const packageData = JSON.parse(content); // Will throw if invalid
  assert(packageData.name === 'agent-pro', 'Incorrect package name');
});

test('package.json declares all agents in chatAgents', () => {
  const packageData = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));

  assert(packageData.contributes, 'Missing contributes section');
  assert(packageData.contributes.chatAgents, 'Missing chatAgents contribution');

  const agents = packageData.contributes.chatAgents;
  assert(agents.length >= 24, `Expected at least 24 chat agents, found ${agents.length}`);

  // Verify critical agents exist
  const agentNames = agents.map(a => a.name);
  const requiredAgents = [
    'PythonExpert',
    'TypeScriptExpert',
    'SecurityExpert',
    'FinTechExpert',
    'HealthcareExpert'
  ];

  for (const requiredAgent of requiredAgents) {
    assert(
      agentNames.includes(requiredAgent),
      `Required agent '${requiredAgent}' not declared in package.json`
    );
  }
});

test('package.json declares commands', () => {
  const packageData = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));

  assert(packageData.contributes.commands, 'Missing commands contribution');

  const commands = packageData.contributes.commands;
  const commandIds = commands.map(c => c.command);

  assert(commandIds.includes('agentPro.showStats'), 'Missing showStats command');
  assert(commandIds.includes('agentPro.resetStats'), 'Missing resetStats command');
});

test('package.json declares configuration', () => {
  const packageData = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));

  assert(packageData.contributes.configuration, 'Missing configuration contribution');

  const config = packageData.contributes.configuration;
  assert(config.properties, 'Missing configuration properties');
  assert(
    config.properties['agentPro.telemetry.enabled'],
    'Missing telemetry.enabled configuration'
  );
});

test('package.json version is 3.0.0 or higher', () => {
  const packageData = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
  const version = packageData.version;

  const [major] = version.split('.').map(Number);
  assert(
    major >= 3,
    `Version ${version} is lower than required 3.0.0`
  );
});

// ============================================================================
// Agent Frontmatter Tests
// ============================================================================

test('all agents have valid frontmatter', () => {
  const agentsDir = path.join(RESOURCES_DIR, 'agents');
  const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.agent.md'));

  for (const file of agentFiles) {
    const content = fs.readFileSync(path.join(agentsDir, file), 'utf8');

    // Check for frontmatter delimiter
    assert(
      content.startsWith('---'),
      `${file}: Missing frontmatter delimiter`
    );

    // Check for required fields
    assert(content.includes('description:'), `${file}: Missing description`);
    assert(content.includes('name:'), `${file}: Missing name`);
    assert(content.includes('tools:'), `${file}: Missing tools`);
    assert(content.includes('model:'), `${file}: Missing model`);
  }
});

test('new vertical agents (FinTech, Healthcare) exist', () => {
  const agentsDir = path.join(RESOURCES_DIR, 'agents');

  const fintechPath = path.join(agentsDir, 'fintech-expert.agent.md');
  assert(fs.existsSync(fintechPath), 'FinTech Expert agent not found');

  const healthcarePath = path.join(agentsDir, 'healthcare-expert.agent.md');
  assert(fs.existsSync(healthcarePath), 'Healthcare Expert agent not found');

  // Verify content quality
  const fintechContent = fs.readFileSync(fintechPath, 'utf8');
  assert(fintechContent.includes('PCI DSS'), 'FinTech agent missing PCI DSS content');
  assert(fintechContent.includes('payment'), 'FinTech agent missing payment content');

  const healthcareContent = fs.readFileSync(healthcarePath, 'utf8');
  assert(healthcareContent.includes('HIPAA'), 'Healthcare agent missing HIPAA content');
  assert(healthcareContent.includes('FHIR'), 'Healthcare agent missing FHIR content');
});

// ============================================================================
// Tool Registration Tests (Code Analysis)
// ============================================================================

test('all registered tools have error handling', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');

  const tools = [
    'codeAnalyzer',
    'testGenerator',
    'documentationBuilder',
    'performanceProfiler',
    'dependencyAnalyzer',
    'apiDesigner'
  ];

  for (const tool of tools) {
    // Check for try-catch block
    const toolRegex = new RegExp(`registerTool\\('${tool}'[\\s\\S]*?try\\s*{`, 'm');
    assert(
      toolRegex.test(content),
      `Tool '${tool}' missing try-catch error handling`
    );

    // Check for error telemetry logging
    const errorTelemetryRegex = new RegExp(
      `logToolUsage\\('${tool}',\\s*false`,
      'gm'
    );
    assert(
      errorTelemetryRegex.test(content),
      `Tool '${tool}' missing error telemetry logging`
    );
  }
});

test('all tools log telemetry on success', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');

  const tools = [
    'codeAnalyzer',
    'testGenerator',
    'documentationBuilder',
    'performanceProfiler',
    'dependencyAnalyzer',
    'apiDesigner'
  ];

  for (const tool of tools) {
    const successTelemetryRegex = new RegExp(
      `logToolUsage\\('${tool}',\\s*true`,
      'gm'
    );
    assert(
      successTelemetryRegex.test(content),
      `Tool '${tool}' missing success telemetry logging`
    );
  }
});

// ============================================================================
// Dependency Analyzer Tool Tests
// ============================================================================

test('dependencyAnalyzer checks for package.json', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(
    content.includes('package.json') && content.includes('dependencyAnalyzer'),
    'dependencyAnalyzer does not check for package.json'
  );
});

test('dependencyAnalyzer checks for requirements.txt', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(
    content.includes('requirements.txt') && content.includes('dependencyAnalyzer'),
    'dependencyAnalyzer does not check for requirements.txt'
  );
});

test('dependencyAnalyzer checks for go.mod', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(
    content.includes('go.mod') && content.includes('dependencyAnalyzer'),
    'dependencyAnalyzer does not check for go.mod'
  );
});

test('dependencyAnalyzer checks for Cargo.toml', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(
    content.includes('Cargo.toml') && content.includes('dependencyAnalyzer'),
    'dependencyAnalyzer does not check for Cargo.toml'
  );
});

// ============================================================================
// Version Detection Tests (getMajorVersion helper)
// ============================================================================

test('getMajorVersion extracts version from caret ranges', () => {
  assert.strictEqual(getMajorVersion('^4.0.0'), 4, 'Failed to extract version from ^4.0.0');
  assert.strictEqual(getMajorVersion('^16.8.0'), 16, 'Failed to extract version from ^16.8.0');
});

test('getMajorVersion extracts version from tilde ranges', () => {
  assert.strictEqual(getMajorVersion('~4.0.0'), 4, 'Failed to extract version from ~4.0.0');
  assert.strictEqual(getMajorVersion('~16.8.0'), 16, 'Failed to extract version from ~16.8.0');
});

test('getMajorVersion extracts version from comparison operators', () => {
  assert.strictEqual(getMajorVersion('>=4.0.0'), 4, 'Failed to extract version from >=4.0.0');
  assert.strictEqual(getMajorVersion('>16.0.0'), 16, 'Failed to extract version from >16.0.0');
  assert.strictEqual(getMajorVersion('<5.0.0'), 5, 'Failed to extract version from <5.0.0');
});

test('getMajorVersion extracts version from exact versions', () => {
  assert.strictEqual(getMajorVersion('4.46.0'), 4, 'Failed to extract version from 4.46.0');
  assert.strictEqual(getMajorVersion('16.8.0'), 16, 'Failed to extract version from 16.8.0');
});

test('getMajorVersion extracts version from wildcard versions', () => {
  assert.strictEqual(getMajorVersion('4.x'), 4, 'Failed to extract version from 4.x');
  assert.strictEqual(getMajorVersion('16.x'), 16, 'Failed to extract version from 16.x');
});

test('getMajorVersion returns null for invalid inputs', () => {
  assert.strictEqual(getMajorVersion(null), null, 'Should return null for null input');
  assert.strictEqual(getMajorVersion(undefined), null, 'Should return null for undefined input');
  assert.strictEqual(getMajorVersion(''), null, 'Should return null for empty string');
  assert.strictEqual(getMajorVersion('react-dom-16.8.0'), null, 'Should return null for package name with version');
});

// ============================================================================
// API Designer Tool Tests
// ============================================================================

test('apiDesigner provides OpenAPI guidance', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(
    content.includes('OpenAPI') && content.includes('apiDesigner'),
    'apiDesigner missing OpenAPI guidance'
  );
});

test('apiDesigner mentions REST best practices', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');
  assert(
    content.includes('REST') && content.includes('apiDesigner'),
    'apiDesigner missing REST best practices'
  );
});

// ============================================================================
// SDD Framework Tests
// ============================================================================

test('constitutional framework exists', () => {
  const constitutionPath = path.join(RESOURCES_DIR, 'constitution.md');
  assert(fs.existsSync(constitutionPath), 'constitution.md not found');

  const content = fs.readFileSync(constitutionPath, 'utf8');
  assert(content.includes('Article I'), 'Missing Article I');
  assert(content.includes('Article VIII'), 'Missing Article VIII');
});

test('constitutional framework has 8 articles', () => {
  const constitutionPath = path.join(RESOURCES_DIR, 'constitution.md');
  const content = fs.readFileSync(constitutionPath, 'utf8');

  const articleCount = (content.match(/## Article [IVX]+:/g) || []).length;
  assert(articleCount === 8, `Expected 8 articles, found ${articleCount}`);
});

test('SDD templates directory exists with all templates', () => {
  const templatesDir = path.join(RESOURCES_DIR, 'templates');
  assert(fs.existsSync(templatesDir), 'templates directory not found');

  const requiredTemplates = [
    'spec-template.md',
    'plan-template.md',
    'tasks-template.md',
    'checklist-template.md',
    'README.md'
  ];

  for (const template of requiredTemplates) {
    const templatePath = path.join(templatesDir, template);
    assert(fs.existsSync(templatePath), `Template '${template}' not found`);
  }
});

test('specs directory exists with specifications', () => {
  const specsDir = path.join(__dirname, '..', 'specs');
  assert(fs.existsSync(specsDir), 'specs directory not found');

  const specDirs = fs.readdirSync(specsDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  assert(specDirs.length >= 3, `Expected at least 3 spec directories, found ${specDirs.length}`);
});

test('all spec directories follow numbering convention', () => {
  const specsDir = path.join(__dirname, '..', 'specs');
  const specDirs = fs.readdirSync(specsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const dir of specDirs) {
    assert(
      /^\d{3}-/.test(dir),
      `Spec directory '${dir}' does not follow ###-name convention`
    );
  }
});

test('all spec directories contain spec.md file', () => {
  const specsDir = path.join(__dirname, '..', 'specs');
  const specDirs = fs.readdirSync(specsDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of specDirs) {
    const specPath = path.join(specsDir, dir.name, 'spec.md');
    assert(fs.existsSync(specPath), `spec.md not found in ${dir.name}`);
  }
});

test('specifications have required sections', () => {
  const specsDir = path.join(__dirname, '..', 'specs');
  const specDirs = fs.readdirSync(specsDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of specDirs) {
    const specPath = path.join(specsDir, dir.name, 'spec.md');
    const content = fs.readFileSync(specPath, 'utf8');

    // Check required sections
    assert(content.includes('## Overview'), `${dir.name}: Missing Overview section`);
    assert(content.includes('## Requirements'), `${dir.name}: Missing Requirements section`);
    assert(content.includes('## Success Criteria'), `${dir.name}: Missing Success Criteria section`);
  }
});

test('specifications have Feature ID in frontmatter', () => {
  const specsDir = path.join(__dirname, '..', 'specs');
  const specDirs = fs.readdirSync(specsDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of specDirs) {
    const specPath = path.join(specsDir, dir.name, 'spec.md');
    const content = fs.readFileSync(specPath, 'utf8');

    assert(
      content.includes('**Feature ID**:'),
      `${dir.name}: Missing Feature ID`
    );
  }
});

test('tool specifications exist (025-030)', () => {
  const specsDir = path.join(__dirname, '..', 'specs');

  const toolSpecs = ['025', '026', '027', '028', '029', '030'];

  for (const id of toolSpecs) {
    const specDirs = fs.readdirSync(specsDir).filter(d => d.startsWith(id));
    assert(specDirs.length > 0, `Tool spec ${id} not found`);
  }
});

test('skill specifications exist (031-035)', () => {
  const specsDir = path.join(__dirname, '..', 'specs');

  const skillSpecs = ['031', '032', '033', '034', '035'];

  for (const id of skillSpecs) {
    const specDirs = fs.readdirSync(specsDir).filter(d => d.startsWith(id));
    assert(specDirs.length > 0, `Skill spec ${id} not found`);
  }
});

test('SpecKit tools reference correct templates', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');

  // Check specKitSpecTemplate references spec-template.md
  assert(
    content.includes('spec-template.md'),
    'specKitSpecTemplate missing template reference'
  );

  // Check specKitPlanTemplate references plan-template.md
  assert(
    content.includes('plan-template.md'),
    'specKitPlanTemplate missing template reference'
  );
});

test('resourceDiscovery tool is registered', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');

  assert(
    content.includes("registerTool('resourceDiscovery'"),
    'resourceDiscovery tool not registered'
  );

  // Check it lists resource types
  assert(
    content.includes('agents') && content.includes('prompts') && content.includes('skills'),
    'resourceDiscovery missing resource types'
  );
});

test('agents have Related Resources sections', () => {
  const agentsDir = path.join(RESOURCES_DIR, 'agents');

  // Check key agents that should have Related Resources
  const keyAgents = [
    'python-expert.agent.md',
    'typescript-expert.agent.md',
    'testing-specialist.agent.md',
    'architecture-expert.agent.md'
  ];

  for (const agentFile of keyAgents) {
    const content = fs.readFileSync(path.join(agentsDir, agentFile), 'utf8');
    assert(
      content.includes('## Related Resources'),
      `${agentFile}: Missing Related Resources section`
    );
  }
});

test('copilot-instructions.md includes SDD guidance', () => {
  const instructionsPath = path.join(RESOURCES_DIR, 'copilot-instructions.md');
  const content = fs.readFileSync(instructionsPath, 'utf8');

  assert(
    content.includes('Specification-Driven Development') || content.includes('SDD'),
    'copilot-instructions.md missing SDD guidance'
  );
});

// ============================================================================
// Embedded Resources Tests
// ============================================================================

test('typescript-expert has embedded TypeScript standards', () => {
  const agentPath = path.join(RESOURCES_DIR, 'agents', 'typescript-expert.agent.md');
  const content = fs.readFileSync(agentPath, 'utf8');

  assert(
    content.includes('Enforced TypeScript Standards'),
    'typescript-expert missing embedded standards section'
  );
  assert(
    content.includes('Naming Convention Rules'),
    'typescript-expert missing naming convention rules'
  );
});

test('python-expert has embedded PEP 8 standards', () => {
  const agentPath = path.join(RESOURCES_DIR, 'agents', 'python-expert.agent.md');
  const content = fs.readFileSync(agentPath, 'utf8');

  assert(
    content.includes('Enforced Python Standards'),
    'python-expert missing embedded standards section'
  );
  assert(
    content.includes('PEP 8'),
    'python-expert missing PEP 8 reference'
  );
});

test('code-reviewer has embedded review checklist', () => {
  const agentPath = path.join(RESOURCES_DIR, 'agents', 'code-reviewer.agent.md');
  const content = fs.readFileSync(agentPath, 'utf8');

  assert(
    content.includes('Embedded Review Checklist'),
    'code-reviewer missing embedded checklist'
  );
  assert(
    content.includes('Security Checklist'),
    'code-reviewer missing security checklist'
  );
});

test('testing-specialist has embedded TDD methodology', () => {
  const agentPath = path.join(RESOURCES_DIR, 'agents', 'testing-specialist.agent.md');
  const content = fs.readFileSync(agentPath, 'utf8');

  assert(
    content.includes('Embedded Testing Methodology'),
    'testing-specialist missing embedded methodology'
  );
  assert(
    content.includes('Red-Green-Refactor'),
    'testing-specialist missing TDD cycle'
  );
});

test('devops-expert has embedded commit conventions', () => {
  const agentPath = path.join(RESOURCES_DIR, 'agents', 'devops-expert.agent.md');
  const content = fs.readFileSync(agentPath, 'utf8');

  assert(
    content.includes('Conventional Commits'),
    'devops-expert missing commit conventions'
  );
  assert(
    content.includes('feat') && content.includes('fix'),
    'devops-expert missing commit types'
  );
});

test('security-expert has embedded OWASP checklist', () => {
  const agentPath = path.join(RESOURCES_DIR, 'agents', 'security-expert.agent.md');
  const content = fs.readFileSync(agentPath, 'utf8');

  assert(
    content.includes('Embedded Security Checklist'),
    'security-expert missing embedded checklist'
  );
  assert(
    content.includes('OWASP Top 10'),
    'security-expert missing OWASP reference'
  );
});

test('AGENT_QUICKREF.md exists and has agent summaries', () => {
  const quickRefPath = path.join(RESOURCES_DIR, 'AGENT_QUICKREF.md');
  assert(fs.existsSync(quickRefPath), 'AGENT_QUICKREF.md not found');

  const content = fs.readFileSync(quickRefPath, 'utf8');
  assert(content.includes('@typescript-expert'), 'Quick ref missing typescript-expert');
  assert(content.includes('@python-expert'), 'Quick ref missing python-expert');
  assert(content.includes('Custom Tools'), 'Quick ref missing tools section');
});

test('extension.js has showAgentReference command', () => {
  const content = fs.readFileSync(EXTENSION_JS, 'utf8');

  assert(
    content.includes('agentPro.showAgentReference'),
    'showAgentReference command not registered'
  );
  assert(
    content.includes('getAgentQuickReference'),
    'getAgentQuickReference function missing'
  );
});

// ============================================================================
// Print Summary
// ============================================================================

log('\n' + '='.repeat(60), 'blue');
log(`Tests Run: ${testsRun}`, 'blue');
log(`Tests Passed: ${testsPassed}`, testsPassed === testsRun ? 'green' : 'yellow');
log(`Tests Failed: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
log('='.repeat(60), 'blue');

if (testsFailed > 0) {
  log('\n❌ Some tests failed', 'red');
  process.exit(1);
} else {
  log('\n✅ All tests passed!', 'green');
  process.exit(0);
}
