'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';

export default function TestLogin() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    // 如果用户已登录，重定向到个人资料页面
    if (user) {
      router.push('/profile');
      return;
    }

    // 使用真实API进行登录
    const performLogin = async () => {
      try {
        console.log('Attempting real API login...');
        // 使用测试账号进行真实登录
        const response = await userApi.login('admin', '123456');
        console.log('Login response:', response);
        
        if (response.code === 0 && response.data) {
          // 使用真实的用户数据和token
          login(response.data.user, response.data.token);
          
          // 延迟跳转到个人资料页面
          setTimeout(() => {
            router.push('/profile');
          }, 1000);
        } else {
          setError(response.msg || '登录失败');
        }
      } catch (err) {
        console.error('Login failed:', err);
        setError(err.message || '登录失败');
      }
    };
    
    performLogin();
  }, [user, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {!error ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">正在使用真实API登录并跳转到个人资料页面...</p>
          </>
        ) : (
          <>
            <div className="text-red-500 text-xl mb-4">❌</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              重试
            </button>
          </>
        )}
      </div>
    </div>
  );
}