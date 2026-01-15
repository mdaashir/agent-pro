const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Telemetry reporter for usage analytics
 * Tracks tool usage and agent interactions while respecting user privacy
 */
class TelemetryReporter {
  constructor(context) {
    this.context = context;
    this.enabled = vscode.workspace.getConfiguration('agentPro').get('telemetry.enabled', true);
  }

  async logToolUsage(toolName, success = true, metadata = {}) {
    if (!this.enabled) return;

    try {
      const stats = this.context.globalState.get('agentPro.toolStats', {});
      const key = toolName;

      if (!stats[key]) {
        stats[key] = { total: 0, success: 0, failures: 0, firstUsed: Date.now(), lastUsed: Date.now() };
      }

      stats[key].total++;
      stats[key].lastUsed = Date.now();

      if (success) {
        stats[key].success++;
      } else {
        stats[key].failures++;
      }

      await this.context.globalState.update('agentPro.toolStats', stats);
    } catch (error) {
      console.error('Telemetry logging error:', error.message);
    }
  }

  async getStats() {
    const stats = this.context.globalState.get('agentPro.toolStats', {});
    return stats;
  }

  async resetStats() {
    await this.context.globalState.update('agentPro.toolStats', {});
  }
}

/**
 * Register custom tools for Copilot Chat agents
 * These tools extend the built-in capabilities with specialized functionality
 */
function registerCustomTools(context, telemetry) {

  const codeAnalyzer = vscode.lm.registerTool('codeAnalyzer', {
    displayName: 'Code Analyzer',
    description: 'Analyzes code complexity, patterns, and potential improvements',

    async invoke(options, token) {
      const startTime = Date.now();

      try {
        const { input } = options;
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
          await telemetry.logToolUsage('codeAnalyzer', false, { reason: 'no_editor' });
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart('No active editor found')
          ]);
        }

        const document = editor.document;
        const text = document.getText();
        const languageId = document.languageId;

        const lines = text.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim().length > 0);
        const commentLines = lines.filter(line => {
          const trimmed = line.trim();
          return trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*');
        });

        const analysis = {
          language: languageId,
          totalLines: lines.length,
          codeLines: nonEmptyLines.length,
          commentLines: commentLines.length,
          averageLineLength: Math.round(text.length / lines.length),
          fileName: path.basename(document.fileName)
        };

        const commentRatio = analysis.codeLines > 0 
          ? ((analysis.commentLines / analysis.codeLines) * 100).toFixed(1) + '%'
          : 'N/A';

        const result = `Code Analysis for ${analysis.fileName}:
- Language: ${analysis.language}
- Total Lines: ${analysis.totalLines}
- Code Lines: ${analysis.codeLines}
- Comment Lines: ${analysis.commentLines}
- Average Line Length: ${analysis.averageLineLength} characters
- Comment Ratio: ${commentRatio}`;

        await telemetry.logToolUsage('codeAnalyzer', true, {
          language: languageId,
          lines: analysis.totalLines,
          duration: Date.now() - startTime
        });

        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(result)
        ]);
      } catch (error) {
        await telemetry.logToolUsage('codeAnalyzer', false, { error: error.message });
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error analyzing code: ${error.message}`)
        ]);
      }
    }
  });

  const testGenerator = vscode.lm.registerTool('testGenerator', {
    displayName: 'Test Generator',
    description: 'Generates test case suggestions for selected code',

    async invoke(options, token) {
      const startTime = Date.now();

      try {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
          await telemetry.logToolUsage('testGenerator', false, { reason: 'no_editor' });
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart('No active editor found')
          ]);
        }

        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection);
        const languageId = document.languageId;

        const testFrameworks = {
          javascript: 'Jest',
          typescript: 'Jest',
          python: 'pytest',
          java: 'JUnit',
          go: 'testing',
          rust: 'built-in testing'
        };

        const framework = testFrameworks[languageId] || 'appropriate testing framework';

        const suggestion = `Test Strategy for ${languageId} code:
- Recommended framework: ${framework}
- Code length: ${selectedText.length} characters
- Suggested test types:
  • Unit tests for individual functions
  • Integration tests for component interaction
  • Edge case tests (null, empty, boundary values)
  • Error handling tests

Selection contains ${selectedText.split('\n').length} lines of code ready for test generation.`;

        await telemetry.logToolUsage('testGenerator', true, {
          language: languageId,
          selectionLength: selectedText.length,
          duration: Date.now() - startTime
        });

        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(suggestion)
        ]);
      } catch (error) {
        await telemetry.logToolUsage('testGenerator', false, { error: error.message });
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error generating test suggestions: ${error.message}`)
        ]);
      }
    }
  });

  const documentationBuilder = vscode.lm.registerTool('documentationBuilder', {
    displayName: 'Documentation Builder',
    description: 'Generates documentation templates and suggestions',

    async invoke(options, token) {
      const startTime = Date.now();

      try {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
          await telemetry.logToolUsage('documentationBuilder', false, { reason: 'no_editor' });
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart('No active editor found')
          ]);
        }

        const document = editor.document;
        const languageId = document.languageId;

        const docFormats = {
          javascript: 'JSDoc',
          typescript: 'TSDoc',
          python: 'docstring (Google/NumPy style)',
          java: 'JavaDoc',
          go: 'GoDoc',
          rust: 'RustDoc'
        };

        const format = docFormats[languageId] || 'inline comments';

        const template = `Documentation Guide for ${languageId}:
- Recommended format: ${format}
- File: ${path.basename(document.fileName)}

Documentation should include:
- Function/method purpose and behavior
- Parameter descriptions and types
- Return value description
- Usage examples
- Exceptions/errors thrown
- Related functions/methods`;

        await telemetry.logToolUsage('documentationBuilder', true, {
          language: languageId,
          duration: Date.now() - startTime
        });

        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(template)
        ]);
      } catch (error) {
        await telemetry.logToolUsage('documentationBuilder', false, { error: error.message });
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error building documentation: ${error.message}`)
        ]);
      }
    }
  });

  const performanceProfiler = vscode.lm.registerTool('performanceProfiler', {
    displayName: 'Performance Profiler',
    description: 'Provides performance insights and optimization suggestions',

    async invoke(options, token) {
      const startTime = Date.now();

      try {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
          await telemetry.logToolUsage('performanceProfiler', false, { reason: 'no_editor' });
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart('No active editor found')
          ]);
        }

        const document = editor.document;
        const text = document.getText();
        const languageId = document.languageId;

        const checks = [];

        if (text.includes('for (') && text.includes('.push(')) {
          checks.push('Detected array push in loop - consider pre-allocation');
        }

        if (text.match(/\.map\(.*\)\.filter\(.*\)/)) {
          checks.push('Chained map+filter detected - consider single reduce for performance');
        }

        if (languageId === 'javascript' || languageId === 'typescript') {
          if (text.includes('JSON.parse(JSON.stringify(')) {
            checks.push('Deep clone via JSON detected - consider structured clone or library');
          }
        }

        if (languageId === 'python' && text.includes('pandas')) {
          checks.push('Pandas detected - ensure vectorized operations over loops');
        }

        const result = `Performance Analysis:
File: ${path.basename(document.fileName)}
Language: ${languageId}

${checks.length > 0 ? checks.join('\n') : 'No obvious performance issues detected'}

General Recommendations:
- Profile with appropriate tools before optimizing
- Focus on algorithmic improvements first
- Consider caching for expensive operations
- Minimize I/O operations in hot paths`;

        await telemetry.logToolUsage('performanceProfiler', true, {
          language: languageId,
          issuesFound: checks.length,
          duration: Date.now() - startTime
        });

        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(result)
        ]);
      } catch (error) {
        await telemetry.logToolUsage('performanceProfiler', false, { error: error.message });
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error profiling performance: ${error.message}`)
        ]);
      }
    }
  });

  const dependencyAnalyzer = vscode.lm.registerTool('dependencyAnalyzer', {
    displayName: 'Dependency Analyzer',
    description: 'Analyzes project dependencies for outdated packages, security issues, and optimization opportunities',

    async invoke(options, token) {
      const startTime = Date.now();

      try {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {
          await telemetry.logToolUsage('dependencyAnalyzer', false, { reason: 'no_workspace' });
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart('No workspace folder found')
          ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const findings = [];

        // Check for package.json (Node.js/JavaScript)
        const packageJsonPath = path.join(rootPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          let packageJson;
          try {
            const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
            packageJson = JSON.parse(packageJsonContent);
          } catch (e) {
            await telemetry.logToolUsage('dependencyAnalyzer', false, { reason: 'invalid_package_json', error: e.message });
            return new vscode.LanguageModelToolResult([
              new vscode.LanguageModelTextPart(
                `The package.json file at "${packageJsonPath}" contains invalid JSON and could not be parsed. ` +
                'Please fix the JSON syntax and run the dependency analyzer again.'
              )
            ]);
          }
          const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
          const depCount = Object.keys(deps).length;

          findings.push('Node.js Project');
          findings.push(`- Total dependencies: ${depCount}`);
          findings.push(`- Production: ${Object.keys(packageJson.dependencies || {}).length}`);
          findings.push(`- Development: ${Object.keys(packageJson.devDependencies || {}).length}`);

          if (deps['webpack'] && deps['webpack'].startsWith('^4')) {
            findings.push('Webpack 4 detected - consider upgrading to Webpack 5');
          }
          if (deps['react'] && deps['react'].startsWith('^16')) {
            findings.push('React 16 detected - React 18 available with new features');
          }
        }

        const requirementsTxtPath = path.join(rootPath, 'requirements.txt');
        if (fs.existsSync(requirementsTxtPath)) {
          const content = fs.readFileSync(requirementsTxtPath, 'utf8');
          const deps = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));

          findings.push('Python Project');
          findings.push(`- Dependencies in requirements.txt: ${deps.length}`);
          findings.push('- Recommendation: Use pip-audit for security scanning');
        }

        const goModPath = path.join(rootPath, 'go.mod');
        if (fs.existsSync(goModPath)) {
          const content = fs.readFileSync(goModPath, 'utf8');

          findings.push('Go Project');
          findings.push('- Go modules detected');
          findings.push('- Run \'go list -m -u all\' to check for updates');
        }

        const cargoTomlPath = path.join(rootPath, 'Cargo.toml');
        if (fs.existsSync(cargoTomlPath)) {
          findings.push('Rust Project');
          findings.push('- Cargo.toml detected');
          findings.push('- Run \'cargo outdated\' to check for updates');
          findings.push('- Run \'cargo audit\' for security vulnerabilities');
        }

        if (findings.length === 0) {
          findings.push('No dependency manifests found in workspace root');
          findings.push('Supported: package.json, requirements.txt, go.mod, Cargo.toml');
        } else {
          findings.push('');
          findings.push('Security Recommendations:');
          findings.push('- Regularly update dependencies');
          findings.push('- Use automated dependency scanning (Dependabot, Renovate)');
          findings.push('- Monitor for security advisories');
          findings.push('- Consider using lock files for reproducible builds');
        }

        await telemetry.logToolUsage('dependencyAnalyzer', true, {
          projectTypes: findings.filter(f => f.includes('Project')).length,
          duration: Date.now() - startTime
        });

        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(findings.join('\n'))
        ]);
      } catch (error) {
        await telemetry.logToolUsage('dependencyAnalyzer', false, { error: error.message });
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error analyzing dependencies: ${error.message}`)
        ]);
      }
    }
  });

  const apiDesigner = vscode.lm.registerTool('apiDesigner', {
    displayName: 'API Designer',
    description: 'Generates OpenAPI specifications and REST API design suggestions',

    async invoke(options, token) {
      const startTime = Date.now();

      try {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
          await telemetry.logToolUsage('apiDesigner', false, { reason: 'no_editor' });
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart('No active editor found')
          ]);
        }

        const document = editor.document;
        const languageId = document.languageId;

        const apiGuidelines = `API Design Guidelines:

REST API Best Practices:
- Use nouns for resources (GET /users, not GET /getUsers)
- HTTP verbs map to CRUD: POST (Create), GET (Read), PUT/PATCH (Update), DELETE
- Use plural nouns: /users/{id}, not /user/{id}
- Version your API: /v1/users, /v2/users
- Use HTTP status codes correctly:
  • 200 OK, 201 Created, 204 No Content
  • 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
  • 500 Internal Server Error

OpenAPI 3.1 Structure:
\`\`\`yaml
openapi: 3.1.0
info:
  title: Your API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
\`\`\`

Framework-Specific Tools:
- Node.js: swagger-jsdoc, tsoa (TypeScript)
- Python: FastAPI (auto-generates OpenAPI), Flask-RESTX
- Java: SpringDoc OpenAPI, Swagger Core
- Go: swaggo/swag
- .NET: Swashbuckle, NSwag

API Design Patterns:
- Pagination: offset/limit or cursor-based
- Filtering: ?status=active&role=admin
- Sorting: ?sort=createdAt:desc
- Field selection: ?fields=id,name,email
- Rate limiting: Use 429 Too Many Requests
- HATEOAS: Include hypermedia links in responses

Security:
- Always use HTTPS in production
- Implement authentication (OAuth 2.0, JWT)
- Validate and sanitize all inputs
- Use API keys for service-to-service
- Implement rate limiting
- Document security schemes in OpenAPI

Current File: ${path.basename(document.fileName)} (${languageId})`;

        await telemetry.logToolUsage('apiDesigner', true, {
          language: languageId,
          duration: Date.now() - startTime
        });

        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(apiGuidelines)
        ]);
      } catch (error) {
        await telemetry.logToolUsage('apiDesigner', false, { error: error.message });
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error generating API design: ${error.message}`)
        ]);
      }
    }
  });

  context.subscriptions.push(
    codeAnalyzer,
    testGenerator,
    documentationBuilder,
    performanceProfiler,
    dependencyAnalyzer,
    apiDesigner
  );

  console.log('Agent Pro: Registered 6 custom tools');
}

async function activate(context) {
  console.log('Agent Pro: Activating...');

  try {
    const telemetry = new TelemetryReporter(context);
    registerCustomTools(context, telemetry);

    const showStatsCommand = vscode.commands.registerCommand('agentPro.showStats', async () => {
      const stats = await telemetry.getStats();
      const statsArray = Object.entries(stats).map(([tool, data]) => ({
        tool,
        ...data
      }));

      if (statsArray.length === 0) {
        vscode.window.showInformationMessage('No tool usage statistics yet. Start using Agent Pro tools!');
        return;
      }

      statsArray.sort((a, b) => b.total - a.total);

      const output = statsArray.map(s => {
        const successRate = ((s.success / s.total) * 100).toFixed(1);
        const daysSinceFirst = Math.floor((Date.now() - s.firstUsed) / (1000 * 60 * 60 * 24));
        return `${s.tool}: ${s.total} uses (${successRate}% success, ${daysSinceFirst}d old)`;
      }).join('\n');

      const totalUses = statsArray.reduce((sum, s) => sum + s.total, 0);
      const message = `Agent Pro Usage Statistics\n\nTotal tool invocations: ${totalUses}\n\n${output}`;

      vscode.window.showInformationMessage(message, { modal: true });
    });

    const resetStatsCommand = vscode.commands.registerCommand('agentPro.resetStats', async () => {
      const confirm = await vscode.window.showWarningMessage(
        'Reset all usage statistics?',
        { modal: true },
        'Reset'
      );

      if (confirm === 'Reset') {
        await telemetry.resetStats();
        vscode.window.showInformationMessage('Usage statistics reset successfully');
      }
    });

    context.subscriptions.push(showStatsCommand, resetStatsCommand);

    const storagePath = context.globalStorageUri.fsPath;
    const versionKey = 'agentPro.installedVersion';
    const currentVersion = context.extension.packageJSON.version;
    const src = context.asAbsolutePath('resources');

    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
      console.log(`Created storage directory: ${storagePath}`);
    }

    const resourcesPath = path.join(storagePath, 'resources');
    const installedVersion = context.globalState.get(versionKey);
    const resourcesExist = fs.existsSync(resourcesPath);

    if (installedVersion !== currentVersion || !resourcesExist) {
      console.log(`Installing resources (version: ${installedVersion} -> ${currentVersion})`);

      if (fs.existsSync(resourcesPath)) {
        fs.rmSync(resourcesPath, { recursive: true, force: true });
        console.log('Cleared old resources');
      }

      if (!fs.existsSync(src)) {
        throw new Error(`Extension resources not found at: ${src}`);
      }

      copyRecursive(src, resourcesPath);
      await context.globalState.update(versionKey, currentVersion);

      console.log(`Resources installed to ${resourcesPath}`);
      vscode.window.showInformationMessage(
        'Agent Pro: Activated! Your 24 expert agents + 6 custom tools are ready. Open Copilot Chat and type @ to see them.'
      );
    } else {
      console.log(`Resources already installed (version ${currentVersion})`);
    }

    console.log('Agent Pro: Ready');
  } catch (error) {
    console.error('Agent Pro: Activation failed:', error.message);
    vscode.window.showErrorMessage(`Agent Pro: ${error.message}`);
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }

  try {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    console.log(`Copying ${items.length} items from ${src}`);

    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy resources: ${error.message}`);
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
