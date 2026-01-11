const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  console.log('Agent Pro extension is now active');

  // Copy .github folder to workspace on activation
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspacePath = workspaceFolders[0].uri.fsPath;
    const extensionPath = context.extensionPath;
    const sourceGithubPath = path.join(extensionPath, '.github');
    const targetGithubPath = path.join(workspacePath, '.github');

    // Check if .github folder already exists in workspace
    if (!fs.existsSync(targetGithubPath)) {
      // Ask user if they want to copy the agents
      vscode.window.showInformationMessage(
        'Agent Pro: Would you like to add 22+ expert agents to this workspace?',
        'Yes', 'No', 'Always'
      ).then(selection => {
        if (selection === 'Yes' || selection === 'Always') {
          try {
            // Copy .github folder to workspace
            copyRecursiveSync(sourceGithubPath, targetGithubPath);

            vscode.window.showInformationMessage(
              'Agent Pro: Successfully added 22 expert agents! Type @ in Copilot Chat to use them.',
              'Open Chat'
            ).then(action => {
              if (action === 'Open Chat') {
                vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
              }
            });

            // Save preference if "Always" was selected
            if (selection === 'Always') {
              context.globalState.update('agentPro.autoInstall', true);
            }
          } catch (error) {
            vscode.window.showErrorMessage(`Agent Pro: Failed to copy agents: ${error.message}`);
          }
        }
      });
    } else if (context.globalState.get('agentPro.autoInstall')) {
      // Auto-update if preference is set
      try {
        copyRecursiveSync(sourceGithubPath, targetGithubPath);
      } catch (error) {
        console.error('Agent Pro auto-update failed:', error);
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

  context.subscriptions.push(installCommand);
  context.subscriptions.push(updateCommand);
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
