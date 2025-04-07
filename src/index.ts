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

// 统一响应格式的包装函数
function formatResponse(data: any) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data),
      },
    ],
  };
}

// 规则管理相关工具
server.addTool({
  name: "getRules",
  description: "获取所有规则&分组",
  parameters: z.object({}),
  execute: async () => {
    const rules = await whistleClient.getRules();
    return formatResponse(rules);
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
    return formatResponse(result);
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
    return formatResponse(result);
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
    const result = await whistleClient.renameRule(args.ruleName, args.newName);
    return formatResponse(result);
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
    return formatResponse(result);
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
    return formatResponse(result);
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
    return formatResponse(result);
  },
});

// 分组管理相关工具
server.addTool({
  name: "createGroup",
  description: "创建新分组",
  parameters: z.object({
    name: z.string().describe("分组名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.createGroup(args.name);
    return formatResponse(result);
  },
});

server.addTool({
  name: "renameGroup",
  description: "重命名分组",
  parameters: z.object({
    groupName: z.string().describe("分组的现有名称"),
    newName: z.string().describe("分组的新名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.renameGroup(
      args.groupName,
      args.newName
    );
    return formatResponse(result);
  },
});

server.addTool({
  name: "deleteGroup",
  description: "删除分组",
  parameters: z.object({
    groupName: z.string().describe("分组名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.deleteGroup(args.groupName);
    return formatResponse(result);
  },
});

server.addTool({
  name: "addRuleToGroup",
  description: "将规则添加到分组",
  parameters: z.object({
    groupName: z.string().describe("分组名称"),
    ruleName: z.string().describe("要添加的规则名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.moveRuleToGroup(
      args.ruleName,
      args.groupName
    );
    return formatResponse(result);
  },
});

server.addTool({
  name: "removeRuleFromGroup",
  description: "将规则移出分组",
  parameters: z.object({
    ruleName: z.string().describe("规则名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.moveRuleOutOfGroup(args.ruleName);
    return formatResponse(result);
  },
});

server.addTool({
  name: "getAllValues",
  description: "获取所有规则的值",
  parameters: z.object({}),
  execute: async () => {
    const rules = await whistleClient.getAllValues();
    return formatResponse(rules);
  },
});

server.addTool({
  name: "createValuesGroup",
  description: "创建新的值分组",
  parameters: z.object({
    name: z.string().describe("分组名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.createValueGroup(args.name);
    return formatResponse(result);
  },
});

server.addTool({
  name: "createValue",
  description: "创建新的值",
  parameters: z.object({
    name: z.string().describe("值名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.createValue(args.name);
    return formatResponse(result);
  },
});

server.addTool({
  name: "updateValue",
  description: "更新值内容",
  parameters: z.object({
    name: z.string().describe("值名称"),
    value: z.string().describe("新值内容"),
  }),
  execute: async (args) => {
    const result = await whistleClient.updateValue(args.name, args.value);
    return formatResponse(result);
  },
});

server.addTool({
  name: "renameValue",
  description: "重命名值",
  parameters: z.object({
    name: z.string().describe("值现有名称"),
    newName: z.string().describe("值的新名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.renameValue(args.name, args.newName);
    return formatResponse(result);
  },
});

server.addTool({
  name: "renameValueGroup",
  description: "重命名值分组",
  parameters: z.object({
    groupName: z.string().describe("分组现有名称"),
    newName: z.string().describe("分组的新名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.renameValueGroup(
      args.groupName,
      args.newName
    );
    return formatResponse(result);
  },
});

server.addTool({
  name: "deleteValue",
  description: "删除值",
  parameters: z.object({
    name: z.string().describe("值名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.deleteValue(args.name);
    return formatResponse(result);
  },
});

server.addTool({
  name: "deleteValueGroup",
  description: "删除值分组",
  parameters: z.object({
    groupName: z.string().describe("分组名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.deleteValueGroup(args.groupName);
    return formatResponse(result);
  },
});

server.addTool({
  name: "addValueToGroup",
  description: "将值添加到分组",
  parameters: z.object({
    groupName: z.string().describe("分组名称"),
    valueName: z.string().describe("要添加的值名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.moveValueToGroup(
      args.valueName,
      args.groupName
    );
    return formatResponse(result);
  },
});

server.addTool({
  name: "removeValueFromGroup",
  description: "将值移出分组",
  parameters: z.object({
    valueName: z.string().describe("值名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.moveValueOutOfGroup(args.valueName);
    return formatResponse(result);
  },
});

// 代理控制相关工具
server.addTool({
  name: "getWhistleStatus",
  description: "获取whistle服务器的当前状态",
  parameters: z.object({}),
  execute: async () => {
    const status = await whistleClient.getStatus();
    return formatResponse(status);
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
    return formatResponse(result);
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
    return formatResponse(result);
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
    return formatResponse(result);
  },
});

// 请求拦截与重放工具
server.addTool({
  name: "getInterceptInfo",
  description: "获取URL的拦截信息(请求/响应皆以base64编码)",
  parameters: z.object({
    url: z.string().optional().describe("要检查拦截信息的URL (支持正则表达式)"),
    startTime: z.string().optional().describe("开始时间ms（可选）"),
    count: z.number().optional().describe("请求数量（可选）"),
  }),
  execute: async (args) => {
    const { url = '', startTime = (Date.now() - 1000).toString(), count } = args;
    const result = await whistleClient.getInterceptInfo({ startTime, count });
    const filteredResult = Object.values(result.data).filter((item: any) => {
      if (url) {
        try {
          const regex = new RegExp(url);
          return Array.isArray(item.url) 
            ? item.url.some((u: string) => regex.test(u)) 
            : regex.test(item.url);
        } catch (e) {
          // 正则表达式无效时，回退到简单的字符串包含检查
          return Array.isArray(item.url) 
            ? item.url.some((u: string | string[]) => u.includes(url)) 
            : item.url.includes(url);
        }
      }
      return true;
    });
    return formatResponse(filteredResult);
  },
});

server.addTool({
  name: "replayRequest",
  description: "在whistle中重放捕获的请求",
  parameters: z.object({
    url: z.string().describe("请求URL"),
    method: z.string().optional().describe("请求方法，默认为GET"),
    headers: z.union([
      z.record(z.string()),
      z.string()
    ]).optional().describe("请求头，可以是对象或字符串"),
    body: z.union([
      z.string(),
      z.record(z.any())
    ]).optional().describe("请求体，可以是字符串或对象"),
    useH2: z.boolean().optional().describe("是否使用HTTP/2")
  }),
  execute: async (args) => {
    const result = await whistleClient.replayRequest(args);
    return formatResponse(result);
  },
});

/**
 * 控制所有规则的启用状态
 */
server.addTool({
  name: "setAllRulesState",
  description: "控制所有规则的启用状态（启用/禁用）",
  parameters: z.object({
    disabled: z
      .boolean()
      .describe("true表示禁用所有规则，false表示启用所有规则"),
  }),
  execute: async (args) => {
    const result = await whistleClient.disableAllRules(args.disabled);
    return formatResponse(result);
  },
});

// 启动服务器
server.start({
  transportType: "stdio",
});