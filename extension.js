const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

async function activate(context) {
  console.log('Agent Pro: Activating...');

  try {
    const storagePath = context.globalStorageUri.fsPath;
    const versionKey = 'agentPro.installedVersion';
    const currentVersion = context.extension.packageJSON.version;

    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
    }

    const installedVersion = context.globalState.get(versionKey);
    if (installedVersion !== currentVersion) {
      const src = context.asAbsolutePath('resources');
      const dest = path.join(storagePath, 'resources');

      copyRecursive(src, dest);
      await context.globalState.update(versionKey, currentVersion);

      console.log(`Agent Pro: Resources installed to ${dest}`);
      vscode.window.showInformationMessage('Agent Pro: Activated! Type @ in Copilot Chat.');
    }

    console.log('Agent Pro: Ready');
  } catch (error) {
    console.error('Agent Pro: Activation failed:', error);
    vscode.window.showErrorMessage(`Agent Pro: ${error.message}`);
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source not found: ${src}`);
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
