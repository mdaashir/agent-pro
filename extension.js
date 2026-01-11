const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');

function activate(context) {
  console.log('Agent Pro extension is now active');

  const extensionPath = context.extensionPath;
  const sourceGithubPath = path.join(extensionPath, '.github');

  // Global installation path in user's home directory
  const globalAgentsPath = path.join(os.homedir(), '.copilot-agents', '.github');

  // Install agents globally on first activation
  const isGloballyInstalled = context.globalState.get('agentPro.globallyInstalled');

  if (!isGloballyInstalled) {
    try {
      // Copy agents to global location
      copyRecursiveSync(sourceGithubPath, globalAgentsPath);
      context.globalState.update('agentPro.globallyInstalled', true);
      console.log('Agent Pro: Installed agents globally to', globalAgentsPath);
    } catch (error) {
      console.error('Agent Pro: Failed to install globally:', error);
    }
  }

  // Link agents to current workspace
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspacePath = workspaceFolders[0].uri.fsPath;
    const targetGithubPath = path.join(workspacePath, '.github');

    // Only create symlink if .github doesn't exist
    if (!fs.existsSync(targetGithubPath)) {
      try {
        // Create junction (Windows) or symlink (Unix)
        if (process.platform === 'win32') {
          fs.symlinkSync(globalAgentsPath, targetGithubPath, 'junction');
        } else {
          fs.symlinkSync(globalAgentsPath, targetGithubPath, 'dir');
        }
        console.log('Agent Pro: Linked agents to workspace');
      } catch (error) {
        // If symlink fails, try copying instead
        console.warn('Agent Pro: Symlink failed, copying instead:', error.message);
        try {
          copyRecursiveSync(globalAgentsPath, targetGithubPath);
          console.log('Agent Pro: Copied agents to workspace');
        } catch (copyError) {
          console.error('Agent Pro: Failed to link/copy agents:', copyError);
        }
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
    const targetGithubPath = path.join(workspacePath, '.github');

    try {
      // Create symlink or copy
      if (!fs.existsSync(targetGithubPath)) {
        if (process.platform === 'win32') {
          fs.symlinkSync(globalAgentsPath, targetGithubPath, 'junction');
        } else {
          fs.symlinkSync(globalAgentsPath, targetGithubPath, 'dir');
        }
      }
      vscode.window.showInformationMessage(
        'Agent Pro: Successfully linked agents! Reload window to activate.',
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
    try {
      // Update global agents
      copyRecursiveSync(sourceGithubPath, globalAgentsPath);
      vscode.window.showInformationMessage('Agent Pro: Successfully updated global agents! Reload to apply.', 'Reload Window')
        .then(action => {
          if (action === 'Reload Window') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
          }
        });
    } catch (error) {
      vscode.window.showErrorMessage(`Agent Pro: Update failed: ${error.message}`);
    }
  });

  let resetCommand = vscode.commands.registerCommand('agent-pro.reset', function () {
    context.globalState.update('agentPro.globallyInstalled', undefined);
    vscode.window.showInformationMessage('Agent Pro: Reset complete. Reload to reinstall globally.', 'Reload Window')
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
