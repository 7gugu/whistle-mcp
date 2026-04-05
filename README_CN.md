# Whistle MCP Server

中文 | [English](README.md)

## 项目简介

Whistle MCP Server 是一个基于 Model Context Protocol (MCP) 协议的 Whistle 代理管理工具，让 AI 助手能够直接操作和控制本地 Whistle 代理服务器。通过该工具，AI 可以帮助用户管理规则、分组、值，监控网络请求，以及重放和修改请求等，无需用户手动操作 Whistle 界面。它极大地简化了网络调试、接口测试和代理规则管理的流程，使用户能够通过自然语言与 AI 交互来完成复杂的网络代理配置任务。

## 功能特点

- **规则管理**：创建、更新、重命名、删除和启用/禁用 Whistle 规则
- **分组管理**：创建、重命名、删除分组，以及规则与分组之间的关联操作
- **值管理**：创建、更新、重命名和删除值，支持值分组管理
- **代理控制**：启用/禁用代理、HTTP/HTTPS 拦截、HTTP/2 协议等
- **请求拦截**：查看拦截的网络请求信息，支持 URL 过滤
- **请求重放**：支持重放捕获的请求，可自定义请求参数
- **多规则模式**：支持启用/禁用多规则模式

## 安装

### 环境要求

必须使用 **Node.js 18.20.0** 及以上版本（与 `package.json` 中 `engines` 字段一致），低于该版本不予支持。

您可以通过 npm 全局安装 Whistle MCP Server：

```bash
npm install -g whistle-mcp-tool
```

### 从源码构建

在仓库根目录执行：

```bash
npm install
npm run build
```

构建产物入口为 **`dist/index.js`**（与全局安装后的 `whistle-mcp` 命令指向同一文件）。也可在 MCP 配置里用 `node` 直接指定该路径。

## MCP 配置

### 传输方式（stdio / HTTP）

默认使用 **`stdio`**（适合 Cursor 等本机通过子进程连接的 MCP 客户端）。

若需通过 **HTTP** 提供 **Streamable HTTP** 与 **SSE**（远程或支持 HTTP 的客户端），使用 **`--transport http-stream`**。FastMCP 会在 **`--mcp-host` / `--mcp-port`** 上监听，并同时提供：

- Streamable HTTP：`http://<mcp-host>:<mcp-port><mcp-endpoint>`（默认路径 **`/mcp`**）
- SSE：`http://<mcp-host>:<mcp-port>/sse`

`http-stream` 的别名：`sse`、`streamable-http`（同一种模式，上述两个 URL 均可用）。

| 参数 / 环境变量 | 含义 |
|----------------|------|
| `--transport` / `-t`、`FASTMCP_TRANSPORT` | `stdio`（默认）或 `http-stream` |
| `--mcp-port`、`FASTMCP_PORT` | MCP HTTP 端口（HTTP 模式默认 **8085**） |
| `--mcp-host`、`FASTMCP_HOST` | 监听地址（默认 **0.0.0.0**） |
| `--mcp-endpoint`、`FASTMCP_ENDPOINT` | Streamable HTTP 路径（默认 **`/mcp`**） |
| `--stateless`、`FASTMCP_STATELESS=true` | 无状态 HTTP 模式（可选） |

连接 **Whistle** 的参数不变：**`--host`**、**`--port`**、**`--username` / `--password`**（或 `-n` / `-w`）。

示例（HTTP 传输 + 本机 Whistle 8899；未指定时 MCP 默认监听 **8085**）：

```bash
whistle-mcp --transport http-stream --host 127.0.0.1 --port 8899
```

可用 `--mcp-port <端口>` 覆盖默认 **8085**。

安装后，您可以在 MCP JSON 配置文件中配置 Whistle MCP：

```json
{
  "mcpServers": {
    "whistle-mcp": {
      "command": "whistle-mcp",
      "args": [
        "--host=<whistle的服务器IP地址>",
        "--port=<whistle的服务器端口号>"
      ]
    }
  }
}
```

若 Whistle 使用账号密码启动（与 Whistle 命令行一致：`w2 start -n <用户名> -w <密码>`），需在本 MCP 中填写**相同**凭据，否则无法访问 Whistle 的 HTTP API：

```json
{
  "mcpServers": {
    "whistle-mcp": {
      "command": "whistle-mcp",
      "args": [
        "--host=localhost",
        "--port=8899",
        "--username=<用户名>",
        "--password=<密码>"
      ]
    }
  }
}
```

短参数与 `w2` 一致：`-n`、`-w` 分别等价于 `--username`、`--password`。

```bash
whistle-mcp --host localhost --port 8899 -n myuser -w mypass
```

### 配置说明

- **host**：Whistle 服务地址，未配置时默认为 `localhost`
- **port**：Whistle 端口，未配置时默认为 `8899`
- **username**（`-n` / `--username`）：若 Whistle 使用 `-n` 启用了登录，此处填写相同用户名；无登录则可不写
- **password**（`-w` / `--password`）：与 Whistle 的 `-w` 一致；若只配置了用户名未配置密码，将按空密码发送

## 将 MCP JSON 配置到 AI 客户端 中

- Claude 客户端: [https://modelcontextprotocol.io/quickstart/user](https://modelcontextprotocol.io/quickstart/user)
- Raycast: 需要安装 MCP 插件
- Cursor: [https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers](https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers)

## MCP 工具说明

Whistle MCP Server 提供了以下工具，可通过 MCP 协议调用：

### 规则管理

| 工具名称 | 描述 | 功能 |
| ------- | --- | ---- |
| getRules | 获取所有规则 | 列出所有已创建的规则及其内容 |
| createRule | 创建新规则 | 新建一个指定名称的规则 |
| updateRule | 更新规则内容 | 修改指定规则的内容 |
| renameRule | 重命名规则 | 将规则重命名为新名称 |
| deleteRule | 删除规则 | 删除指定名称的规则 |
| enableRule | 启用规则 | 启用指定名称的规则 |
| disableRule | 禁用规则 | 禁用指定名称的规则 |
| setAllRulesState | 控制所有规则状态 | 一键启用或禁用所有已创建的规则 |

### 分组管理

| 工具名称 | 描述 | 功能 |
| ------- | --- | ---- |
| createGroup | 创建分组 | 新建一个指定名称的规则分组 |
| renameGroup | 重命名分组 | 将规则分组重命名为新名称 |
| deleteGroup | 删除分组 | 删除指定名称的规则分组 |
| addRuleToGroup | 添加规则到分组 | 将指定规则添加到特定分组中 |
| removeRuleFromGroup | 移出规则 | 将规则从分组中移出到顶层 |

### 值管理

| 工具名称 | 描述 | 功能 |
| ------- | --- | ---- |
| getAllValues | 获取所有值 | 列出所有已创建的值和值分组（注意：数据量可能很大，建议使用 getValueList 获取列表后再通过 getValue 获取具体值） |
| getValueList | 获取值列表 | 获取值列表（仅包含 index 和 name，不包含 data 字段，避免数据量过大） |
| getValue | 获取单个值 | 根据名称获取单个值的完整信息（包含 data 字段） |
| createValue | 创建新值 | 新建一个指定名称的值 |
| updateValue | 更新值内容 | 修改指定值的内容 |
| renameValue | 重命名值 | 将值重命名为新名称 |
| deleteValue | 删除值 | 删除指定名称的值 |
| createValuesGroup | 创建值分组 | 新建一个指定名称的值分组 |
| renameValueGroup | 重命名值分组 | 将值分组重命名为新名称 |
| deleteValueGroup | 删除值分组 | 删除指定名称的值分组 |
| addValueToGroup | 添加值到分组 | 将指定值添加到特定分组中 |
| removeValueFromGroup | 移出值 | 将值从分组中移出到顶层 |

### 代理控制

| 工具名称 | 描述 | 功能 |
| ------- | --- | ---- |
| getWhistleStatus | 获取服务器状态 | 获取 Whistle 服务器的当前状态信息 |
| toggleProxy | 启用/禁用代理 | 切换 Whistle 代理的启用状态 |
| toggleHttpInterception | 启用/禁用HTTP拦截 | 切换 HTTP 请求拦截的启用状态 |
| toggleHttpsInterception | 启用/禁用HTTPS拦截 | 切换 HTTPS 请求拦截的启用状态 |
| toggleHttp2 | 启用/禁用HTTP2 | 切换 HTTP/2 协议支持的启用状态 |
| toggleMultiRuleMode | 启用/禁用多规则模式 | 切换是否允许同时启用多个规则 |

### 请求管理

| 工具名称 | 描述 | 功能 |
| ------- | --- | ---- |
| getInterceptInfo | 获取拦截信息 | 获取 Whistle 拦截的网络请求信息，支持 URL 过滤和正则匹配 |
| replayRequest | 重放请求 | 重新发送指定的网络请求，可自定义参数 |

### 实用工具

| 工具名称 | 描述 | 功能 |
| ------- | --- | ---- |
| getCurrentTimestamp | 获取当前时间戳 | 获取当前本地时间戳 |

## 联系方式

- 邮箱: [gz7gugu@qq.com](mailto:gz7gugu@qq.com)
- 博客: [https://7gugu.com](https://7gugu.com)
