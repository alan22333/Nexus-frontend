'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import { postApi } from '../services/postApi';
import { useAuth } from '../context/AuthContext';

// 动态导入Markdown编辑器，避免SSR问题
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

export default function CreatePost() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // 如果正在加载认证状态或用户未登录，显示加载状态
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 处理标签
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // 调用后端API创建帖子
      const response = await postApi.createPost(title, content, tagsArray);
      console.log('Backend response:', response);
      
      if (response.code === 0 && response.data) {
        // 检查响应数据结构
        console.log('Response data:', response.data);
        
        // 根据实际的响应结构进行跳转
        if (response.data.post && response.data.post.id) {
          router.push(`/post/${response.data.post.id}`);
        } else if (response.data.id) {
          // 如果直接在data中有id
          router.push(`/post/${response.data.id}`);
        } else {
          // 如果没有id，跳转到首页
          console.warn('No post ID found in response, redirecting to home');
          router.push('/');
        }
      } else {
        setError(response.msg || 'Failed to create post');
      }
    } catch (err) {
      console.error('Create post error:', err);
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter post title"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block mb-1">Content (Markdown supported)</label>
            <div data-color-mode="light">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                preview="edit"
                height={400}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="tags" className="block mb-1">Tags (comma separated)</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="例如：技术, 讨论, 分享"
            />
          </div>
          
          {error && <p className="text-red-500">{error}</p>}
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}