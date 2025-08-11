'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Navbar from '../../components/Navbar';
import { postApi } from '../../services/postApi';
import { useAuth } from '../../context/AuthContext';

// 导入代码高亮样式
import 'highlight.js/styles/github.css';

// 构建评论树形结构的辅助函数
function buildCommentTree(flatComments) {
  const commentMap = new Map();
  const rootComments = [];
  
  // 首先创建所有评论的映射
  flatComments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });
  
  // 然后构建父子关系
  flatComments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id);
    if (comment.parent_id && commentMap.has(comment.parent_id)) {
      // 这是一个回复，添加到父评论的replies数组中
      const parentComment = commentMap.get(comment.parent_id);
      parentComment.replies.push(commentWithReplies);
    } else {
      // 这是一个根评论
      rootComments.push(commentWithReplies);
    }
  });
  
  return rootComments;
}

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [replyTo, setReplyTo] = useState(null); // 回复的评论ID
  const [replyToUsername, setReplyToUsername] = useState(''); // 回复的用户名

  // 加载帖子详情
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        // 尝试连接后端，不再强制使用模拟数据
        if (false) { // 禁用模拟数据，直接使用后端API
          // 根据ID提供不同的模拟帖子
          if (id === '1') {
            setPost({
              id: id,
              title: 'Welcome to Nexus Forum',
              content: 'This is a sample post to demonstrate the forum functionality. Here you can see how posts are displayed in detail view. Users can read the full content, like the post, and add comments below.',
              author: { username: 'admin', id: 1 },
              createdAt: new Date().toISOString(),
              likes: 5,
              tags: ['welcome', 'introduction'],
            });
          } else if (id === '2') {
            setPost({
              id: id,
              title: 'Getting Started with Nexus',
              content: 'Learn how to use Nexus Forum and participate in discussions. This platform allows you to create posts, comment on others\'posts, and like content that you find valuable.',
              author: { username: 'moderator', id: 2 },
              createdAt: new Date().toISOString(),
              likes: 3,
              tags: ['guide', 'tutorial'],
            });
          } else if (id === '3') {
            setPost({
              id: id,
              title: 'Forum Features Overview',
              content: 'Explore all the features available in our forum platform. We offer user registration, post creation, commenting, and like functionality. Future updates will include categories, tags, and more advanced features.',
              author: { username: 'admin', id: 1 },
              createdAt: new Date().toISOString(),
              likes: 7,
              tags: ['features', 'overview'],
            });
          } else {
            // 默认帖子（当ID不匹配时）
            setPost({
              id: id,
              title: 'Sample Post #' + id,
              content: 'This is a sample post content. It demonstrates how a post would look like in the forum.',
              author: { username: 'user', id: parseInt(id) || 999 },
              createdAt: new Date().toISOString(),
              likes: Math.floor(Math.random() * 10),
              tags: ['sample', 'misc'],
            });
          }
          return;
        }
        
        // 实际API调用（当后端准备好时使用）
        const response = await postApi.getPostById(id);
        if (response.code === 0 && response.data) {
          // 根据Go controller，GetPost直接返回帖子对象，不是包装在post字段中
          setPost(response.data);
          // 不在这里设置用户状态，因为getPostById返回的可能不是当前用户的状态
          // 用户状态将在单独的useEffect中通过getUserPostStatus获取
          setLikesCount(response.data.like_count || 0);
          setFavoritesCount(response.data.favorite_count || 0);
        } else {
          setError(response.msg || 'Failed to load post');
        }
      } catch (err) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

  // 处理编辑帖子
  const handleEdit = () => {
    // 跳转到编辑页面
    window.location.href = `/post/${id}/edit`;
  };

  // 处理删除帖子
  const handleDelete = async () => {
    if (!confirm('确定要删除这篇帖子吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await postApi.deletePost(id);
      if (response.code === 0) {
        alert('帖子删除成功');
        window.location.href = '/';
      } else {
        alert('删除失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('删除失败：' + (err.message || '网络错误，请稍后重试'));
    }
  };

    fetchPostDetail();
  }, [id]);

  // 获取用户对帖子的状态（点赞/收藏）
  useEffect(() => {
    const fetchUserStatus = async () => {
      if (user && post) {
        try {
          const response = await postApi.getUserPostStatus(post.ID);
          if (response.code === 0) {
            setLiked(response.data.liked);
            setFavorited(response.data.favorited);
          }
        } catch (err) {
          console.error('Failed to fetch user status:', err);
          // 如果获取用户状态失败，设置为默认状态（未点赞/未收藏）
          setLiked(false);
          setFavorited(false);
        }
      } else if (post) {
        // 用户未登录时，明确设置为未点赞/未收藏状态
        setLiked(false);
        setFavorited(false);
      }
    };
    
    fetchUserStatus();
  }, [user, post]);

  // 加载评论
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      try {
        // 尝试连接后端，不再强制使用模拟数据
        if (process.env.NODE_ENV === 'development' && false) { // 修改条件，尝试连接后端
          // 根据帖子ID提供不同的模拟评论
          if (id === '1') {
            setComments([
              {
                id: 1,
                content: 'Great introduction to the forum!',
                author: { username: 'user1', id: 2 },
                createdAt: new Date(Date.now() - 86400000).toISOString(), // 1天前
                parent_id: null,
                replies: [],
              },
              {
                id: 2,
                content: 'Looking forward to participating in discussions here.',
                author: { username: 'user2', id: 3 },
                createdAt: new Date(Date.now() - 43200000).toISOString(), // 12小时前
                parent_id: null,
                replies: [
                  {
                    id: 8,
                    content: 'Welcome to the community!',
                    author: { username: 'admin', id: 1 },
                    createdAt: new Date(Date.now() - 21600000).toISOString(), // 6小时前
                    parent_id: 2,
                  }
                ],
              },
            ]);
          } else if (id === '2') {
            setComments([
              {
                id: 3,
                content: 'This is very helpful for newcomers!',
                author: { username: 'user3', id: 4 },
                createdAt: new Date(Date.now() - 21600000).toISOString(), // 6小时前
                parent_id: null,
                replies: [],
              },
            ]);
          } else if (id === '3') {
            setComments([
              {
                id: 4,
                content: 'I love the features you described!',
                author: { username: 'user1', id: 2 },
                createdAt: new Date(Date.now() - 7200000).toISOString(), // 2小时前
                parent_id: null,
                replies: [],
              },
              {
                id: 5,
                content: 'When will categories be implemented?',
                author: { username: 'user4', id: 5 },
                createdAt: new Date(Date.now() - 3600000).toISOString(), // 1小时前
                parent_id: null,
                replies: [
                  {
                    id: 9,
                    content: 'We plan to add categories in the next update!',
                    author: { username: 'admin', id: 1 },
                    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30分钟前
                    parent_id: 5,
                  }
                ],
              },
              {
                id: 6,
                content: 'Can\'t wait for the upcoming features!',
                author: { username: 'user2', id: 3 },
                createdAt: new Date(Date.now() - 1800000).toISOString(), // 30分钟前
                parent_id: null,
                replies: [],
              },
              {
                id: 7,
                content: 'The UI is very clean and intuitive.',
                author: { username: 'user5', id: 6 },
                createdAt: new Date(Date.now() - 900000).toISOString(), // 15分钟前
                parent_id: null,
                replies: [],
              },
            ]);
          } else {
            // 默认评论（当ID不匹配时）
            setComments([
              {
                id: 1,
                content: 'Interesting post!',
                author: { username: 'user1', id: 2 },
                createdAt: new Date(Date.now() - 3600000).toISOString(), // 1小时前
                parent_id: null,
                replies: [],
              },
              {
                id: 2,
                content: 'Thanks for sharing.',
                author: { username: 'user2', id: 3 },
                createdAt: new Date(Date.now() - 1800000).toISOString(), // 30分钟前
                parent_id: null,
                replies: [],
              },
            ]);
          }
          return;
        }
        
        // 实际API调用（当后端准备好时使用）
        const response = await postApi.getComments(id);
        if (response.code === 0 && response.data) {
          // 根据Go controller，ListComment返回Comments字段（大写C）
          const flatComments = response.data.Comments || response.data.comments || [];
          // 构建评论树形结构
          const commentTree = buildCommentTree(flatComments);
          setComments(commentTree);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    };

    fetchComments();
  }, [id]);

  // 提交评论
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      // 实际API调用（当后端准备好时使用）
      const response = await postApi.addComment(id, commentText, replyTo);
      if (response.code === 0 && response.data) {
        // 检查返回的数据结构，可能是comment或直接是评论数据
        const newComment = response.data.comment || response.data;
        
        if (!newComment) {
          console.error('No comment data in response:', response);
          alert('评论提交失败：服务器返回数据格式错误');
          return;
        }
        
        // 如果是回复评论
        if (replyTo) {
          setComments(prev => prev.map(comment => {
            if (comment.id === replyTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), { ...newComment, replies: [] }]
              };
            }
            // 递归查找嵌套的回复
            if (comment.replies && comment.replies.length > 0) {
              const updatedReplies = comment.replies.map(reply => {
                if (reply.id === replyTo) {
                  return {
                    ...reply,
                    replies: [...(reply.replies || []), { ...newComment, replies: [] }]
                  };
                }
                return reply;
              });
              if (updatedReplies !== comment.replies) {
                return { ...comment, replies: updatedReplies };
              }
            }
            return comment;
          }));
        } else {
          // 如果是新评论，确保有replies数组
          setComments(prev => [{ ...newComment, replies: [] }, ...prev]);
        }
        setCommentText('');
        setReplyTo(null);
        setReplyToUsername('');
      } else {
        console.error('API response error:', response);
        alert('评论提交失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('评论提交失败：' + (err.message || '网络错误，请稍后重试'));
      // 在开发阶段，模拟添加评论
      if (process.env.NODE_ENV === 'development' && false) { // 修改条件，尝试连接后端
        const newComment = {
          id: Date.now(),
          content: commentText,
          author: { username: user?.username || 'current_user', id: user?.id || 999 },
          createdAt: new Date().toISOString(),
          parent_id: replyTo,
          replies: [],
        };
        
        // 如果是回复评论
        if (replyTo) {
          setComments(prev => prev.map(comment => {
            if (comment.id === replyTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment]
              };
            }
            return comment;
          }));
        } else {
          // 如果是新评论
          setComments(prev => [newComment, ...prev]);
        }
        
        setCommentText('');
        setReplyTo(null);
        setReplyToUsername('');
      }
    } finally {
      setCommentLoading(false);
    }
  };
  
  // 处理回复评论
  const handleReply = (commentId, username) => {
    setReplyTo(commentId);
    setReplyToUsername(username);
    // 聚焦评论输入框
    document.getElementById('comment-input').focus();
  };
  
  // 取消回复
  const cancelReply = () => {
    setReplyTo(null);
    setReplyToUsername('');
  };

  // 删除评论
  const handleDeleteComment = async (commentId, isReply = false, parentId = null) => {
    if (!confirm('确定要删除这条评论吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await postApi.deleteComment(commentId);
      if (response.code === 0) {
        if (isReply && parentId) {
          // 删除回复
          setComments(prev => prev.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== commentId)
              };
            }
            return comment;
          }));
        } else {
          // 删除主评论
          setComments(prev => prev.filter(comment => comment.id !== commentId));
        }
        alert('评论删除成功');
      } else {
        alert('删除失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('删除失败：' + (err.message || '网络错误，请稍后重试'));
    }
  };

  // 处理点赞/取消点赞
  const handleLike = async () => {
    if (!user) {
      alert('请先登录后再点赞');
      return;
    }

    try {
      // 后端使用POST切换点赞状态
      const response = await postApi.likePost(id);
      
      if (response.code === 0) {
        // 根据后端返回的数据更新状态
        if (response.data && typeof response.data.liked !== 'undefined') {
          setLiked(response.data.liked);
          if (typeof response.data.like_count !== 'undefined') {
            setLikesCount(response.data.like_count);
          }
        } else {
          // 如果没有返回具体数据，则切换状态
          const newLiked = !liked;
          setLiked(newLiked);
          const newCount = newLiked ? likesCount + 1 : likesCount - 1;
          setLikesCount(newCount);
        }
      } else {
        alert('操作失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to like/unlike post:', err);
      alert('操作失败：' + (err.message || '网络错误，请稍后重试'));
      // 在开发阶段，模拟点赞/取消点赞
      if (process.env.NODE_ENV === 'development') {
        setPost(prev => ({
          ...prev,
          likes: liked ? prev.likes - 1 : prev.likes + 1,
        }));
        setLiked(!liked);
      }
    }
  };

  // 处理收藏/取消收藏
  const handleFavorite = async () => {
    if (!user) {
      alert('请先登录后再收藏');
      return;
    }

    try {
      // 后端使用POST切换收藏状态
      const response = await postApi.favoritePost(id);
      
      if (response.code === 0) {
        // 根据后端返回的数据更新状态
        if (response.data && typeof response.data.favorited !== 'undefined') {
          setFavorited(response.data.favorited);
          if (typeof response.data.favorite_count !== 'undefined') {
            setFavoritesCount(response.data.favorite_count);
          }
        } else {
          // 如果没有返回具体数据，则切换状态
          const newFavorited = !favorited;
          setFavorited(newFavorited);
          setFavoritesCount(prev => newFavorited ? prev + 1 : prev - 1);
        }
      } else {
        alert('操作失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to favorite/unfavorite post:', err);
      alert('操作失败：' + (err.message || '网络错误，请稍后重试'));
      // 在开发阶段，模拟收藏/取消收藏
      if (process.env.NODE_ENV === 'development') {
        setFavorited(!favorited);
      }
    }
  };

  // 处理编辑帖子
  const handleEdit = () => {
    window.location.href = `/post/${id}/edit`;
  };

  // 处理删除帖子
  const handleDelete = async () => {
    if (!confirm('确定要删除这篇帖子吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await postApi.deletePost(id);
      if (response.code === 0) {
        alert('帖子删除成功');
        window.location.href = '/';
      } else {
        alert('删除失败：' + (response.msg || '未知错误'));
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('删除失败：' + (err.message || '网络错误，请稍后重试'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <p className="text-center">Loading post...</p>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <p className="text-red-500">{error || 'Post not found'}</p>
          <a href="/" className="text-blue-500">Back to Home</a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {/* 只有帖子所有者才能看到编辑和删除按钮 */}
            {user && post.author && ((user.id || user.ID) === (post.author.id || post.author.ID)) && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  编辑
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                >
                  删除
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>By: {post.author.username}</span>
            <span>{post.created_at || post.createdAt || post.CreatedAt ? new Date(post.created_at || post.createdAt || post.CreatedAt).toLocaleString() : 'Unknown date'}</span>
          </div>
          
          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="prose max-w-none mb-6 markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
                p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-4">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
                li: ({children}) => <li className="mb-1">{children}</li>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>,
                code: ({inline, children}) => 
                  inline ? 
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code> : 
                    <code>{children}</code>,
                pre: ({children}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                liked 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${!user ? 'opacity-75' : ''}`}
            >
              <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{liked ? '已点赞' : '点赞'}</span>
              <span>({likesCount})</span>
            </button>
            
            <button 
              onClick={handleFavorite}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                favorited 
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${!user ? 'opacity-75' : ''}`}
            >
              <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>{favorited ? '已收藏' : '收藏'}</span>
              <span>({favoritesCount})</span>
            </button>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{comments.length} 条评论</span>
            </div>
          </div>
        </div>

        {user ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {replyTo ? `Reply to ${replyToUsername}` : 'Add a Comment'}
            </h2>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              {replyTo && (
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <span>Replying to {replyToUsername}</span>
                  <button 
                    type="button" 
                    onClick={cancelReply}
                    className="ml-2 text-red-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <textarea
                id="comment-input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder={replyTo ? `Write your reply to ${replyToUsername}...` : "Write your comment here..."}
                required
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {commentLoading ? 'Posting...' : (replyTo ? 'Post Reply' : 'Post Comment')}
              </button>
            </form>
          </div>
        ) : (
          <p className="mb-8">
            <a href="/login" className="text-blue-500">Login</a> to add a comment.
          </p>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            评论 ({comments.length})
          </h2>
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {comment.author.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{comment.author.username}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {comment.created_at || comment.createdAt || comment.CreatedAt ? new Date(comment.created_at || comment.createdAt || comment.CreatedAt).toLocaleString() : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                    {user && (user.id === comment.author.id || user.ID === comment.author.ID) && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50 transition-colors"
                        title="删除评论"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-800 mb-3 leading-relaxed">{comment.content}</p>
                  
                  {user && (
                    <button 
                      onClick={() => handleReply(comment.id, comment.author.username)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>回复</span>
                    </button>
                  )}
                  
                  {/* 评论回复 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="bg-gray-50 border-l-4 border-blue-200 rounded-r-lg p-3 ml-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {reply.author.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 text-sm">{reply.author.username}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {reply.created_at || reply.createdAt || reply.CreatedAt ? new Date(reply.created_at || reply.createdAt || reply.CreatedAt).toLocaleString() : 'Unknown date'}
                                </span>
                              </div>
                            </div>
                            {user && (user.id === reply.author.id || user.ID === reply.author.ID) && (
                              <button 
                                onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50 transition-colors"
                                title="删除回复"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.content}</p>
                          
                          {user && (
                            <button 
                              onClick={() => handleReply(comment.id, reply.author.username)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                              </svg>
                              <span>回复</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 text-lg">还没有评论</p>
              <p className="text-gray-400 text-sm mt-1">成为第一个评论的人吧！</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}