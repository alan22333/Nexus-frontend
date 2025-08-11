'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postApi } from '../services/postApi';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post, onUpdate, isDetailPage = false }) {
  const { user } = useAuth();
  const router = useRouter();
  // 处理后端返回的ID字段（大写）和前端使用的id字段（小写）的差异
  const postId = post.id || post.ID;
  const [liked, setLiked] = useState(post.liked || false);
  const [favorited, setFavorited] = useState(post.favorited || false);
  const [likesCount, setLikesCount] = useState(post.like_count || 0);
  const [favoritesCount, setFavoritesCount] = useState(post.favorite_count || 0);
  
  // 处理点赞/取消点赞
  const handleLike = async (e) => {
    e.preventDefault(); // 防止触发Link导航
    if (!user) {
      if (isDetailPage) {
        alert('请先登录后再点赞');
      } else {
        // 首页：跳转到详情页
        router.push(`/post/${postId}`);
      }
      return;
    }

    // 如果在首页且已登录，跳转到详情页
    if (!isDetailPage) {
      router.push(`/post/${postId}`);
      return;
    }

    try {
      // 后端使用POST切换点赞状态
      const response = await postApi.likePost(postId);
      
      if (response.code === 0) {
        // 根据后端返回的数据更新状态
        if (response.data) {
          setLiked(response.data.liked || false);
          setLikesCount(response.data.like_count || likesCount);
          // 通知父组件更新
          if (onUpdate) {
            onUpdate(postId, { liked: response.data.liked, like_count: response.data.like_count });
          }
        } else {
          // 如果没有返回具体数据，则切换状态
          const newLiked = !liked;
          const newLikesCount = liked ? likesCount - 1 : likesCount + 1;
          setLiked(newLiked);
          setLikesCount(newLikesCount);
          // 通知父组件更新
          if (onUpdate) {
            onUpdate(postId, { liked: newLiked, like_count: newLikesCount });
          }
        }
      } else {
        alert('操作失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to like/unlike post:', err);
      alert('操作失败：' + (err.message || '网络错误，请稍后重试'));
    }
  };

  // 处理收藏/取消收藏
  const handleFavorite = async (e) => {
    e.preventDefault(); // 防止触发Link导航
    if (!user) {
      if (isDetailPage) {
        alert('请先登录后再收藏');
      } else {
        // 首页：跳转到详情页
        router.push(`/post/${postId}`);
      }
      return;
    }

    // 如果在首页且已登录，跳转到详情页
    if (!isDetailPage) {
      router.push(`/post/${postId}`);
      return;
    }

    try {
      // 后端使用POST切换收藏状态
      const response = await postApi.favoritePost(postId);
      
      if (response.code === 0) {
        // 根据后端返回的数据更新状态
        if (response.data && typeof response.data.favorited !== 'undefined') {
          setFavorited(response.data.favorited);
          if (typeof response.data.favorite_count !== 'undefined') {
            setFavoritesCount(response.data.favorite_count);
          }
          // 通知父组件更新
          if (onUpdate) {
            onUpdate(postId, { favorited: response.data.favorited, favorite_count: response.data.favorite_count });
          }
        } else {
          // 如果没有返回具体数据，则切换状态
          const newFavorited = !favorited;
          setFavorited(newFavorited);
          setFavoritesCount(prev => newFavorited ? prev + 1 : prev - 1);
          // 通知父组件更新
          if (onUpdate) {
            onUpdate(postId, { favorited: newFavorited, favorite_count: newFavorited ? favoritesCount + 1 : favoritesCount - 1 });
          }
        }
      } else {
        alert('操作失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to favorite/unfavorite post:', err);
      alert('操作失败：' + (err.message || '网络错误，请稍后重试'));
    }
  };
  
  return (
    <div className="neumorphism-card p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <Link href={`/post/${postId}`} className="block group">
        <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">{post.title}</h2>
      </Link>
      <div className="text-gray-600 mb-4 line-clamp-3 overflow-hidden leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // 简化组件，只保留基本格式
            h1: ({children}) => <span className="font-bold">{children}</span>,
            h2: ({children}) => <span className="font-bold">{children}</span>,
            h3: ({children}) => <span className="font-bold">{children}</span>,
            p: ({children}) => <span>{children}</span>,
            strong: ({children}) => <strong>{children}</strong>,
            em: ({children}) => <em>{children}</em>,
            code: ({children}) => <code className="neumorphism-inset px-2 py-1 rounded text-sm">{children}</code>,
          }}
        >
          {post.content && post.content.length > 150 ? post.content.substring(0, 150) + '...' : (post.content || '')}
        </ReactMarkdown>
      </div>
      
      {/* 标签 */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => {
            const tagText = typeof tag === 'string' ? tag : (tag.name || String(tag));
            return (
              <span 
                key={`${postId}-tag-${tagText}-${index}`}
                className="neumorphism-tag px-3 py-1 text-xs font-medium text-gray-600 transition-all duration-200 hover:text-blue-600"
              >
                {tagText}
              </span>
            );
          })}
        </div>
      )}
      
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span className="font-medium">By: <span className="text-gray-700">{post.author.username}</span></span>
        <span>{post.created_at || post.createdAt || post.CreatedAt ? new Date(post.created_at || post.createdAt || post.CreatedAt).toLocaleDateString() : 'Unknown date'}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleLike}
            className={`neumorphism-button-small flex items-center space-x-2 px-3 py-2 transition-all duration-200 ${
              liked 
                ? 'text-red-500 shadow-inner' 
                : 'text-gray-600 hover:text-red-500'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!user}
          >
            <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">{likesCount}</span>
          </button>
          
          <button 
            onClick={handleFavorite}
            className={`neumorphism-button-small flex items-center space-x-2 px-3 py-2 transition-all duration-200 ${
              favorited 
                ? 'text-yellow-500 shadow-inner' 
                : 'text-gray-600 hover:text-yellow-500'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!user}
          >
            <svg className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-sm">{favoritesCount}</span>
          </button>
          
          <div className="neumorphism-button-small flex items-center space-x-2 px-3 py-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">{post.comment_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}