// API服务，用于处理与后端的通信

export const API_BASE_URL = 'http://localhost:8080';

// 通用请求函数
async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const error = await response.json();
      errorMessage = error.msg || error.message || 'Request failed';
    } catch (e) {
      // 如果响应不是JSON格式，尝试获取文本内容
      try {
        const text = await response.text();
        errorMessage = text || `HTTP ${response.status}: ${response.statusText}`;
      } catch (textError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    }
    throw new Error(errorMessage);
  }

  // 处理成功响应但可能包含错误信息的情况
  const text = await response.text();
  let result;
  
  try {
    // 尝试直接解析JSON
    result = JSON.parse(text);
  } catch (e) {
     // 如果JSON解析失败，可能是多个JSON对象连在一起
     // 尝试匹配所有JSON对象，取最后一个（通常是最终的错误信息）
     const jsonMatches = text.match(/\{[^}]*\}/g);
     if (jsonMatches && jsonMatches.length > 0) {
       try {
         // 取最后一个JSON对象
         const lastJson = jsonMatches[jsonMatches.length - 1];
         result = JSON.parse(lastJson);
       } catch (parseError) {
         result = { code: -1, msg: text || 'Invalid response format', data: null };
       }
     } else {
       result = { code: -1, msg: text || 'Invalid response format', data: null };
     }
   }

  // 检查业务逻辑错误
  if (result.code && result.code !== 0) {
    throw new Error(result.msg || 'Request failed');
  }

  return result;
}

// 用户相关API
export const userApi = {
  // 注册请求
  register: (email) => {
    return request('/api/v1/users/register', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // 验证注册
  verifyRegister: (email, username, password, code) => {
    return request('/api/v1/users/verify-register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, code }),
    });
  },

  // 登录
  login: (identifier, password) => {
    return request('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  // 请求重置密码
  requestPasswordReset: (email) => {
    return request('/api/v1/users/password/reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // 验证重置密码
  verifyPasswordReset: (email, password, code) => {
    return request('/api/v1/users/password/verify-reset', {
      method: 'POST',
      body: JSON.stringify({ email, password, code }),
    });
  },
};