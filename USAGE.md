# How to Use Agent Pro

Agent Pro provides **24 expert agents** that integrate directly with GitHub Copilot. Agents are installed globally and accessible from any project.

## Quick Setup

1. **Install the Extension**
   - Open VS Code
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for "Agent Pro"
   - Click Install

2. **Agents Activated Automatically**
   - Extension activates on VS Code startup
   - Resources copied to global storage
   - All agents ready to use immediately

3. **Start Using Agents**
   - Open GitHub Copilot Chat (`Ctrl+Shift+I` or `Cmd+Shift+I`)
   - Type `@` to see all available agents
   - Select an agent to start chatting

## Available Agents

Once installed, you have instant access to:

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

## Storage Location

Agent Pro stores resources globally at:

- **Windows**: `%APPDATA%\Code\User\globalStorage\mdaashir.agent-pro\resources\`
- **macOS**: `~/Library/Application Support/Code/User/globalStorage/mdaashir.agent-pro/resources/`
- **Linux**: `~/.config/Code/User/globalStorage/mdaashir.agent-pro/resources/`

This keeps agents available across all projects without needing workspace setup.

## Troubleshooting

**Agents not showing?**

1. Restart VS Code
2. Confirm GitHub Copilot Chat is installed
3. Open Extension Details and verify Agent Pro is active

**Need to update agents?**

- Uninstall and reinstall Agent Pro from the marketplace
