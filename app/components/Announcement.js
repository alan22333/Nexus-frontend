'use client';

import { useState } from 'react';

export default function Announcement() {
  const [isExpanded, setIsExpanded] = useState(false);

  const announcements = [
    {
      id: 1,
      title: '🎉 欢迎来到 Nexus Hub！',
      content: '感谢您加入我们的Web3生态社区！这里是您探索去中心化世界的起点。',
      date: '2024-01-15',
      type: 'welcome'
    },
    {
      id: 2,
      title: '🚀 项目路线图发布',
      content: 'Nexus Hub将分阶段推出多个创新模块：NFT市场、DAO治理中心、AI聊天助手、欢乐链游中心、创意众筹平台等。敬请期待！',
      date: '2024-01-10',
      type: 'roadmap'
    },
    {
      id: 3,
      title: '💡 社区建设计划',
      content: '我们正在构建一个开放、包容的去中心化社区。每个用户的声音都很重要，欢迎分享您的想法和建议！',
      date: '2024-01-08',
      type: 'community'
    }
  ];

  const upcomingFeatures = [
    { name: 'NFT市场', icon: '🎨', status: '开发中', progress: 60 },
    { name: 'DAO治理', icon: '🏛️', status: '设计中', progress: 30 },
    { name: 'AI助手', icon: '🤖', status: '规划中', progress: 15 },
    { name: '链游中心', icon: '🎮', status: '规划中', progress: 10 },
  ];

  return (
    <div className="neumorphism-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          📢 网站公告
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="neumorphism-button-small px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          {isExpanded ? '收起' : '展开'}
        </button>
      </div>

      {/* 最新公告 */}
      <div className="space-y-3 mb-5">
        {announcements.slice(0, isExpanded ? announcements.length : 2).map((announcement) => (
          <div key={announcement.id} className="neumorphism-inset p-3 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-sm mb-2 text-gray-800">{announcement.title}</h4>
            <p className="text-xs text-gray-600 mb-2 leading-relaxed">{announcement.content}</p>
            <span className="text-xs text-gray-500 font-medium">{announcement.date}</span>
          </div>
        ))}
      </div>

      {/* 即将推出的功能 */}
      <div className="neumorphism-inset p-4 rounded-lg">
        <h4 className="font-bold text-sm mb-4 flex items-center text-gray-800">
          🔮 即将推出
        </h4>
        <div className="space-y-3">
          {upcomingFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm font-medium text-gray-700">{feature.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-20 h-2 neumorphism-inset rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: `${feature.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 w-14 font-medium">{feature.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 项目愿景 */}
      {isExpanded && (
        <div className="neumorphism-inset p-4 rounded-lg mt-4">
          <h4 className="font-bold text-sm mb-3 flex items-center text-gray-800">
            🌟 项目愿景
          </h4>
          <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
            <p>
              Nexus Hub致力于成为Web3领域的超级应用，整合多种去中心化服务，
              为用户提供一站式的区块链生活体验。
            </p>
            <p>
              我们相信去中心化的未来，相信社区的力量，相信技术能够创造更美好的世界。
            </p>
            <div className="neumorphism-card p-3 rounded-lg mt-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <span className="text-sm font-bold text-blue-600 block text-center">
                🚀 一起构建Web3的未来！
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}