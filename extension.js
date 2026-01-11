const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  console.log('Agent Pro extension is now active');

  const extensionPath = context.extensionPath;
  const sourceGithubPath = path.join(extensionPath, '.github');

  // Use VS Code's global storage path for agents
  const globalStoragePath = context.globalStorageUri.fsPath;
  const globalAgentsPath = path.join(globalStoragePath, '.github');

  // Install agents to global storage on first activation
  const isGloballyInstalled = context.globalState.get('agentPro.globallyInstalled');

  if (!isGloballyInstalled) {
    try {
      // Ensure global storage directory exists
      if (!fs.existsSync(globalStoragePath)) {
        fs.mkdirSync(globalStoragePath, { recursive: true });
      }

      // Copy agents to global storage
      copyRecursiveSync(sourceGithubPath, globalAgentsPath);
      context.globalState.update('agentPro.globallyInstalled', true);

      vscode.window.showInformationMessage(
        'Agent Pro: 22 expert agents installed globally! Type @ in Copilot Chat to use them.'
      );

      console.log('Agent Pro: Installed agents globally to', globalAgentsPath);
    } catch (error) {
      console.error('Agent Pro: Failed to install globally:', error);
      vscode.window.showErrorMessage(`Agent Pro: Installation failed: ${error.message}`);
    }
  }

  // No workspace folder manipulation - agents work from global storage only

  // Register commands
  let updateCommand = vscode.commands.registerCommand('agent-pro.update', function () {
    try {
      // Update global agents
      copyRecursiveSync(sourceGithubPath, globalAgentsPath);
      vscode.window.showInformationMessage(
        'Agent Pro: Successfully updated global agents! Reload to apply.',
        'Reload Window'
      ).then(action => {
        if (action === 'Reload Window') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Agent Pro: Update failed: ${error.message}`);
    }
  });

  let resetCommand = vscode.commands.registerCommand('agent-pro.reset', function () {
    try {
      // Remove global agents
      if (fs.existsSync(globalAgentsPath)) {
        fs.rmSync(globalAgentsPath, { recursive: true, force: true });
      }
      context.globalState.update('agentPro.globallyInstalled', undefined);

      vscode.window.showInformationMessage(
        'Agent Pro: Reset complete. Reload to reinstall globally.',
        'Reload Window'
      ).then(action => {
        if (action === 'Reload Window') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Agent Pro: Reset failed: ${error.message}`);
    }
  });

  let openStorageCommand = vscode.commands.registerCommand('agent-pro.openStorage', function () {
    // Open global storage location
    vscode.env.openExternal(vscode.Uri.file(globalAgentsPath));
  });

  context.subscriptions.push(updateCommand, resetCommand, openStorageCommand);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
