const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

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

  copyRecursive(src, dest);
  await context.globalState.update(versionKey, currentVersion);

  vscode.window.showInformationMessage(
    `Agent Pro v${currentVersion}: Agents installed globally! Access via sidebar or commands.`
  );
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.statSync(s).isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

class AgentProFS {
  constructor(context) {
    this.base = path.join(context.globalStorageUri.fsPath, 'resources');
    this._emitter = new vscode.EventEmitter();
    this.onDidChangeFile = this._emitter.event;
  }

  watch(uri, options) {
    return new vscode.Disposable(() => {});
  }

  stat(uri) {
    const stat = fs.statSync(this._path(uri));
    const isDir = stat.isDirectory();
    return {
      type: isDir ? vscode.FileType.Directory : vscode.FileType.File,
      size: stat.size,
      ctime: stat.ctimeMs,
      mtime: stat.mtimeMs
    };
  }

  readDirectory(uri) {
    const p = this._path(uri);
    const entries = fs.readdirSync(p);
    const result = [];
    for (const entry of entries) {
      const entryPath = path.join(p, entry);
      const stat = fs.statSync(entryPath);
      result.push([entry, stat.isDirectory() ? vscode.FileType.Directory : vscode.FileType.File]);
    }
    return result;
  }

  createDirectory(uri) {
    throw vscode.FileSystemError.NoPermissions('Read-only file system');
  }

  readFile(uri) {
    return fs.readFileSync(this._path(uri));
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

  _path(uri) {
    return path.join(this.base, uri.path.replace(/^\/+/, ''));
  }
}

class AgentTreeProvider {
  constructor(basePath) {
    this.basePath = basePath;
  }

  getChildren(element) {
    if (!element) {
      return this.readDir('').map(item => ({
        label: item.charAt(0).toUpperCase() + item.slice(1),
        path: item,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        contextValue: 'folder'
      }));
    } else {
      return this.readDir(element.path).map(f => ({
        label: f,
        path: `${element.path}/${f}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        contextValue: 'file',
        command: {
          command: 'agent-pro.open',
          arguments: [`${element.path}/${f}`],
          title: 'Open Agent'
        }
      }));
    }
  }

  getTreeItem(element) {
    return element;
  }

  readDir(dir) {
    const p = path.join(this.basePath, dir);
    if (!fs.existsSync(p)) return [];
    return fs.readdirSync(p).filter(f => {
      const fullPath = path.join(p, f);
      return fs.statSync(fullPath).isDirectory() || f.endsWith('.md');
    });
  }
}

async function openAgent(relPath) {
  if (!relPath) {
    vscode.window.showInformationMessage('Please select an agent from the sidebar.');
    return;
  }

  const uri = vscode.Uri.parse(`agentpro:/${relPath}`);
  const doc = await vscode.workspace.openTextDocument(uri);
  vscode.window.showTextDocument(doc, { preview: true });
}

async function insertAgent(relPath) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  if (!relPath) {
    vscode.window.showInformationMessage('Please select an agent from the sidebar.');
    return;
  }

  const uri = vscode.Uri.parse(`agentpro:/${relPath}`);
  const doc = await vscode.workspace.openTextDocument(uri);

  editor.edit(edit =>
    edit.insert(editor.selection.active, doc.getText())
  );
}

async function exportAgent(relPath) {
  if (!vscode.workspace.isTrusted) {
    vscode.window.showWarningMessage('Workspace not trusted');
    return;
  }

  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  if (!relPath) {
    vscode.window.showInformationMessage('Please select an agent from the sidebar.');
    return;
  }

  const src = vscode.Uri.parse(`agentpro:/${relPath}`);
  const text = (await vscode.workspace.openTextDocument(src)).getText();

  const dest = vscode.Uri.joinPath(ws.uri, '.github', relPath);
  await vscode.workspace.fs.writeFile(dest, Buffer.from(text));

  vscode.window.showInformationMessage(`Agent exported to ${relPath}`);
}

async function activate(context) {
  await ensureGlobalAssets(context);

  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(
      'agentpro',
      new AgentProFS(context),
      { isReadonly: true }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('agent-pro.open', openAgent),
    vscode.commands.registerCommand('agent-pro.insert', insertAgent),
    vscode.commands.registerCommand('agent-pro.export', exportAgent)
  );

  const base = path.join(context.globalStorageUri.fsPath, 'resources');
  const treeProvider = new AgentTreeProvider(base);
  vscode.window.registerTreeDataProvider('agentProView', treeProvider);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
