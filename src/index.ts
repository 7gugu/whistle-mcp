import { FastMCP } from "fastmcp";
import { z } from "zod";
import axios from "axios";

// Whistle API 客户端类
class WhistleClient {
  private baseUrl: string;

  constructor(host: string = "localhost", port: number = 8899) {
    this.baseUrl = `http://${host}:${port}`;
  }

  // 获取所有规则
  async getRules(): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/cgi-bin/rules/list`);
    return response.data;
  }

  // 创建规则
  async createRule(name: string, content: string, groupId?: string): Promise<any> {
    const data = { name, content, groupId, enabled: true };
    const response = await axios.post(`${this.baseUrl}/cgi-bin/rules/add`, data);
    return response.data;
  }

  // 更新规则
  async updateRule(ruleId: string, data: { name?: string; content?: string; groupId?: string }): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/rules/update`, { id: ruleId, ...data });
    return response.data;
  }

  // 删除规则
  async deleteRule(ruleId: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/rules/remove`, { id: ruleId });
    return response.data;
  }

  // 启用/禁用规则
  async toggleRule(ruleId: string, enabled: boolean): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/rules/enable`, {
      id: ruleId,
      enabled
    });
    return response.data;
  }

  // 获取所有分组
  async getGroups(): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/cgi-bin/groups/list`);
    return response.data;
  }

  // 创建分组
  async createGroup(name: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/groups/add`, { name });
    return response.data;
  }

  // 更新分组
  async updateGroup(groupId: string, name: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/groups/update`, { id: groupId, name });
    return response.data;
  }

  // 删除分组
  async deleteGroup(groupId: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/groups/remove`, { id: groupId });
    return response.data;
  }

  // 获取服务器状态
  async getStatus(): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/cgi-bin/server-info`);
    return response.data;
  }

  // 启用/禁用代理
  async toggleProxy(enabled: boolean): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/proxy/enable`, { enabled });
    return response.data;
  }

  // 获取URL拦截信息
  async getInterceptInfo(url: string): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/cgi-bin/intercept/info`, {
      params: { url }
    });
    return response.data;
  }

  // 启用/禁用HTTP拦截
  async toggleHttpInterception(enabled: boolean): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/intercept/enable`, { enabled });
    return response.data;
  }

  // 启用/禁用多规则模式
  async toggleMultiRuleMode(enabled: boolean): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/settings/multi-rule-mode`, { enabled });
    return response.data;
  }

  // 重放请求
  async replayRequest(requestId: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/replay`, { id: requestId });
    return response.data;
  }
}

// 创建FastMCP服务器
const server = new FastMCP({
  name: "Whistle MCP 服务",
  version: "1.0.0",
});

// 实例化whistle客户端
const whistleClient = new WhistleClient('localhost', 8005);

// 规则管理相关工具
server.addTool({
  name: "getRules",
  description: "获取所有规则",
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
    content: z.string().describe("规则内容/模式"),
    groupId: z.string().optional().describe("可选的分组ID"),
  }),
  execute: async (args) => {
    const result = await whistleClient.createRule(args.name, args.content, args.groupId);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "updateRule",
  description: "更新规则内容或其他属性",
  parameters: z.object({
    ruleId: z.string().describe("要更新的规则ID"),
    name: z.string().optional().describe("新规则名称"),
    content: z.string().optional().describe("新规则内容"),
    groupId: z.string().optional().describe("要移动规则的分组ID"),
  }),
  execute: async (args) => {
    const { ruleId, ...updateData } = args;
    const result = await whistleClient.updateRule(ruleId, updateData);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "renameRule",
  description: "重命名规则",
  parameters: z.object({
    ruleId: z.string().describe("要重命名的规则ID"),
    newName: z.string().describe("规则的新名称"),
  }),
  execute: async (args) => {
    const result = await whistleClient.updateRule(args.ruleId, { name: args.newName });
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "deleteRule",
  description: "删除规则",
  parameters: z.object({
    ruleId: z.string().describe("要删除的规则ID"),
  }),
  execute: async (args) => {
    const result = await whistleClient.deleteRule(args.ruleId);
    return JSON.stringify(result);
  },
});

server.addTool({
  name: "toggleRule",
  description: "启用或禁用规则",
  parameters: z.object({
    ruleId: z.string().describe("要切换的规则ID"),
    enabled: z.boolean().describe("是否启用规则"),
  }),
  execute: async (args) => {
    const result = await whistleClient.toggleRule(args.ruleId, args.enabled);
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

// 启动服务器
server.start({
  transportType: "stdio",
});