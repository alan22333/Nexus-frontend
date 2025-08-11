'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { postApi } from '../../../services/postApi';
import { useAuth } from '../../../context/AuthContext';

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 加载帖子数据
  useEffect(() => {
    // 如果认证状态还在加载中，不执行任何操作
    if (authLoading) {
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await postApi.getPostById(id);
        if (response.code === 0 && response.data) {
          const postData = response.data;
          setPost(postData);
          setTitle(postData.title || '');
          setContent(postData.content || '');
          setTags(postData.tags ? postData.tags.join(', ') : '');
          
          // 检查权限 - 统一使用ID字段
          const userId = user.id || user.ID;
          const authorId = postData.author.id || postData.author.ID;
          if (!user || userId !== authorId) {
            setError('您没有权限编辑此帖子');
            return;
          }
        } else {
          setError('帖子不存在');
        }
      } catch (err) {
        setError('加载帖子失败：' + (err.message || '网络错误'));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    } else {
      setError('请先登录');
      setLoading(false);
    }
  }, [id, user, authLoading]);

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空');
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const response = await postApi.updatePost(id, {
        title: title.trim(),
        content: content.trim(),
        tags: tagsArray
      });
      
      if (response.code === 0) {
        alert('帖子更新成功');
        router.push(`/post/${id}`);
      } else {
        alert('更新失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to update post:', err);
      alert('更新失败：' + (err.message || '网络错误，请稍后重试'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <p className="text-center">Loading...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            返回
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">编辑帖子</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                标题 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入帖子标题"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                内容 * (支持 Markdown 格式)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入帖子内容，支持 Markdown 格式"
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                标签 (用逗号分隔)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：技术, 讨论, 分享"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '更新中...' : '更新帖子'}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}