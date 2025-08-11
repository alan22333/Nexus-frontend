// 帖子相关API服务

const API_BASE_URL = 'http://localhost:8080';

// 通用请求函数
async function request(url, options = {}) {
  // 从localStorage获取token
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.msg || 'Request failed');
  }

  return response.json();
}

// 帖子相关API
export const postApi = {
  // 获取帖子列表
  getPosts: (page = 1, limit = 10, tag = '') => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('size', limit);
    if (tag) queryParams.append('tag', tag);
    return request(`/api/v1/posts/?${queryParams.toString()}`);
  },

  // 获取热门帖子列表
  getPopularPosts: (limit = 10) => {
    return request(`/api/v1/posts/popular?limit=${limit}`);
  },

  // 获取单个帖子详情
  getPostById: (postId) => {
    return request(`/api/v1/posts/${postId}`);
  },

  // 创建新帖子
  createPost: (title, content, tags = []) => {
    return request('/api/v1/posts/', {
      method: 'POST',
      body: JSON.stringify({ title, content, tags }),
    });
  },

  // 更新帖子
  updatePost: (postId, postData) => {
    return request(`/api/v1/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  // 删除帖子
  deletePost: (postId) => {
    return request(`/api/v1/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  // 点赞帖子
  likePost: (postId) => {
    return request(`/api/v1/posts/${postId}/like/`, {
      method: 'POST',
    });
  },

  // 取消点赞
  unlikePost: (postId) => {
    return request(`/api/v1/posts/${postId}/like/`, {
      method: 'DELETE',
    });
  },

  // 收藏帖子
  favoritePost: (postId) => {
    return request(`/api/v1/posts/${postId}/favorite/`, {
      method: 'POST',
    });
  },

  // 取消收藏
  unfavoritePost: (postId) => {
    return request(`/api/v1/posts/${postId}/favorite/`, {
      method: 'DELETE',
    });
  },

  // 获取帖子评论
  getComments: (postId, page = 1, limit = 10) => {
    return request(`/api/v1/posts/${postId}/comments/?page=${page}&size=${limit}`);
  },

  // 添加评论
  addComment: (postId, content, parentId = null) => {
    const commentData = { content };
    if (parentId) commentData.parent_id = parentId;
    
    return request(`/api/v1/posts/${postId}/comments/`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
  
  // 删除评论
  deleteComment: (commentId) => {
    return request(`/api/v1/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
  
  // 获取所有标签
  getAllTags: (sortedBy = '') => {
    const queryParams = new URLSearchParams();
    if (sortedBy) queryParams.append('sortedBy', sortedBy);
    return request(`/api/v1/tags/?${queryParams.toString()}`);
  },

  // 获取用户对特定帖子的状态（点赞/收藏）
  getUserPostStatus: (postId) => {
    return request(`/api/v1/posts/${postId}/user-status`);
  },
};