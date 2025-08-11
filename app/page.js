'use client';

import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";
import Announcement from "./components/Announcement";
import { postApi } from "./services/postApi";
import { useAuth } from "./context/AuthContext";
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载帖子列表
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // 尝试连接后端，不再强制使用模拟数据
        if (false) { // 禁用模拟数据，直接使用后端API
          // 模拟分页加载
          const mockPosts = [
            {
              id: 1,
              title: 'Welcome to Nexus Forum',
              content: 'This is a sample post to demonstrate the forum functionality.',
              author: { username: 'admin' },
              createdAt: new Date().toISOString(),
              likes: 5,
              comments: 2,
              tags: ['welcome', 'introduction']
            },
            {
              id: 2,
              title: 'Getting Started with Nexus',
              content: 'Learn how to use Nexus Forum and participate in discussions.',
              author: { username: 'moderator' },
              createdAt: new Date().toISOString(),
              likes: 3,
              comments: 1,
              tags: ['guide', 'tutorial']
            },
            {
              id: 3,
              title: 'Forum Features Overview',
              content: 'Explore all the features available in our forum platform.',
              author: { username: 'admin' },
              createdAt: new Date().toISOString(),
              likes: 7,
              comments: 4,
              tags: ['features', 'overview']
            }
          ];
          
          // 如果有选中的标签，过滤帖子
          const filteredPosts = selectedTag 
            ? mockPosts.filter(post => post.tags && post.tags.includes(selectedTag))
            : mockPosts;
          
          // 只在第一页时重置数据，否则追加
          if (page === 1) {
            setPosts(filteredPosts);
          } else {
            // 模拟第二页及以后没有更多数据
            setPosts(prev => [...prev]);
            setHasMore(false);
          }
          return;
        }
        
        // 实际API调用（当后端准备好时使用）
        const response = await postApi.getPosts(page, 10, selectedTag);
        if (response.code === 0 && response.data) {
          if (page === 1) {
            setPosts(response.data.Post || []);
          } else {
            setPosts(prev => [...prev, ...(response.data.Post || [])]);
          }
          setHasMore((response.data.Post || []).length === 10); // 假设每页10条
        } else {
          setError(response.msg || 'Failed to load posts');
        }
      } catch (err) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, selectedTag]);

  // 加载热门帖子和标签
  useEffect(() => {
    const fetchPopularAndTags = async () => {
      try {
        // 尝试连接后端，不再强制使用模拟数据
        if (false) { // 禁用模拟数据，直接使用后端API
          // 模拟热门帖子
          const mockPopularPosts = [
            {
              id: 4,
              title: 'Most Popular Post',
              content: 'This is the most popular post on the forum.',
              author: { username: 'admin' },
              createdAt: new Date().toISOString(),
              likes: 25,
              comments: 12,
              tags: ['popular', 'featured']
            },
            {
              id: 5,
              title: 'Second Most Popular Post',
              content: 'This is the second most popular post on the forum.',
              author: { username: 'moderator' },
              createdAt: new Date().toISOString(),
              likes: 18,
              comments: 8,
              tags: ['popular', 'discussion']
            }
          ];
          
          // 模拟标签列表
          const mockTags = [
            { name: 'welcome', count: 1 },
            { name: 'introduction', count: 1 },
            { name: 'guide', count: 1 },
            { name: 'tutorial', count: 1 },
            { name: 'features', count: 1 },
            { name: 'overview', count: 1 },
            { name: 'popular', count: 2 },
            { name: 'featured', count: 1 },
            { name: 'discussion', count: 1 }
          ];
          
          setPopularPosts(mockPopularPosts);
          setTags(mockTags);
          return;
        }
        
        // 实际API调用（当后端准备好时使用）
        const [popularResponse, tagsResponse] = await Promise.all([
          postApi.getPopularPosts(5),
          postApi.getAllTags('post_count')
        ]);
        
        if (popularResponse.code === 0 && popularResponse.data) {
          // 根据Go controller，热门帖子直接返回数组，不是包装在posts字段中
          setPopularPosts(popularResponse.data || []);
        }
        
        if (tagsResponse.code === 0 && tagsResponse.data) {
          // 根据后端实现，标签数据直接返回数组
          setTags(tagsResponse.data || []);
        }
      } catch (err) {
        console.error('Failed to load popular posts or tags:', err);
      }
    };
    
    fetchPopularAndTags();
  }, []);
  
  // 加载更多帖子
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };
  
  // 处理标签点击
  const handleTagClick = (tagName) => {
    setSelectedTag(tagName === selectedTag ? '' : tagName);
    setPage(1); // 重置到第一页
  };

  return (
    <div className="flex-grow">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex gap-8">
          {/* 主内容区域 */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nexus Forum</h1>
              {user && (
                <Link href="/create-post" className="neumorphism-button-primary">
                  Create Post
                </Link>
              )}
            </div>
            
            {/* 标签筛选 */}
            <div className="neumorphism-card mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter by Tags</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleTagClick('')}
                  className={`neumorphism-tag transition-all duration-200 ${
                    selectedTag === '' 
                      ? 'active' 
                      : ''
                  }`}
                >
                  All Posts
                </button>
                {tags.map((tag, index) => {
                  const tagName = typeof tag === 'string' ? tag : tag.name;
                  const tagCount = typeof tag === 'object' ? tag.post_count : null;
                  return (
                    <button
                      key={`tag-${tagName}-${index}`}
                      onClick={() => handleTagClick(tagName)}
                      className={`neumorphism-tag transition-all duration-200 ${
                        selectedTag === tagName 
                          ? 'active' 
                          : ''
                      }`}
                    >
                      {tagName}
                      {tagCount && ` (${tagCount})`}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* 帖子列表 */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {selectedTag ? `Posts tagged with "${selectedTag}"` : 'Recent Posts'}
              </h2>
              
              {error && (
                <div className="neumorphism-card bg-red-50 border-red-200 mb-6">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post, index) => (
                    <PostCard key={`post-${post.ID || index}`} post={post} />
                  ))}
                </div>
              ) : !loading ? (
                <div className="neumorphism-card text-center py-12">
                  <p className="text-gray-500 text-lg">No posts found. {!selectedTag && 'Be the first to create a post!'}</p>
                </div>
              ) : null}

              {loading && (
                <div className="neumorphism-card text-center py-8">
                  <p className="text-gray-600">Loading posts...</p>
                </div>
              )}

              {hasMore && !loading && (
                <button 
                  onClick={loadMore}
                  className="neumorphism-button w-full mt-6"
                >
                  Load More
                </button>
              )}
            </div>
          </div>
          
          {/* 右侧栏 */}
          <div className="w-80 space-y-8">
            {/* 用户信息卡片 */}
            {user && (
              <div className="neumorphism-card">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Profile</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-neumorphism-small flex items-center justify-center text-white font-semibold">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={`${user.username}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full flex items-center justify-center ${user.avatar ? 'hidden' : 'flex'}`}
                    >
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                {user.bio && (
                  <p className="text-sm text-gray-600 mb-4">{user.bio}</p>
                )}
                <Link 
                  href="/profile" 
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-50 shadow-neumorphism-small hover:shadow-neumorphism-pressed text-blue-600 hover:text-blue-700 text-sm font-medium transition-all duration-200 active:scale-95"
                >
                  View Profile →
                </Link>
              </div>
            )}
            
            {/* 网站公告 */}
            <Announcement />
            
            {/* 热门帖子 */}
            <div className="neumorphism-card">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">🔥 Popular Posts</h3>
              {popularPosts.length > 0 ? (
                <div className="space-y-4">
                  {popularPosts.slice(0, 5).map((post, index) => (
                    <div key={`popular-${post.ID || index}`} className="border-b border-gray-200 border-opacity-50 last:border-b-0 pb-4 last:pb-0">
                      <Link 
                        href={`/post/${post.ID}`}
                        className="block hover:text-blue-600 transition-colors duration-200"
                      >
                        <h4 className="font-semibold text-sm line-clamp-2 mb-2 text-gray-800">{post.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span className="flex items-center space-x-1">
                            <span>👤</span>
                            <span>{post.author?.username || 'Anonymous'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>❤️</span>
                            <span>{post.like_count || post.likes || 0}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>💬</span>
                            <span>{post.comment_count || post.comments || 0}</span>
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No popular posts yet.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
