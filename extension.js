const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function ensureGlobalAssets(context) {
  const storagePath = context.globalStorageUri.fsPath;
  const versionKey = 'agentPro.installedVersion';
  const currentVersion = context.extension.packageJSON.version;

  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }

  const installedVersion = context.globalState.get(versionKey);
  if (installedVersion === currentVersion) return;

  const src = context.asAbsolutePath('resources');
  const dest = path.join(storagePath, 'resources');

  try {
    copyRecursive(src, dest);

    // Optional: install resources to user's ~/.github for GitHub.com/CLI discovery
    const config = vscode.workspace.getConfiguration('agentPro');
    const installToHomeGithub = config.get('installToHomeGithub', false);
    if (installToHomeGithub) {
      await installForCopilot(context);
    }

    await context.globalState.update(versionKey, currentVersion);
    console.log(`Agent Pro: Resources installed to ${dest}`);

    vscode.window.showInformationMessage(
      installToHomeGithub
        ? 'Agent Pro: Agents installed! Type @ in Copilot Chat to use them.'
        : 'Agent Pro: Agents installed globally. Type @ in Copilot Chat to use them.'
    );
  } catch (error) {
    console.error('Agent Pro: Failed to install resources:', error);
    vscode.window.showErrorMessage(`Agent Pro: Installation failed - ${error.message}`);
    throw error;
  }
}

async function installForCopilot(context) {
  const homeDir = os.homedir();
  const copilotGithubPath = path.join(homeDir, '.github');
  const src = context.asAbsolutePath('resources');

  try {
    if (!fs.existsSync(copilotGithubPath)) {
      fs.mkdirSync(copilotGithubPath, { recursive: true });
    }

    const agentsSource = path.join(src, 'agents');
    const agentsDest = path.join(copilotGithubPath, 'agents');
    if (fs.existsSync(agentsSource)) {
      copyRecursive(agentsSource, agentsDest);
      console.log(`Agent Pro: Agents copied to ${agentsDest} for Copilot discovery`);
    }

    const instructionsSource = path.join(src, 'instructions');
    const instructionsDest = path.join(copilotGithubPath, 'instructions');
    if (fs.existsSync(instructionsSource)) {
      copyRecursive(instructionsSource, instructionsDest);
      console.log(`Agent Pro: Instructions copied to ${instructionsDest}`);
    }

    const skillsSource = path.join(src, 'skills');
    const skillsDest = path.join(copilotGithubPath, 'skills');
    if (fs.existsSync(skillsSource)) {
      copyRecursive(skillsSource, skillsDest);
      console.log(`Agent Pro: Skills copied to ${skillsDest}`);
    }

    const promptsSource = path.join(src, 'prompts');
    const promptsDest = path.join(copilotGithubPath, 'prompts');
    if (fs.existsSync(promptsSource)) {
      copyRecursive(promptsSource, promptsDest);
      console.log(`Agent Pro: Prompts copied to ${promptsDest}`);
    }

    const copilotInstructions = path.join(
      context.asAbsolutePath('.github'),
      'copilot-instructions.md'
    );
    const copilotInstructionsDest = path.join(copilotGithubPath, 'copilot-instructions.md');
    if (fs.existsSync(copilotInstructions)) {
      fs.copyFileSync(copilotInstructions, copilotInstructionsDest);
      console.log(`Agent Pro: copilot-instructions.md copied to ${copilotInstructionsDest}`);
    }

    console.log(`Agent Pro: GitHub Copilot will discover agents from ${copilotGithubPath}`);
  } catch (error) {
    console.error('Agent Pro: Failed to install for Copilot:', error);
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
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

class AgentProFS {
  constructor(context) {
    this.context = context;
    this.base = path.join(context.globalStorageUri.fsPath, 'resources');
    this._emitter = new vscode.EventEmitter();
    this.onDidChangeFile = this._emitter.event;
  }

  watch(uri, options) {
    return new vscode.Disposable(() => {});
  }

  stat(uri) {
    try {
      const fsPath = this._toFsPath(uri);
      const stat = fs.statSync(fsPath);
      return {
        type: stat.isDirectory() ? vscode.FileType.Directory : vscode.FileType.File,
        size: stat.size,
        ctime: stat.ctimeMs,
        mtime: stat.mtimeMs,
        permissions: vscode.FilePermission.Readonly,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw vscode.FileSystemError.FileNotFound(uri);
      }
      throw error;
    }
  }

  readDirectory(uri) {
    try {
      const fsPath = this._toFsPath(uri);
      if (!fs.existsSync(fsPath)) {
        throw vscode.FileSystemError.FileNotFound(uri);
      }
      const entries = fs.readdirSync(fsPath);
      const result = [];
      for (const entry of entries) {
        const entryPath = path.join(fsPath, entry);
        const stat = fs.statSync(entryPath);
        const type = stat.isDirectory() ? vscode.FileType.Directory : vscode.FileType.File;
        result.push([entry, type]);
      }
      return result;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw vscode.FileSystemError.FileNotFound(uri);
      }
      throw error;
    }
  }

  createDirectory(uri) {
    throw vscode.FileSystemError.NoPermissions('Read-only file system');
  }

  readFile(uri) {
    try {
      const fsPath = this._toFsPath(uri);
      if (!fs.existsSync(fsPath)) {
        throw vscode.FileSystemError.FileNotFound(uri);
      }
      return fs.readFileSync(fsPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw vscode.FileSystemError.FileNotFound(uri);
      }
      throw error;
    }
  }

  writeFile(uri, content, options) {
    throw vscode.FileSystemError.NoPermissions('Read-only file system');
  }

  delete(uri, options) {
    throw vscode.FileSystemError.NoPermissions('Read-only file system');
  }

  rename(oldUri, newUri, options) {
    throw vscode.FileSystemError.NoPermissions('Read-only file system');
  }

  _toFsPath(uri) {
    let fsPath = path.join(this.base, uri.path);
    if (process.platform === 'win32' && fsPath.startsWith('/')) {
      fsPath = fsPath.substring(1);
    }
    return fsPath;
  }
}

class AgentTreeItem extends vscode.TreeItem {
  constructor(label, collapsibleState, resourcePath, isFile) {
    super(label, collapsibleState);
    this.resourcePath = resourcePath;
    this.isFile = isFile;

    if (isFile) {
      this.iconPath = new vscode.ThemeIcon('file');
      this.command = {
        command: 'agent-pro.open',
        title: 'Open Agent',
        arguments: [resourcePath],
      };
    } else {
      this.iconPath = new vscode.ThemeIcon('folder');
    }

    this.contextValue = isFile ? 'file' : 'folder';
  }
}

class AgentTreeProvider {
  constructor(context) {
    this.context = context;
    this.basePath = path.join(context.globalStorageUri.fsPath, 'resources');
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    try {
      if (!element) {
        return this._getRootItems();
      } else {
        return this._getChildItems(element);
      }
    } catch (error) {
      console.error('Error in getChildren:', error);
      return [];
    }
  }

  _getRootItems() {
    if (!fs.existsSync(this.basePath)) {
      console.warn(`Resources path not found: ${this.basePath}`);
      return [];
    }

    const items = [];
    try {
      const dirs = fs.readdirSync(this.basePath);
      for (const dir of dirs) {
        const fullPath = path.join(this.basePath, dir);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          items.push(
            new AgentTreeItem(
              dir.charAt(0).toUpperCase() + dir.slice(1),
              vscode.TreeItemCollapsibleState.Collapsed,
              dir,
              false
            )
          );
        }
      }
    } catch (error) {
      console.error('Error reading root items:', error);
    }
    return items;
  }

  _getChildItems(parentElement) {
    const folderPath = path.join(this.basePath, parentElement.resourcePath);
    if (!fs.existsSync(folderPath)) {
      return [];
    }

    const items = [];
    try {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const fullPath = path.join(folderPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isFile() && file.endsWith('.md')) {
          const resourcePath = `${parentElement.resourcePath}/${file}`;
          items.push(
            new AgentTreeItem(
              file.replace(/\.md$/, ''),
              vscode.TreeItemCollapsibleState.None,
              resourcePath,
              true
            )
          );
        } else if (stat.isDirectory()) {
          const resourcePath = `${parentElement.resourcePath}/${file}`;
          items.push(
            new AgentTreeItem(file, vscode.TreeItemCollapsibleState.Collapsed, resourcePath, false)
          );
        }
      }
    } catch (error) {
      console.error('Error reading child items:', error);
    }
    return items;
  }

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }
}

async function openAgent(relPath) {
  if (!relPath) {
    const picked = await vscode.window.showQuickPick(getAgentQuickPickItems(), {
      placeHolder: 'Select an agent to open',
    });
    if (!picked) return;
    relPath = picked.detail;
  }

  try {
    const uri = vscode.Uri.parse(`agentpro:/${relPath}`);
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc, { preview: true });
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open agent: ${error.message}`);
  }
}

async function insertAgent(relPath) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor. Open a file first.');
    return;
  }

  if (!relPath) {
    const picked = await vscode.window.showQuickPick(getAgentQuickPickItems(), {
      placeHolder: 'Select an agent to insert',
    });
    if (!picked) return;
    relPath = picked.detail;
  }

  try {
    const uri = vscode.Uri.parse(`agentpro:/${relPath}`);
    const doc = await vscode.workspace.openTextDocument(uri);
    const text = doc.getText();
    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, text);
    });
    vscode.window.showInformationMessage('Agent content inserted successfully');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to insert agent: ${error.message}`);
  }
}

async function exportAgent(relPath) {
  if (!vscode.workspace.isTrusted) {
    vscode.window.showWarningMessage('Workspace is not trusted. Cannot export agents.');
    return;
  }

  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  if (!relPath) {
    const picked = await vscode.window.showQuickPick(getAgentQuickPickItems(), {
      placeHolder: 'Select an agent to export',
    });
    if (!picked) return;
    relPath = picked.detail;
  }

  try {
    const src = vscode.Uri.parse(`agentpro:/${relPath}`);
    const text = (await vscode.workspace.openTextDocument(src)).getText();
    const dest = vscode.Uri.joinPath(ws.uri, '.github', relPath);

    await vscode.workspace.fs.writeFile(dest, Buffer.from(text));
    vscode.window.showInformationMessage(`Agent exported to ${relPath}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to export agent: ${error.message}`);
  }
}

function getAgentQuickPickItems() {
  const basePath = vscode.extensions.getExtension('mdaashir.agent-pro').extensionPath;
  const resourcePath = path.join(basePath, 'resources');
  const items = [];

  if (!fs.existsSync(resourcePath)) {
    return items;
  }

  const categories = fs.readdirSync(resourcePath);
  for (const category of categories) {
    const categoryPath = path.join(resourcePath, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        items.push({
          label: `[${category}] ${file.replace(/\.md$/, '')}`,
          detail: `${category}/${file}`,
          description: file,
        });
      }
    }
  }

  return items.sort((a, b) => a.label.localeCompare(b.label));
}

async function activate(context) {
  console.log('Agent Pro: Activating extension...');

  try {
    await ensureGlobalAssets(context);

    const agentFS = new AgentProFS(context);
    context.subscriptions.push(
      vscode.workspace.registerFileSystemProvider('agentpro', agentFS, {
        isCaseSensitive: true,
        isReadonly: true,
      })
    );

    const treeProvider = new AgentTreeProvider(context);
    const treeView = vscode.window.createTreeView('agentProView', {
      treeDataProvider: treeProvider,
      canSelectMany: false,
      showCollapseAll: true,
    });

    context.subscriptions.push(treeView);

    context.subscriptions.push(
      vscode.commands.registerCommand('agent-pro.open', openAgent),
      vscode.commands.registerCommand('agent-pro.insert', insertAgent),
      vscode.commands.registerCommand('agent-pro.export', exportAgent),
      vscode.commands.registerCommand('agent-pro.refresh', () => {
        treeProvider.refresh();
        vscode.window.showInformationMessage('Agent Pro: TreeView refreshed');
      })
    );

    console.log('Agent Pro: Activated successfully');
  } catch (error) {
    console.error('Agent Pro: Activation failed:', error);
    vscode.window.showErrorMessage(`Agent Pro failed to activate: ${error.message}`);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
