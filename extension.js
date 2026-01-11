const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');

function activate(context) {
  console.log('Agent Pro extension is now active');

  const extensionPath = context.extensionPath;
  const sourceGithubPath = path.join(extensionPath, '.github');

  // Install to user's home directory where GitHub Copilot discovers agents
  const homeDir = os.homedir();
  const globalGithubPath = path.join(homeDir, '.github');

  // Install agents globally on first activation
  const isGloballyInstalled = context.globalState.get('agentPro.globallyInstalled');

  if (!isGloballyInstalled) {
    try {
      // Copy agents to home directory
      copyRecursiveSync(sourceGithubPath, globalGithubPath);
      context.globalState.update('agentPro.globallyInstalled', true);

      vscode.window.showInformationMessage(
        'Agent Pro: 22 expert agents installed! Type @ in Copilot Chat to use them.'
      );

      console.log('Agent Pro: Installed agents to', globalGithubPath);
    } catch (error) {
      console.error('Agent Pro: Failed to install:', error);
      vscode.window.showErrorMessage(`Agent Pro: Installation failed: ${error.message}`);
    }
  }

  // No workspace folder manipulation - agents work from home directory

  // Register commands
  let updateCommand = vscode.commands.registerCommand('agent-pro.update', function () {
    try {
      // Update global agents in home directory
      copyRecursiveSync(sourceGithubPath, globalGithubPath);
      vscode.window.showInformationMessage(
        'Agent Pro: Successfully updated agents! Reload to apply.',
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
      if (fs.existsSync(globalGithubPath)) {
        fs.rmSync(globalGithubPath, { recursive: true, force: true });
      }
      context.globalState.update('agentPro.globallyInstalled', undefined);

      vscode.window.showInformationMessage(
        'Agent Pro: Reset complete. Reload to reinstall.',
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
    // Open home .github location
    vscode.env.openExternal(vscode.Uri.file(globalGithubPath));
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
