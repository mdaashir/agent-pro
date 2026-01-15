const fs = require('fs');
const path = require('path');

const CONSTITUTIONAL_ARTICLES = [
  'Specification-First Development',
  'Agent Isolation Principle',
  'Custom Tool Integration Mandate',
  'Test-First Imperative',
  'Copilot-Native Integration',
  'Privacy-First Telemetry',
  'Simplicity and Clarity',
  'Versioned Evolution'
];

function checkConstitutionalCompliance(planPath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(planPath)) {
    errors.push(`Implementation plan not found: ${planPath}`);
    return { compliant: false, errors, warnings };
  }

  const content = fs.readFileSync(planPath, 'utf8');

  const constitutionalSection = content.match(/## Constitutional Check([\s\S]*?)## /);

  if (!constitutionalSection) {
    errors.push('Missing ## Constitutional Check section in plan.md');
    return { compliant: false, errors, warnings };
  }

  const checkSection = constitutionalSection[1];

  CONSTITUTIONAL_ARTICLES.forEach((article, index) => {
    const articleNum = index + 1;
    const articlePattern = new RegExp(`Article ${romanNumeral(articleNum)}.*${article}`, 'i');

    if (!articlePattern.test(checkSection)) {
      errors.push(`Missing constitutional check for Article ${romanNumeral(articleNum)}: ${article}`);
    }
  });

  const uncheckedArticles = checkSection.match(/- \[ \] \*\*Article/g);
  if (uncheckedArticles && uncheckedArticles.length > 0) {
    warnings.push(`${uncheckedArticles.length} constitutional article(s) not checked`);
  }

  const violationsSection = content.match(/\*\*Constitutional Violations\*\*: (.*)/);
  if (violationsSection) {
    const violations = violationsSection[1].trim();
    if (violations !== 'None' && violations.length > 0) {
      warnings.push(`Constitutional violations noted: ${violations}`);
    }
  }

  const compliant = errors.length === 0;
  return { compliant, errors, warnings };
}

function romanNumeral(num) {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return romanNumerals[num - 1] || num.toString();
}

function validateConstitution(constitutionPath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(constitutionPath)) {
    errors.push(`Constitution file not found: ${constitutionPath}`);
    return { valid: false, errors, warnings };
  }

  const content = fs.readFileSync(constitutionPath, 'utf8');

  if (!content.includes('**Version**')) {
    errors.push('Constitution missing version number');
  }

  if (!content.includes('**Ratified Date**')) {
    errors.push('Constitution missing ratified date');
  }

  if (!content.includes('**Last Amended Date**')) {
    errors.push('Constitution missing last amended date');
  }

  CONSTITUTIONAL_ARTICLES.forEach((article, index) => {
    const articleNum = index + 1;
    const articlePattern = new RegExp(`### Article ${romanNumeral(articleNum)}: ${article}`, 'i');

    if (!articlePattern.test(content)) {
      errors.push(`Missing Article ${romanNumeral(articleNum)}: ${article}`);
    }
  });

  const amendmentProcess = content.match(/## Amendment Process/);
  if (!amendmentProcess) {
    warnings.push('Missing Amendment Process section');
  }

  const governance = content.match(/## Governance/);
  if (!governance) {
    warnings.push('Missing Governance section');
  }

  const valid = errors.length === 0;
  return { valid, errors, warnings };
}

function checkAllPlans(specsDir) {
  if (!fs.existsSync(specsDir)) {
    console.error(`Specs directory not found: ${specsDir}`);
    process.exit(1);
  }

  const specDirs = fs.readdirSync(specsDir).filter(name => {
    const fullPath = path.join(specsDir, name);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`Checking constitutional compliance for ${specDirs.length} plan(s)...\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  const results = [];

  specDirs.forEach(dirName => {
    const planPath = path.join(specsDir, dirName, 'plan.md');

    if (fs.existsSync(planPath)) {
      const result = checkConstitutionalCompliance(planPath);
      results.push({
        name: dirName,
        ...result
      });
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
    }
  });

  results.forEach(result => {
    const status = result.compliant ? '✓' : '✗';
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
      console.log('  Constitutional compliance verified');
    }

    console.log('');
  });

  console.log('='.repeat(60));
  console.log(`Total: ${results.length} implementation plans`);
  console.log(`Compliant: ${results.filter(r => r.compliant).length}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Warnings: ${totalWarnings}`);
  console.log('='.repeat(60));

  if (totalErrors > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  const command = process.argv[2];

  if (command === 'constitution') {
    const constitutionPath = path.join(__dirname, '..', 'resources', 'constitution.md');
    const result = validateConstitution(constitutionPath);

    console.log('Validating Constitutional Framework...\n');

    if (result.errors.length > 0) {
      console.log('Errors:');
      result.errors.forEach(err => console.log(`  - ${err}`));
    }

    if (result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.forEach(warn => console.log(`  - ${warn}`));
    }

    if (result.valid) {
      console.log('✓ Constitution is valid');
    } else {
      console.log('✗ Constitution has errors');
      process.exit(1);
    }
  } else {
    const specsDir = path.join(__dirname, '..', 'specs');
    checkAllPlans(specsDir);
  }
}

module.exports = { checkConstitutionalCompliance, validateConstitution, checkAllPlans };
