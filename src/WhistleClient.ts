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
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-0`); // Generate a clientId similar to the example
    formData.append("name", ruleName);
    formData.append("value", ruleValue);
    formData.append("selected", "true");
    formData.append("active", "true");
    formData.append("key", `w-reactkey-${Math.floor(Math.random() * 1000)}`); // Generate a random key
    formData.append("hide", "false");
    formData.append("changed", "true");

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/select`,
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
    // 根据ruleName去查询ruleContent
    const ruleContent = await this.getRules();

    if (!ruleContent) {
      return Promise.reject("No rules found");
    }

    const lowerCaseRuleName = ruleName.toLowerCase();
    let ruleContentToUpdate = null;

    if (lowerCaseRuleName === "default") {
      ruleContentToUpdate = ruleContent.defaultRules;
    } else {
      ruleContentToUpdate = ruleContent.list.find(
        (rule: any) => rule.name === ruleName
      ).data;
    }

    if (ruleContentToUpdate) {
      const formData = new URLSearchParams();
      formData.append("clientId", `${Date.now()}-0`); // Generate a clientId similar to the example
      formData.append("name", ruleName);
      formData.append("value", ruleContentToUpdate);
      formData.append("selected", "true");
      formData.append("active", "true");
      formData.append("key", `w-reactkey-${Math.floor(Math.random() * 1000)}`); // Generate a random key
      formData.append("hide", "false");
      formData.append("changed", "true");

      const response = await axios.post(
        `${this.baseUrl}/cgi-bin/rules/select`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    }

    return Promise.reject(`Rule with name ${ruleName} not found`);
  }

  /**
   * 禁用规则
   * @param ruleName 规则名称
   * @returns
   */
  async unselectRule(ruleName: string): Promise<any> {
    // 根据ruleName去查询ruleContent
    const ruleContent = await this.getRules();

    if (!ruleContent) {
      return Promise.reject("No rules found");
    }

    const lowerCaseRuleName = ruleName.toLowerCase();
    let ruleContentToUpdate = null;

    if (lowerCaseRuleName === "default") {
      ruleContentToUpdate = ruleContent.defaultRules;
    } else {
      ruleContentToUpdate = ruleContent.list.find(
        (rule: any) => rule.name === ruleName
      ).data;
    }

    if (ruleContentToUpdate) {
      const formData = new URLSearchParams();
      formData.append("clientId", `${Date.now()}-0`); // Generate a clientId similar to the example
      formData.append("name", ruleName);
      formData.append("value", ruleContentToUpdate);
      formData.append("selected", "true");
      formData.append("active", "true");
      formData.append("key", `w-reactkey-${Math.floor(Math.random() * 1000)}`); // Generate a random key
      formData.append("hide", "false");
      formData.append("changed", "true");

      const response = await axios.post(
        `${this.baseUrl}/cgi-bin/rules/unselect`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    }

    return Promise.reject(`Rule with name ${ruleName} not found`);
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
