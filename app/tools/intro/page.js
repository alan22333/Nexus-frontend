import ModuleIntro from '../../components/ModuleIntro';

export default function ToolsIntro() {
  const features = [
    {
      icon: '🔐',
      title: '钱包工具',
      description: '多链钱包管理、私钥安全存储、交易记录查询等钱包相关工具'
    },
    {
      icon: '📊',
      title: '数据分析',
      description: '区块链数据分析、DeFi收益计算、投资组合管理等分析工具'
    },
    {
      icon: '🔄',
      title: '跨链桥接',
      description: '安全便捷的跨链资产转移，支持主流区块链网络'
    },
    {
      icon: '⚡',
      title: 'Gas优化',
      description: 'Gas费用预测、交易加速、批量操作等优化工具'
    },
    {
      icon: '🛡️',
      title: '安全检测',
      description: '智能合约安全审计、钓鱼网站检测、风险评估工具'
    },
    {
      icon: '📱',
      title: 'DApp浏览器',
      description: '集成的DApp浏览器，安全访问各种去中心化应用'
    }
  ];

  const benefits = [
    {
      title: '一站式服务',
      description: '集成多种实用工具，用户无需在不同平台间切换，提高效率'
    },
    {
      title: '开源透明',
      description: '所有工具代码开源，社区可以审计和贡献，确保安全可信'
    },
    {
      title: '免费使用',
      description: '大部分基础工具免费提供，降低Web3参与门槛'
    },
    {
      title: '持续更新',
      description: '根据用户需求和技术发展持续添加新工具和功能'
    }
  ];

  return (
    <ModuleIntro
      title="实用工具箱"
      icon="🛠️"
      description="Web3实用工具集合，为用户提供钱包管理、数据分析、安全检测等各种实用工具，让Web3体验更加便捷和安全。"
      features={features}
      benefits={benefits}
      expectedLaunch="2024年第二季度"
    />
  );
}