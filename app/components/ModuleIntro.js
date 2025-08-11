'use client';

import Link from 'next/link';
import Navbar from './Navbar';

export default function ModuleIntro({ 
  title, 
  icon, 
  description, 
  features, 
  comingSoon = true,
  expectedLaunch,
  benefits 
}) {
  return (
    <div className="min-h-screen neumorphism-content">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 neumorphism-button text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
        </div>

        {/* 主要内容 */}
        <div className="max-w-4xl mx-auto">
          {/* 头部区域 */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">{icon}</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            {comingSoon && (
              <div className="mt-6">
                <span className="inline-block px-6 py-3 neumorphism-tag text-orange-600 font-medium text-lg">
                  🚀 即将推出
                </span>
                {expectedLaunch && (
                  <p className="text-gray-500 mt-2">预计上线时间：{expectedLaunch}</p>
                )}
              </div>
            )}
          </div>

          {/* 功能特性 */}
          {features && features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                核心功能
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="neumorphism-card p-6 text-center">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 优势亮点 */}
          {benefits && benefits.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                平台优势
              </h2>
              <div className="neumorphism-card p-8">
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 neumorphism-button-small rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 底部行动区域 */}
          <div className="text-center neumorphism-card p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              敬请期待
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              我们正在全力开发这个令人兴奋的功能。加入我们的社区，第一时间获取最新进展！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="px-6 py-3 neumorphism-button-primary text-white font-medium rounded-xl transition-all duration-200"
              >
                返回论坛
              </Link>
              <button className="px-6 py-3 neumorphism-button text-gray-700 font-medium rounded-xl transition-all duration-200">
                关注更新
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}