'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 网站介绍 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Nexus Hub</h3>
            <p className="text-gray-300 mb-4">
              Nexus Hub 是一个创新的Web3生态平台，致力于构建去中心化的数字社区。
              我们将论坛社区作为起点，逐步整合NFT市场、DAO治理、AI助手、链游娱乐、
              众筹平台等多元化功能，为用户提供一站式的区块链生活体验。
            </p>
            <p className="text-gray-400 text-sm">
              加入我们，共同探索Web3的无限可能！
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  论坛首页
                </Link>
              </li>
              <li>
                <Link href="/create-post" className="text-gray-300 hover:text-white transition-colors">
                  发布帖子
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                  个人中心
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  NFT市场 (即将推出)
                </span>
              </li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">
                <span className="inline-block w-5">📧</span>
                contact@nexushub.com
              </li>
              <li className="text-gray-300">
                <span className="inline-block w-5">🐦</span>
                @NexusHub_Official
              </li>
              <li className="text-gray-300">
                <span className="inline-block w-5">💬</span>
                Discord社区
              </li>
              <li className="text-gray-300">
                <span className="inline-block w-5">📱</span>
                Telegram群组
              </li>
            </ul>
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Nexus Hub. All rights reserved. 构建未来的去中心化生态系统。
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                服务条款
              </Link>
              <Link href="/help" className="text-gray-400 hover:text-white text-sm transition-colors">
                帮助中心
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}