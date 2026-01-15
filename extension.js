const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Register custom tools for Copilot Chat agents
 * These tools extend the built-in capabilities with specialized functionality
 */
function registerCustomTools(context) {
  // Tool 1: Code Analyzer - Analyze code complexity and patterns
  const codeAnalyzer = vscode.lm.registerTool('codeAnalyzer', {
    displayName: 'Code Analyzer',
    description: 'Analyzes code complexity, patterns, and potential improvements',
    
    async invoke(options, token) {
      try {
        const { input } = options;
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart('No active editor found')
          ]);
        }

        const document = editor.document;
        const text = document.getText();
        const languageId = document.languageId;
        
        // Analyze code metrics
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
        
        const result = `Code Analysis for ${analysis.fileName}:
- Language: ${analysis.language}
- Total Lines: ${analysis.totalLines}
- Code Lines: ${analysis.codeLines}
- Comment Lines: ${analysis.commentLines}
- Average Line Length: ${analysis.averageLineLength} characters
- Comment Ratio: ${((analysis.commentLines / analysis.codeLines) * 100).toFixed(1)}%`;
        
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(result)
        ]);
      } catch (error) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error analyzing code: ${error.message}`)
        ]);
      }
    }
  });

  // Tool 2: Test Generator Helper - Suggest test cases based on code
  const testGenerator = vscode.lm.registerTool('testGenerator', {
    displayName: 'Test Generator',
    description: 'Generates test case suggestions for selected code',
    
    async invoke(options, token) {
      try {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
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
        
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(suggestion)
        ]);
      } catch (error) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error generating test suggestions: ${error.message}`)
        ]);
      }
    }
  });

  // Tool 3: Documentation Builder - Generate documentation templates
  const documentationBuilder = vscode.lm.registerTool('documentationBuilder', {
    displayName: 'Documentation Builder',
    description: 'Generates documentation templates and suggestions',
    
    async invoke(options, token) {
      try {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
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
        
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(template)
        ]);
      } catch (error) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error building documentation: ${error.message}`)
        ]);
      }
    }
  });

  // Tool 4: Performance Profiler - Basic performance insights
  const performanceProfiler = vscode.lm.registerTool('performanceProfiler', {
    displayName: 'Performance Profiler',
    description: 'Provides performance insights and optimization suggestions',
    
    async invoke(options, token) {
      try {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart('No active editor found')
          ]);
        }

        const document = editor.document;
        const text = document.getText();
        const languageId = document.languageId;
        
        // Basic performance checks
        const checks = [];
        
        // Check for common performance anti-patterns
        if (text.includes('for (') && text.includes('.push(')) {
          checks.push('⚠️ Detected array push in loop - consider pre-allocation');
        }
        
        if (text.match(/\.map\(.*\)\.filter\(.*\)/)) {
          checks.push('⚠️ Chained map+filter detected - consider single reduce for performance');
        }
        
        if (languageId === 'javascript' || languageId === 'typescript') {
          if (text.includes('JSON.parse(JSON.stringify(')) {
            checks.push('⚠️ Deep clone via JSON detected - consider structured clone or library');
          }
        }
        
        if (languageId === 'python' && text.includes('pandas')) {
          checks.push('ℹ️ Pandas detected - ensure vectorized operations over loops');
        }
        
        const result = `Performance Analysis:
File: ${path.basename(document.fileName)}
Language: ${languageId}

${checks.length > 0 ? checks.join('\n') : '✓ No obvious performance issues detected'}

General Recommendations:
- Profile with appropriate tools before optimizing
- Focus on algorithmic improvements first
- Consider caching for expensive operations
- Minimize I/O operations in hot paths`;
        
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(result)
        ]);
      } catch (error) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Error profiling performance: ${error.message}`)
        ]);
      }
    }
  });

  // Register all tools for cleanup
  context.subscriptions.push(
    codeAnalyzer,
    testGenerator,
    documentationBuilder,
    performanceProfiler
  );

  console.log('Agent Pro: Registered 4 custom tools');
}

async function activate(context) {
  console.log('Agent Pro: Activating...');

  try {
    // Register custom tools first
    registerCustomTools(context);

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
        'Agent Pro: Activated! Your 22 expert agents + 4 custom tools are ready. Open Copilot Chat and type @ to see them.'
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
