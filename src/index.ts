import { FastMCP } from "fastmcp";
import { z } from "zod";
import { WhistleClient } from "./WhistleClient";
import minimist from "minimist";

// 解析命令行参数
const argv = minimist(process.argv.slice(2));
const host = argv.host || "localhost"; // 默认为localhost
const port = argv.port ? parseInt(argv.port) : 8005; // 默认为8888

// 创建FastMCP服务器
const server = new FastMCP({
  name: "Whistle MCP 服务",
  version: "1.0.0",
});

// 实例化whistle客户端
const whistleClient = new WhistleClient(host, port);

// 规则管理相关工具
server.addTool({
  name: "getRules",
  description: "获取所有规则&分组",
  parameters: z.object({}),
  execute: async () => {
    const rules = await whistleClient.getRules();
    return JSON.stringify(rules);
  },
});

server.addTool({
  name: "createRule",
  description: "创建新规则",
  parameters: z.object({
    name: z.string().describe("规则名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.createRule(args.name);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "updateRule",
  description: "更新规则内容",
  parameters: z.object({
    ruleName: z.string().describe("规则名称"),
    ruleValue: z.string().describe("规则内容"),
  }),
  execute: async (args) => {
    const { ruleName, ruleValue } = args;
    const result = await whistleClient.updateRule(ruleName, ruleValue);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "renameRule",
  description: "重命名规则",
  parameters: z.object({
    ruleName: z.string().describe("规则现有名称"),
    newName: z.string().describe("规则的新名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.updateRule(args.ruleName, args.newName);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "deleteRule",
  description: "删除规则",
  parameters: z.object({
    ruleName: z.string().describe("要删除的规则名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.deleteRule(args.ruleName);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "enableRule",
  description: "启用规则",
  parameters: z.object({
    ruleName: z.string().describe("规则名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.selectRule(args.ruleName);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "disableRule",
  description: "禁用规则",
  parameters: z.object({
    ruleName: z.string().describe("规则名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.unselectRule(args.ruleName);
    return JSON.stringify(result);
  },
});

// 分组管理相关工具
server.addTool({
  name: "getGroups",
  description: "获取所有分组",
  parameters: z.object({}),
  execute: async () => {
    const groups = await whistleClient.getGroups();
    return JSON.stringify(groups);
  },
});

server.addTool({
  name: "createGroup",
  description: "创建新分组",
  parameters: z.object({
    name: z.string().describe("分组名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.createGroup(args.name);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "renameGroup",
  description: "重命名分组",
  parameters: z.object({
    groupId: z.string().describe("要重命名的分组ID"),
    newName: z.string().describe("分组的新名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.updateGroup(args.groupId, args.newName);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "deleteGroup",
  description: "删除分组",
  parameters: z.object({
    groupId: z.string().describe("要删除的分组ID"),
  }),
  execute: async (args) => {
    const result = await whistleClient.deleteGroup(args.groupId);
    return JSON.stringify(result);
  },
});

// 代理控制相关工具
server.addTool({
  name: "getWhistleStatus",
  description: "获取whistle服务器的当前状态",
  parameters: z.object({}),
  execute: async () => {
    const status = await whistleClient.getStatus();
    return JSON.stringify(status);
  },
});

server.addTool({
  name: "toggleProxy",
  description: "启用或禁用whistle代理",
  parameters: z.object({
    enabled: z.boolean().describe("是否启用代理"),
  }),
  execute: async (args) => {
    const result = await whistleClient.toggleProxy(args.enabled);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "toggleHttpInterception",
  description: "启用或禁用HTTP拦截",
  parameters: z.object({
    enabled: z.boolean().describe("是否启用HTTP拦截"),
  }),
  execute: async (args) => {
    const result = await whistleClient.toggleHttpInterception(args.enabled);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "toggleMultiRuleMode",
  description: "启用或禁用多规则模式",
  parameters: z.object({
    enabled: z.boolean().describe("是否启用多规则模式"),
  }),
  execute: async (args) => {
    const result = await whistleClient.toggleMultiRuleMode(args.enabled);
    return JSON.stringify(result);
  },
});

// 请求拦截与重放工具
server.addTool({
  name: "getInterceptInfo",
  description: "获取URL的拦截信息",
  parameters: z.object({
    url: z.string().describe("要检查拦截信息的URL"),
  }),
  execute: async (args) => {
    const info = await whistleClient.getInterceptInfo(args.url);
    return JSON.stringify(info);
  },
});

server.addTool({
  name: "replayRequest",
  description: "在whistle中重放捕获的请求",
  parameters: z.object({
    requestId: z.string().describe("要重放的请求ID"),
  }),
  execute: async (args) => {
    const result = await whistleClient.replayRequest(args.requestId);
    return JSON.stringify(result);
  },
});

/**
 * 控制所有规则的启用状态
 */
server.addTool({
  name: "setAllRulesState",
  description: "控制所有规则的启用状态（启用/禁用）",
  parameters: z.object({
    disabled: z.boolean().describe("true表示禁用所有规则，false表示启用所有规则"),
  }),
  execute: async (args) => {
    const result = await whistleClient.disableAllRules(args.disabled);
    return JSON.stringify(result);
  },
});

// 启动服务器
server.start({
  transportType: "stdio",
});
