import ModuleIntro from '../../components/ModuleIntro';

export default function NFTMarketIntro() {
  const features = [
    {
      icon: '🎨',
      title: 'NFT创作工具',
      description: '提供简单易用的NFT创作和铸造工具，让每个人都能成为数字艺术家'
    },
    {
      icon: '🛒',
      title: '去中心化交易',
      description: '基于区块链的安全交易环境，支持多种加密货币支付方式'
    },
    {
      icon: '🏆',
      title: '稀有度评估',
      description: '智能算法评估NFT稀有度，帮助用户发现有价值的数字收藏品'
    },
    {
      icon: '👥',
      title: '社区互动',
      description: '艺术家和收藏家的交流平台，分享创作心得和收藏经验'
    },
    {
      icon: '📊',
      title: '市场分析',
      description: '实时市场数据和趋势分析，帮助用户做出明智的投资决策'
    },
    {
      icon: '🔒',
      title: '版权保护',
      description: '区块链技术确保数字作品版权，防止盗用和侵权行为'
    }
  ];

  const benefits = [
    {
      title: '低手续费交易',
      description: '采用Layer 2解决方案，大幅降低交易成本，让更多用户能够参与NFT交易'
    },
    {
      title: '跨链兼容性',
      description: '支持多个区块链网络，用户可以在不同链上自由交易NFT资产'
    },
    {
      title: '创作者友好',
      description: '为艺术家提供完整的创作到销售流程，包括版税设置和推广支持'
    },
    {
      title: '社区治理',
      description: '持有平台代币的用户可以参与平台治理，共同决定发展方向'
    }
  ];

  return (
    <ModuleIntro
      title="NFT市场"
      icon="🎨"
      description="去中心化的数字艺术品交易平台，连接创作者与收藏家，让数字艺术价值得到充分体现。支持NFT创作、交易、展示和社区互动。"
      features={features}
      benefits={benefits}
      expectedLaunch="2024年第二季度"
    />
  );
}