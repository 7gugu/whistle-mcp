import axios from "axios";

// Whistle API 客户端类
export class WhistleClient {

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
  async createRule(
    name: string,
    content: string,
    groupId?: string
  ): Promise<any> {
    const data = { name, content, groupId, enabled: true };
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/add`,
      data
    );
    return response.data;
  }

  // 更新规则
  async updateRule(
    ruleId: string,
    data: { name?: string; content?: string; groupId?: string }
  ): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/rules/update`, {
      id: ruleId,
      ...data,
    });
    return response.data;
  }

  // 删除规则
  async deleteRule(ruleName: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/rules/remove`, {
      "list%5B%5D": ruleName,
    });
    return response.data;
  }

  // 启用/禁用规则
  async toggleRule(ruleId: string, enabled: boolean): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/rules/enable`, {
      id: ruleId,
      enabled,
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
    const response = await axios.post(`${this.baseUrl}/cgi-bin/groups/add`, {
      name,
    });
    return response.data;
  }

  // 更新分组
  async updateGroup(groupId: string, name: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/groups/update`, {
      id: groupId,
      name,
    });
    return response.data;
  }

  // 删除分组
  async deleteGroup(groupId: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/groups/remove`, {
      id: groupId,
    });
    return response.data;
  }

  // 获取服务器状态
  async getStatus(): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/cgi-bin/server-info`);
    return response.data;
  }

  // 启用/禁用代理
  async toggleProxy(enabled: boolean): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/proxy/enable`, {
      enabled,
    });
    return response.data;
  }

  // 获取URL拦截信息
  async getInterceptInfo(url: string): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/cgi-bin/intercept/info`, {
      params: { url },
    });
    return response.data;
  }

  // 启用/禁用HTTP拦截
  async toggleHttpInterception(enabled: boolean): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/intercept/enable`,
      { enabled }
    );
    return response.data;
  }

  // 启用/禁用多规则模式
  async toggleMultiRuleMode(enabled: boolean): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/settings/multi-rule-mode`,
      { enabled }
    );
    return response.data;
  }

  // 重放请求
  async replayRequest(requestId: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/replay`, {
      id: requestId,
    });
    return response.data;
  }
}
