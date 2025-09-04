'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 检查URL参数，显示相应消息
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setMessage('Registration successful! Please login.');
    } else if (searchParams.get('reset') === 'true') {
      setMessage('Password reset successful! Please login with your new password.');
    }
  }, [searchParams]);

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 使用真实API进行登录
      const response = await userApi.login(identifier, password);
      if (response.code === 0 && response.data) {
        login(response.data.user, response.data.token);
        router.push('/');
      } else {
        setError(response.msg || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex justify-center items-center">
        <div className="w-full max-w-md p-6 border rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          
          {message && <p className="mb-4 p-2 bg-green-100 text-green-800 rounded">{message}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block mb-1">Email or Username</label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            {error && <p className="text-red-500">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="flex justify-between text-sm">
              <Link href="/register" className="text-blue-500">
                Register
              </Link>
              <Link href="/reset-password" className="text-blue-500">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}