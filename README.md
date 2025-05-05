[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/7gugu-whistle-mcp-badge.png)](https://mseep.ai/app/7gugu-whistle-mcp)

# Whistle MCP Server

English | [中文](README_CN.md)
[![smithery badge](https://smithery.ai/badge/@7gugu/whistle-mcp)](https://smithery.ai/server/@7gugu/whistle-mcp)

## Project Introduction

Whistle MCP Server is a Whistle proxy management tool based on the Model Context Protocol (MCP), allowing AI assistants to directly operate and control local Whistle proxy servers. Through this tool, AI can help users manage rules, groups, values, monitor network requests, replay and modify requests, etc., without requiring manual operation of the Whistle interface. It greatly simplifies the process of network debugging, API testing, and proxy rule management, enabling users to complete complex network proxy configuration tasks through natural language interaction with AI.

## Features

- **Rule Management**: Create, update, rename, delete, and enable/disable Whistle rules
- **Group Management**: Create, rename, delete groups, and associate operations between rules and groups
- **Value Management**: Create, update, rename, and delete values, with support for value group management
- **Proxy Control**: Enable/disable proxy, HTTP/HTTPS interception, HTTP/2 protocol, etc.
- **Request Interception**: View intercepted network request information, with URL filtering support
- **Request Replay**: Support for replaying captured requests with custom request parameters
- **Multi-Rule Mode**: Support for enabling/disabling multi-rule mode

## Installation

### Installing via Smithery

To install Whistle MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@7gugu/whistle-mcp):

```bash
npx -y @smithery/cli install @7gugu/whistle-mcp --client claude
```

### Manual Installation
You can install Whistle MCP Server globally via npm:

```bash
npm install -g whistle-mcp-tool
```

## MCP Configuration

After installation, you can configure Whistle MCP in your MCP JSON configuration file:

```json
{
  "mcpServers": {
    "whistle-mcp": {
      "command": "whistle-mcp",
      "args": [
        "--host=<whistle server IP address>",
        "--port=<whistle server port number>"
      ]
    }
  }
}
```

### Configuration Details

- host: Whistle server IP address, defaults to localhost if not configured
- port: Whistle server port number, defaults to 8899 if not configured

## Configuring MCP JSON in AI Clients

- Claude Client: [https://modelcontextprotocol.io/quickstart/user](https://modelcontextprotocol.io/quickstart/user)
- Raycast: Requires MCP plugin installation
- Cursor: [https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers](https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers)

## MCP Tools Description

Whistle MCP Server provides the following tools, which can be called via the MCP protocol:

### Rule Management

| Tool Name | Description | Function |
| ------- | --- | ---- |
| getRules | Get all rules | List all created rules and their content |
| createRule | Create new rule | Create a new rule with the specified name |
| updateRule | Update rule content | Modify the content of a specified rule |
| renameRule | Rename rule | Rename a rule to a new name |
| deleteRule | Delete rule | Delete a rule with the specified name |
| selectRule | Enable rule | Enable a rule with the specified name |
| unselectRule | Disable rule | Disable a rule with the specified name |
| disableAllRules | Disable all rules | Disable all created rules at once |

### Group Management

| Tool Name | Description | Function |
| ------- | --- | ---- |
| createGroup | Create group | Create a new rule group with the specified name |
| renameGroup | Rename group | Rename a rule group to a new name |
| deleteGroup | Delete group | Delete a rule group with the specified name |
| moveRuleToGroup | Move rule to group | Move a specified rule to a specific group |
| moveRuleOutOfGroup | Move rule out of group | Move a rule out of its group to the top level |

### Value Management

| Tool Name | Description | Function |
| ------- | --- | ---- |
| getAllValues | Get all values | List all created values and value groups |
| createValue | Create new value | Create a new value with the specified name |
| updateValue | Update value content | Modify the content of a specified value |
| renameValue | Rename value | Rename a value to a new name |
| deleteValue | Delete value | Delete a value with the specified name |
| createValueGroup | Create value group | Create a new value group with the specified name |
| renameValueGroup | Rename value group | Rename a value group to a new name |
| deleteValueGroup | Delete value group | Delete a value group with the specified name |
| moveValueToGroup | Move value to group | Move a specified value to a specific group |
| moveValueOutOfGroup | Move value out of group | Move a value out of its group to the top level |

### Proxy Control

| Tool Name | Description | Function |
| ------- | --- | ---- |
| getStatus | Get server status | Get the current status information of the Whistle server |
| toggleProxy | Enable/disable proxy | Toggle the enabled state of the Whistle proxy |
| toggleHttpsInterception | Enable/disable HTTPS interception | Toggle the enabled state of HTTPS request interception |
| toggleHttp2 | Enable/disable HTTP2 | Toggle the enabled state of HTTP/2 protocol support |
| toggleMultiRuleMode | Enable/disable multi-rule mode | Toggle whether to allow multiple rules to be enabled simultaneously |

### Request Management

| Tool Name | Description | Function |
| ------- | --- | ---- |
| getInterceptInfo | Get interception information | Get network request information intercepted by Whistle, with filtering support |
| replayRequest | Replay request | Resend a specified network request with customizable parameters |

## Contact Information

- Email: [gz7gugu@qq.com](mailto:gz7gugu@qq.com)
- Blog: [https://7gugu.com](https://7gugu.com)
