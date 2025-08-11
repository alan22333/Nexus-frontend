'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // 检测移动端设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: 实现搜索功能
      console.log('搜索:', searchQuery);
    }
  };

  return (
    <nav className="neumorphism-card p-4 border-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* 移动端汉堡菜单按钮 */}
          {isMobile && (
            <button
               onClick={toggleSidebar}
               className="p-3 rounded-xl bg-gray-50 shadow-neumorphism-inset hover:shadow-neumorphism-pressed transition-all duration-200 active:scale-95"
               title="打开菜单"
             >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Nexus Forum
          </Link>
        </div>
        
        {/* 中间搜索区域 */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="搜索帖子、用户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full neumorphism-search text-gray-700 placeholder-gray-500 focus:placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl neumorphism-button-small text-gray-600 hover:text-blue-600 transition-all duration-200"
            title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          <Link href="/" className="px-4 py-2 rounded-xl bg-gray-50 shadow-neumorphism hover:shadow-neumorphism-pressed text-gray-700 hover:text-blue-600 transition-all duration-200 active:scale-95">
            Home
          </Link>
          
          {user ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="px-4 py-2 rounded-xl bg-gray-50 shadow-neumorphism hover:shadow-neumorphism-pressed text-gray-700 hover:text-blue-600 transition-all duration-200 active:scale-95 flex items-center space-x-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-neumorphism-small flex items-center justify-center text-white text-sm font-semibold">
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
                  <span>{user.username || 'User'}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-gray-50 rounded-xl shadow-neumorphism py-2 z-10 border-0">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-neumorphism-inset rounded-lg mx-2 transition-all duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      个人资料
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }} 
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-neumorphism-inset rounded-lg mx-2 transition-all duration-200"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-xl bg-gray-50 shadow-neumorphism hover:shadow-neumorphism-pressed text-gray-700 hover:text-blue-600 transition-all duration-200 active:scale-95">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-neumorphism hover:shadow-neumorphism-pressed text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}