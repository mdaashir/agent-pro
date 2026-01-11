# How to Use Agent Pro

GitHub Copilot agents from `.github/agents/` folders are **workspace-based**, not extension-based. This means the `.github` folder must be in your active project/workspace.

## Quick Setup

### Option 1: Copy to Your Project (Recommended)

1. Copy the `.github` folder from this extension to your project root:
   ```bash
   # Navigate to your project
   cd /path/to/your/project
   
   # Copy the .github folder
   cp -r /path/to/agent-pro/.github ./
   ```

2. Open your project in VS Code
3. Open GitHub Copilot Chat (`Ctrl+Shift+I` or `Cmd+Shift+I`)
4. Type `@` to see all available agents

### Option 2: Global Template

Create a global template you can copy to any project:

```bash
# Create a templates folder
mkdir -p ~/templates/agent-pro

# Copy the .github folder there
cp -r /path/to/agent-pro/.github ~/templates/agent-pro/

# Use in any project
cp -r ~/templates/agent-pro/.github /path/to/your/project/
```

## Available Agents

Once the `.github` folder is in your workspace, you'll have access to:

- `@accessibility-expert`
- `@ai-ml-engineering-expert`
- `@architecture-expert`
- `@cloud-architect`
- `@code-reviewer`
- `@data-engineering-expert`
- `@design-patterns-expert`
- `@design-systems-expert`
- `@devops-expert`
- `@documentation-expert`
- `@functional-programming-expert`
- `@graphql-expert`
- `@microservices-expert`
- `@mobile-development-expert`
- `@observability-sre-expert`
- `@performance-expert`
- `@platform-engineering-expert`
- `@python-expert`
- `@security-expert`
- `@systems-programming-expert`
- `@testing-specialist`
- `@typescript-expert`

## Verification

To verify agents are loaded:

1. Open GitHub Copilot Chat
2. Type `@` in the chat input
3. You should see your custom agents listed

## Why This Approach?

GitHub Copilot discovers agents from:
- **Workspace `.github/agents/`** - Project-specific agents
- **User global agents** - Personal agents in `~/.github/agents/`
- **Extension-registered agents** - Requires proper VS Code Extension API implementation

This extension provides the agent files for easy distribution. Copy them to your workspace to use them.

## Alternative: Create a VS Code Workspace Template

Create a `.code-workspace` file with the `.github` folder included:

```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "github.copilot.enable": {
      "*": true
    }
  }
}
```

Then open projects with "File → Open Workspace" to include the agents automatically.
