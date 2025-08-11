'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  // 检测移动端设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 动态调整主内容区域的左边距
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (isMobile) {
        mainElement.style.marginLeft = '0';
      } else {
        mainElement.style.marginLeft = isCollapsed ? '5rem' : '18rem';
      }
    }
  }, [isCollapsed, isMobile]);

  const modules = [
    {
      name: '论坛社区',
      icon: '💬',
      href: '/',
      active: true
    },
    {
      name: 'NFT市场',
      icon: '🎨',
      href: '/nft-market/intro',
      comingSoon: true
    },
    {
      name: 'DAO治理中心',
      icon: '🏛️',
      href: '/dao-governance/intro',
      comingSoon: true
    },
    {
      name: 'AI聊天助手',
      icon: '🤖',
      href: '/ai-chat/intro',
      comingSoon: true
    },
    {
      name: '欢乐链游中心',
      icon: '🎮',
      href: '/gaming/intro',
      comingSoon: true
    },
    {
      name: '创意众筹平台',
      icon: '💡',
      href: '/crowdfunding/intro',
      comingSoon: true
    },
    {
      name: '实用工具箱',
      icon: '🛠️',
      href: '/tools/intro',
      comingSoon: true
    }
  ];

  return (
    <>
      {/* 移动端遮罩层 */}
      {isMobile && !isCollapsed && (
        <div 
           className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 transition-all duration-300"
           onClick={toggleSidebar}
         />
      )}
      
      <div className={`fixed left-0 top-0 h-full neumorphism-sidebar border-0 transition-all duration-300 z-40 ${
        isMobile ? (isCollapsed ? '-translate-x-full' : 'w-64') : (isCollapsed ? 'w-20' : 'w-72')
      }`}>
      {/* 侧边栏头部 */}
      <div className={`flex items-center p-4 border-b border-gray-200 border-opacity-30 ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">Nexus Hub</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl bg-gray-50 shadow-neumorphism-small hover:shadow-neumorphism-pressed transition-all duration-200 active:scale-95 flex-shrink-0"
          title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className={`p-3 space-y-1.5 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {modules.map((module, index) => (
          <div key={index} className="relative group">
            {module.comingSoon ? (
              <Link
                href={module.href || '#'}
                className={`neumorphism-nav-item text-gray-400 opacity-60 relative transition-all duration-200 ${
                  isCollapsed ? 'flex justify-center items-center p-3 w-16 h-16 mx-auto rounded-xl' : 'flex items-center px-4 py-3'
                }`}
                title={module.comingSoon ? `${module.name} - 即将推出` : module.name}
              >
                <span className={`${isCollapsed ? 'text-2xl' : 'text-xl'}`}>{module.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="ml-3 font-medium whitespace-nowrap text-sm">{module.name}</span>
                    <span className="ml-auto text-xs neumorphism-tag text-gray-500 px-2 py-1 whitespace-nowrap">
                      即将推出
                    </span>
                  </>
                )}
                {/* 收缩状态下的悬浮提示 */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    <div className="font-medium">{module.name}</div>
                    <div className="text-gray-300 text-xs">即将推出</div>
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href={module.href}
                className={`neumorphism-nav-item transition-all duration-200 relative ${
                  module.active
                    ? 'active text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                } ${
                  isCollapsed ? 'flex justify-center items-center p-3 w-16 h-16 mx-auto rounded-xl' : 'flex items-center px-4 py-3'
                }`}
                title={isCollapsed ? module.name : ''}
              >
                <span className={`${isCollapsed ? 'text-2xl' : 'text-xl'}`}>{module.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium whitespace-nowrap text-sm">{module.name}</span>
                )}
                {/* 收缩状态下的悬浮提示 */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {module.name}
                  </div>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* 底部用户信息 */}
      {user && (
        <div className={`absolute bottom-4 ${
          isCollapsed ? 'left-1/2 transform -translate-x-1/2' : 'left-4 right-4'
        }`}>
          {isCollapsed ? (
            <div className="neumorphism-card bg-gradient-to-br from-white to-gray-50 p-2 group relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-neumorphism-small flex items-center justify-center text-white text-sm font-semibold">
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
              {/* 收缩状态下的悬浮用户信息 */}
              <div className="absolute left-full ml-2 bottom-0 bg-gray-800 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">{user.username}</div>
                <div className="text-gray-300">{user.email}</div>
              </div>
            </div>
          ) : (
            <div className="neumorphism-card bg-gradient-to-br from-white to-gray-50 p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-neumorphism-small flex items-center justify-center text-white text-sm font-semibold">
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
}