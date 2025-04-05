import axios from "axios";

// Whistle API 客户端类
export class WhistleClient {
  private baseUrl: string;

  constructor(host: string = "localhost", port: number = 8899) {
    this.baseUrl = `http://${host}:${port}`;
  }

  /**
   * 获取所有规则
   * @returns
   */
  async getRules(): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/cgi-bin/rules/list`);
    return response.data;
  }

  /**
   * 创建新规则
   * @param name 规则名称
   * @returns
   */
  async createRule(name: string): Promise<any> {
    const data = { name };
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/add`,
      data
    );
    return response.data;
  }

  /**
   * 更新规则内容
   * @param ruleName 规则名称
   * @param ruleValue 规则内容
   * @returns
   */
  async updateRule(ruleName: string, ruleValue: string): Promise<any> {
    const isDefaultRule = ruleName.toLowerCase() === "default";
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-0`);
    formData.append("name", ruleName);
    formData.append("value", ruleValue);
    formData.append("selected", "true");
    formData.append("active", "true");
    formData.append("key", `w-reactkey-${Math.floor(Math.random() * 1000)}`); // Generate a random key
    formData.append("hide", "false");
    formData.append("changed", "true");

    const endpoint = isDefaultRule
      ? `${this.baseUrl}/cgi-bin/rules/enable-default`
      : `${this.baseUrl}/cgi-bin/rules/select`;

    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  }

  /**
   * 重命名规则
   * @param ruleName 规则现有名称
   * @param newName 规则新名称
   * @returns
   */
  async renameRule(ruleName: string, newName: string): Promise<any> {
    // Check if trying to rename the default rule
    if (ruleName.toLowerCase() === "default") {
      throw new Error("Cannot rename the 'default' rule");
    }
    
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("name", ruleName);
    formData.append("newName", newName);
    
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/rename`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    
    return response.data;
  }

  /**
   * 删除规则
   * @param ruleName 规则名称
   * @returns
   */
  async deleteRule(ruleName: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("list[]", ruleName);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/remove`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  }

  /**
   * 启用规则
   * @param ruleName 规则名称
   * @returns
   */
  async selectRule(ruleName: string): Promise<any> {
    const rules = await this.getRules();

    if (!rules) {
      throw new Error("No rules found");
    }

    const isDefaultRule = ruleName.toLowerCase() === "default";
    let ruleContent;

    if (isDefaultRule) {
      ruleContent = rules.defaultRules;
    } else {
      const rule = rules.list.find((rule: any) => rule.name === ruleName);
      if (!rule) {
        throw new Error(`Rule with name '${ruleName}' not found`);
      }
      ruleContent = rule.data;
    }

    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-0`);
    formData.append("name", ruleName);
    formData.append("value", ruleContent);
    formData.append("selected", "true");
    formData.append("active", "true");
    formData.append("key", `w-reactkey-${Math.floor(Math.random() * 1000)}`);
    formData.append("hide", "false");
    formData.append("changed", "true");

    const endpoint = isDefaultRule
      ? `${this.baseUrl}/cgi-bin/rules/enable-default`
      : `${this.baseUrl}/cgi-bin/rules/select`;

    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  }

  /**
   * 禁用规则
   * @param ruleName 规则名称
   * @returns
   */
  async unselectRule(ruleName: string): Promise<any> {
    const rules = await this.getRules();

    if (!rules) {
      throw new Error("No rules found");
    }

    const isDefaultRule = ruleName.toLowerCase() === "default";
    let ruleContent;

    if (isDefaultRule) {
      ruleContent = rules.defaultRules;
    } else {
      const rule = rules.list.find((rule: any) => rule.name === ruleName);
      if (!rule) {
        throw new Error(`Rule with name '${ruleName}' not found`);
      }
      ruleContent = rule.data;
    }

    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-0`);
    formData.append("name", ruleName);
    formData.append("value", ruleContent);
    formData.append("selected", "true");
    formData.append("active", "true");
    formData.append("key", `w-reactkey-${Math.floor(Math.random() * 1000)}`);
    formData.append("hide", "false");
    formData.append("changed", "true");

    const endpoint = isDefaultRule
      ? `${this.baseUrl}/cgi-bin/rules/disable-default`
      : `${this.baseUrl}/cgi-bin/rules/unselect`;

    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

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

  /**
   * 重命名分组
   * @param groupName 分组现有名称
   * @param newName 分组新名称
   * @returns 
   */
  async renameGroup(groupName: string, newName: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("name", `\r${groupName}`);
    formData.append("newName", `\r${newName}`);
    
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/rename`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    
    return response.data;
  }

  // 删除分组
  async deleteGroup(groupName: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("list[]", `\r${groupName}`);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/remove`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
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
      `${this.baseUrl}/cgi-bin/rules/allow-multiple-choice`,
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

  /**
   * 禁用所有规则
   * @returns Promise with the response data
   */
  async disableAllRules(disabledAllRules: boolean): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("disabledAllRules", disabledAllRules ? "1" : "0");

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/disable-all-rules`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  }
}
