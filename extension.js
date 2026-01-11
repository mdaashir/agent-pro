const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  console.log('Agent Pro extension is now active');

  // Check if user has opted in or out
  const autoInstall = context.globalState.get('agentPro.autoInstall');
  const hasAskedBefore = context.globalState.get('agentPro.hasAsked');

  // Copy .github folder to workspace on activation
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspacePath = workspaceFolders[0].uri.fsPath;
    const extensionPath = context.extensionPath;
    const sourceGithubPath = path.join(extensionPath, '.github');
    const targetGithubPath = path.join(workspacePath, '.github');

    // Check if .github folder already exists in workspace
    if (!fs.existsSync(targetGithubPath)) {
      // Auto-install if user previously selected "Always"
      if (autoInstall === true) {
        try {
          copyRecursiveSync(sourceGithubPath, targetGithubPath);
          console.log('Agent Pro: Auto-installed agents to workspace');
        } catch (error) {
          console.error('Agent Pro auto-install failed:', error);
        }
      } else if (!hasAskedBefore) {
        // Only ask once if we haven't asked before
        vscode.window.showInformationMessage(
          'Agent Pro: Would you like to automatically add 22+ expert agents to all your workspaces?',
          'Yes, Always', 'No, Never', 'Ask Each Time'
        ).then(selection => {
          context.globalState.update('agentPro.hasAsked', true);

          if (selection === 'Yes, Always') {
            context.globalState.update('agentPro.autoInstall', true);
            try {
              copyRecursiveSync(sourceGithubPath, targetGithubPath);
              vscode.window.showInformationMessage(
                'Agent Pro: Successfully added 22 expert agents! Type @ in Copilot Chat to use them.'
              );
            } catch (error) {
              vscode.window.showErrorMessage(`Agent Pro: Failed to copy agents: ${error.message}`);
            }
          } else if (selection === 'No, Never') {
            context.globalState.update('agentPro.autoInstall', false);
          } else if (selection === 'Ask Each Time') {
            context.globalState.update('agentPro.autoInstall', 'ask');
          }
        });
      } else if (autoInstall === 'ask') {
        // Ask for this workspace only
        vscode.window.showInformationMessage(
          'Agent Pro: Add expert agents to this workspace?',
          'Yes', 'No'
        ).then(selection => {
          if (selection === 'Yes') {
            try {
              copyRecursiveSync(sourceGithubPath, targetGithubPath);
              vscode.window.showInformationMessage(
                'Agent Pro: Successfully added 22 expert agents! Type @ in Copilot Chat to use them.'
              );
            } catch (error) {
              vscode.window.showErrorMessage(`Agent Pro: Failed to copy agents: ${error.message}`);
            }
          }
        });
      }
    }
  }

  // Register commands
  let installCommand = vscode.commands.registerCommand('agent-pro.install', function () {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showWarningMessage('Agent Pro: Please open a workspace first.');
      return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const extensionPath = context.extensionPath;
    const sourceGithubPath = path.join(extensionPath, '.github');
    const targetGithubPath = path.join(workspacePath, '.github');

    try {
      copyRecursiveSync(sourceGithubPath, targetGithubPath);
      vscode.window.showInformationMessage(
        'Agent Pro: Successfully installed 22 expert agents! Reload window to activate.',
        'Reload Window'
      ).then(action => {
        if (action === 'Reload Window') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Agent Pro: Installation failed: ${error.message}`);
    }
  });

  let updateCommand = vscode.commands.registerCommand('agent-pro.update', function () {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showWarningMessage('Agent Pro: Please open a workspace first.');
      return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const extensionPath = context.extensionPath;
    const sourceGithubPath = path.join(extensionPath, '.github');
    const targetGithubPath = path.join(workspacePath, '.github');

    try {
      copyRecursiveSync(sourceGithubPath, targetGithubPath);
      vscode.window.showInformationMessage('Agent Pro: Successfully updated agents!');
    } catch (error) {
      vscode.window.showErrorMessage(`Agent Pro: Update failed: ${error.message}`);
    }
  });

  let resetCommand = vscode.commands.registerCommand('agent-pro.reset', function () {
    context.globalState.update('agentPro.autoInstall', undefined);
    context.globalState.update('agentPro.hasAsked', undefined);
    vscode.window.showInformationMessage('Agent Pro: Preferences reset. Reload window to reconfigure.', 'Reload Window')
      .then(action => {
        if (action === 'Reload Window') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });
  });

  context.subscriptions.push(installCommand, updateCommand, resetCommand);
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
