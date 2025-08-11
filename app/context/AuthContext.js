'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// 创建认证上下文
const AuthContext = createContext();

// 认证提供器组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化时从localStorage加载用户信息
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.warn('Failed to parse stored user data:', e);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    } catch (e) {
      console.warn('Failed to access localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 登录函数
  const login = (userData, token) => {
    setUser(userData);
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    } catch (e) {
      console.warn('Failed to save user data to localStorage:', e);
    }
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (e) {
      console.warn('Failed to remove user data from localStorage:', e);
    }
  };

  // 获取当前认证token
  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      console.warn('Failed to get token from localStorage:', e);
      return null;
    }
  };

  // 更新用户信息
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    try {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Failed to update user data in localStorage:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      getToken, 
      setUser: updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义hook，用于在组件中使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}