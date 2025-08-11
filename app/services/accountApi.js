// 用户账户相关API服务
import { API_BASE_URL } from './api';

// 获取认证头部
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 通用请求函数
async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.msg || 'Request failed');
  }

  return response.json();
}

// 账户相关API
const accountApi = {
  // 获取个人信息
  getProfile: () => {
    return request('/api/v1/me/', {
      method: 'GET',
    });
  },

  // 更新个人信息
  updateProfile: (profileData) => {
    return request('/api/v1/me/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // 上传头像
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/me/avatar`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.msg || 'Failed to upload avatar');
    }

    return response.json();
  },
};

export default accountApi;