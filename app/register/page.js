'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { userApi } from '../services/api';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 输入邮箱, 2: 验证码和其他信息
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理第一步提交
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 在开发阶段，使用模拟数据
      if (process.env.NODE_ENV === 'development' && false) { // 修改条件，尝试连接后端
        // 模拟发送验证码成功
        setStep(2);
        setSuccess('Verification code sent to your email (Mock: 123456)');
        return;
      }
      
      // 实际API调用（当后端准备好时使用）
      await userApi.register(email);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // 处理第二步提交
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 在开发阶段，使用模拟数据
      if (process.env.NODE_ENV === 'development' && false) { // 修改条件，尝试连接后端
        // 模拟验证码检查
        if (code === '123456' || true) { // 在开发模式下任何验证码都可以
          router.push('/login?registered=true');
        } else {
          setError('Invalid verification code');
        }
        return;
      }
      
      // 实际API调用（当后端准备好时使用）
      await userApi.verifyRegister(email, username, password, code);
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex justify-center items-center">
        <div className="w-full max-w-md p-6 border rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
          
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
              
              <p className="text-center">
                Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <label htmlFor="verification-code" className="block mb-1">Verification Code</label>
                <input
                  id="verification-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label htmlFor="username" className="block mb-1">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                {loading ? 'Registering...' : 'Register'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full p-2 border rounded"
              >
                Back
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}