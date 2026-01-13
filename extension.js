const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

async function activate(context) {
  console.log('Agent Pro: Activating...');

  try {
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
        'Agent Pro: Activated! Your 22 expert agents are ready. Open Copilot Chat and type @ to see them.'
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
