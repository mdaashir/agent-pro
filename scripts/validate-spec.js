const fs = require('fs');
const path = require('path');

const REQUIRED_SECTIONS = [
  'Overview',
  'User Scenarios & Testing',
  'Requirements',
  'Success Criteria',
  'Dependencies',
  'Out of Scope',
  'Validation Checklist'
];

const REQUIRED_FRONTMATTER = [
  'Feature ID',
  'Status',
  'Created',
  'Owner'
];

function validateSpecification(specPath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(specPath)) {
    errors.push(`Specification file not found: ${specPath}`);
    return { valid: false, errors, warnings };
  }

  const content = fs.readFileSync(specPath, 'utf8');
  const lines = content.split('\n');

  validateFrontmatter(lines, errors, warnings);
  validateSections(content, errors, warnings);
  validateRequirements(content, errors, warnings);
  validateScenarios(content, errors, warnings);
  validateSuccessCriteria(content, errors, warnings);
  validateChecklist(content, errors, warnings);

  const valid = errors.length === 0;
  return { valid, errors, warnings };
}

function validateFrontmatter(lines, errors, warnings) {
  const frontmatterStart = lines.findIndex(line => line.trim().startsWith('**Feature ID**'));

  if (frontmatterStart === -1) {
    errors.push('Missing frontmatter section with Feature ID, Status, Created, Owner');
    return;
  }

  const frontmatterSection = lines.slice(frontmatterStart, frontmatterStart + 10).join('\n');

  REQUIRED_FRONTMATTER.forEach(field => {
    if (!frontmatterSection.includes(`**${field}**`)) {
      errors.push(`Missing required frontmatter field: ${field}`);
    }
  });

  if (frontmatterSection.includes('[Feature Name]') || frontmatterSection.includes('[###-')) {
    warnings.push('Frontmatter contains placeholder values - ensure they are filled in');
  }
}

function validateSections(content, errors, warnings) {
  REQUIRED_SECTIONS.forEach(section => {
    const regex = new RegExp(`^## ${section}`, 'm');
    if (!regex.test(content)) {
      errors.push(`Missing required section: ## ${section}`);
    }
  });
}

function validateRequirements(content, errors, warnings) {
  const frMatches = content.match(/\*\*FR-\d{3}\*\*/g);
  const nfrMatches = content.match(/\*\*NFR-\d{3}\*\*/g);

  if (!frMatches || frMatches.length === 0) {
    errors.push('No functional requirements found (expected **FR-001**, **FR-002**, etc.)');
  }

  if (!nfrMatches || nfrMatches.length === 0) {
    warnings.push('No non-functional requirements found (consider adding **NFR-001**, etc.)');
  }

  const needsClarification = content.match(/\[NEEDS CLARIFICATION\]/g);
  if (needsClarification) {
    warnings.push(`Found ${needsClarification.length} [NEEDS CLARIFICATION] marker(s) - resolve before approval`);
  }
}

function validateScenarios(content, errors, warnings) {
  const p1Scenarios = content.match(/### P1 Scenarios/);
  if (!p1Scenarios) {
    errors.push('Missing P1 Scenarios section - at least one critical scenario required');
  }

  const givenWhenThen = content.match(/```gherkin[\s\S]*?Given[\s\S]*?When[\s\S]*?Then[\s\S]*?```/g);
  if (!givenWhenThen || givenWhenThen.length === 0) {
    errors.push('No Given/When/Then acceptance criteria found - scenarios must be testable');
  }
}

function validateSuccessCriteria(content, errors, warnings) {
  const successSection = content.match(/## Success Criteria([\s\S]*?)## /);
  if (!successSection) {
    return;
  }

  const criteriaText = successSection[1];
  const hasMetrics = criteriaText.match(/\*\*Metric \d+\*\*/g);

  if (!hasMetrics || hasMetrics.length === 0) {
    errors.push('Success criteria must include measurable metrics (**Metric 1**, **Metric 2**, etc.)');
  }

  const vagueCriteria = criteriaText.match(/\b(better|improved|faster|good|efficient)\b/gi);
  if (vagueCriteria) {
    warnings.push('Success criteria contains vague terms - use specific, measurable values');
  }
}

function validateChecklist(content, errors, warnings) {
  const checklistSection = content.match(/## Validation Checklist([\s\S]*?)## /);
  if (!checklistSection) {
    return;
  }

  const checklist = checklistSection[1];
  const uncheckedItems = checklist.match(/- \[ \]/g);
  const checkedItems = checklist.match(/- \[x\]/g);

  if (uncheckedItems && uncheckedItems.length > 0) {
    warnings.push(`Validation checklist has ${uncheckedItems.length} unchecked item(s)`);
  }

  if (!checkedItems || checkedItems.length === 0) {
    warnings.push('Validation checklist is completely unchecked');
  }
}

function validateAllSpecs(specsDir) {
  if (!fs.existsSync(specsDir)) {
    console.error(`Specs directory not found: ${specsDir}`);
    process.exit(1);
  }

  const specDirs = fs.readdirSync(specsDir).filter(name => {
    const fullPath = path.join(specsDir, name);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`Validating ${specDirs.length} specification(s)...\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  const results = [];

  specDirs.forEach(dirName => {
    const specPath = path.join(specsDir, dirName, 'spec.md');
    const result = validateSpecification(specPath);

    results.push({
      name: dirName,
      ...result
    });

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  });

  results.forEach(result => {
    const status = result.valid ? '✓' : '✗';
    console.log(`${status} ${result.name}`);

    if (result.errors.length > 0) {
      console.log('  Errors:');
      result.errors.forEach(err => console.log(`    - ${err}`));
    }

    if (result.warnings.length > 0) {
      console.log('  Warnings:');
      result.warnings.forEach(warn => console.log(`    - ${warn}`));
    }

    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log('  No issues found');
    }

    console.log('');
  });

  console.log('='.repeat(60));
  console.log(`Total: ${results.length} specifications`);
  console.log(`Valid: ${results.filter(r => r.valid).length}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Warnings: ${totalWarnings}`);
  console.log('='.repeat(60));

  if (totalErrors > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  const specsDir = path.join(__dirname, '..', 'specs');
  validateAllSpecs(specsDir);
}

module.exports = { validateSpecification, validateAllSpecs };
