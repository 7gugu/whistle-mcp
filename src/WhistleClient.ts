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

  /**
   * 创建分组
   * @param name 分组名称
   * @returns
   */
  async createGroup(name: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("name", `\r${name}`);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/add`,
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

  /**
   * 删除分组
   * @param groupName 分组名称
   * @returns
   */
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

  /**
   * 移动规则到分组
   * @param ruleName 规则名称
   * @param groupName 分组名称
   * @returns
   */
  async moveRuleToGroup(ruleName: string, groupName: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("from", ruleName);
    formData.append("to", `\r${groupName}`); // Adding carriage return to denote a group
    formData.append("group", "false"); // Not moving a group, but a rule

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/move-to`,
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
   * 将规则从分组中移出（移动到顶层）
   * @param ruleName 规则名称
   * @returns
   */
  async moveRuleOutOfGroup(ruleName: string): Promise<any> {
    const rules = await this.getRules();
    const firstRuleName = rules.list[0].name;

    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("from", ruleName);
    formData.append("to", firstRuleName);
    formData.append("group", "false");

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/move-to`,
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
   * 获取所有的值&分组列表
   */
  async getAllValues(): Promise<any[]> {
    const timestamp = Date.now();
    const response = await axios.get(`${this.baseUrl}/cgi-bin/init`, {
      params: { _: timestamp },
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const { data } = response;
    const {
      values: { list },
    } = data;
    return list || [];
  }

  /**
   * 获取值列表（不包含 data 字段，避免数据量过大）
   * @returns 返回 [{index, name}] 格式的列表
   */
  async getValueList(): Promise<{ index: number, name: string }[]> {
    const list = await this.getAllValues();
    return list.map((item, index) => ({
      index: item.index !== undefined ? item.index : index,
      name: item.name,
    }));
  } 

  /**
   * 根据名称获取单个值的完整信息
   * @param name 值名称
   * @returns 返回完整的值信息，包含 index、name、data
   */
  async getValue(name: string): Promise<any> {
    const list = await this.getAllValues();
    const value = list.find((item) => item.name === name);
    if (!value) {
      throw new Error(`Value with name '${name}' not found`);
    }
    return value;
  }

  /**
   * 创建新值
   * @param name 值名称
   */
  async createValue(name: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("name", name);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/add`,
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
   * 创建值分组
   * @param name 分组名称
   * @returns
   */
  async createValueGroup(name: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("name", `\r${name}`);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/add`,
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
   * 更新值内容
   * @param name 值名称
   * @param value 新值内容
   * @returns
   */
  async updateValue(name: string, value: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("name", name);
    formData.append("value", value);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/add`,
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
   * 重命名值
   * @param name 值现有名称
   * @param newName 值新名称
   * @returns
   */
  async renameValue(name: string, newName: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-0`);
    formData.append("name", name);
    formData.append("newName", newName);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/rename`,
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
   * 重命名值分组
   * @param name 分组现有名称
   * @param newName 分组新名称
   * @returns
   */
  async renameValueGroup(name: string, newName: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("name", `\r${name}`);
    formData.append("newName", `\r${newName}`);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/rename`,
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
   * 删除值
   * @param name 值名称
   * @returns
   */
  async deleteValue(name: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-0`);
    formData.append("list[]", name);

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/remove`,
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
   * 删除值分组
   * @param name 分组名称
   * @returns
   */
  async deleteValueGroup(name: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("list[]", `\r${name}`); // Adding carriage return to denote a group
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/remove`,
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
   * 移动值到分组
   * @param name 值名称
   * @param groupName 分组名称
   * @returns
   */
  async moveValueToGroup(name: string, groupName: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("from", name);
    formData.append("to", `\r${groupName}`); // Adding carriage return to denote a group
    formData.append("group", "false"); // Not moving a group, but a value

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/move-to`,
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
   * 将值从分组中移出（移动到顶层）
   * @param name 值名称
   * @returns
   */
  async moveValueOutOfGroup(name: string): Promise<any> {
    const values = await this.getAllValues();
    const firstValueName = values[0].name;
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-1`);
    formData.append("from", name);
    formData.append("to", firstValueName);
    formData.append("group", "false");
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/values/move-to`,
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
   * 获取服务器状态
   * @returns Promise with the server status information
   */
  async getStatus(): Promise<any> {
    const timestamp = Date.now();
    const response = await axios.get(`${this.baseUrl}/cgi-bin/init`, {
      params: { _: timestamp },
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const { rules, values, ...restData } = response.data;
    return restData;
  }

  /**
   * 启用/禁用代理
   * @param enabled 是否启用代理
   * @returns 
   */
  async toggleProxy(enabled: boolean): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/cgi-bin/proxy/enable`, {
      enabled,
    });
    return response.data;
  }

  /**
   * 获取URL拦截信息
   * @param options 获取数据的选项
   * @returns 拦截的网络请求数据
   */
  async getInterceptInfo(
    options: {
      startTime?: string;
      count?: number;
      lastRowId?: string;
    } = {}
  ): Promise<any> {
    const timestamp = Date.now();
    const clientId = `${timestamp}-${Math.floor(Math.random() * 100)}`;

    const params = {
      clientId,
      startLogTime: -2,
      startSvrLogTime: -2,
      ids: "",
      startTime: options.startTime || `${timestamp}-000`,
      dumpCount: 0,
      lastRowId: options.lastRowId || options.startTime || `${timestamp}-000`,
      logId: "",
      count: options.count || 20,
      _: timestamp,
    };

    const response = await axios.get(`${this.baseUrl}/cgi-bin/get-data`, {
      params,
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    return response.data.data || [];
  }

  /**
   * 重放请求
   * @param options 重放请求的选项
   * @returns 重放请求的结果
   */
  async replayRequest(options: {
    useH2?: boolean; // 是否使用HTTP/2
    url: string; // 请求URL
    method?: string; // 请求方法，默认GET
    headers?: Record<string, string> | string; // 请求头，可以是对象或字符串
    body?: string | Record<string, any>; // 请求体
  }): Promise<any> {
    // 准备请求参数
    const formData = new URLSearchParams();

    // 是否使用HTTP/2
    formData.append("useH2", options.useH2 ? "true" : "");

    // 添加URL (必需)
    formData.append("url", options.url);

    // 添加请求方法
    formData.append("method", options.method || "GET");

    // 处理请求头
    if (options.headers) {
      let headerStr = "";
      if (typeof options.headers === "string") {
        headerStr = options.headers;
      } else {
        headerStr = Object.entries(options.headers)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\r\n");
      }
      formData.append("headers", headerStr);
    }

    // 处理请求体
    if (options.body) {
      if (typeof options.body === "string") {
        formData.append("body", options.body);
      } else {
        // 对象类型的请求体转为JSON字符串
        formData.append("body", JSON.stringify(options.body));
      }
    }

    // 发送重放请求到composer接口
    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/composer`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    return response.data;
  }

  /**
   * 启用/禁用HTTP拦截
   * @param enabled 是否启用HTTPS拦截
   * @returns 
   */
  async toggleHttpsInterception(enabled: boolean): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-${Math.floor(Math.random() * 100)}`);
    formData.append("interceptHttpsConnects", enabled ? "1" : "0");

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/intercept-https-connects`,
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
   * 启用/禁用多规则模式
   * @param enabled 是否启用多选规则
   * @returns 
   */
  async toggleMultiRuleMode(enabled: boolean): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-${Math.floor(Math.random() * 100)}`);
    formData.append("allowMultipleChoice", enabled ? "1" : "0");

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/rules/allow-multiple-choice`,
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
   * 启用/禁用HTTP2
   * @param enabled 是否启用HTTP2
   * @returns Promise with the response data
   */
  async toggleHttp2(enabled: boolean): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("clientId", `${Date.now()}-${Math.floor(Math.random() * 100)}`);
    formData.append("enableHttp2", enabled ? "1" : "0");

    const response = await axios.post(
      `${this.baseUrl}/cgi-bin/enable-http2`,
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
