import ModuleIntro from '../../components/ModuleIntro';

export default function GamingIntro() {
  const features = [
    {
      icon: '🎮',
      title: '区块链游戏',
      description: '基于区块链技术的创新游戏，真正拥有游戏内资产和道具'
    },
    {
      icon: '💎',
      title: 'Play-to-Earn',
      description: '边玩边赚模式，通过游戏技能和时间投入获得真实收益'
    },
    {
      icon: '🏆',
      title: '竞技比赛',
      description: '定期举办电竞比赛和锦标赛，丰厚奖金等你来挑战'
    },
    {
      icon: '🎨',
      title: '自定义内容',
      description: '玩家可以创建和交易游戏内容，包括皮肤、地图、道具等'
    },
    {
      icon: '👥',
      title: '公会系统',
      description: '加入游戏公会，与志同道合的玩家一起征战游戏世界'
    },
    {
      icon: '📱',
      title: '跨平台游戏',
      description: '支持PC、手机、平板等多平台，随时随地享受游戏乐趣'
    }
  ];

  const benefits = [
    {
      title: '真实资产所有权',
      description: '游戏内的装备、道具、角色都是NFT，玩家拥有真正的所有权'
    },
    {
      title: '跨游戏资产互通',
      description: '部分资产可以在不同游戏间流通使用，提升资产价值'
    },
    {
      title: '社区驱动发展',
      description: '玩家社区参与游戏开发决策，共同打造理想的游戏体验'
    },
    {
      title: '公平透明机制',
      description: '区块链技术确保游戏机制公平透明，杜绝暗箱操作'
    }
  ];

  return (
    <ModuleIntro
      title="欢乐链游中心"
      icon="🎮"
      description="Web3游戏聚合平台，汇集最优质的区块链游戏，让玩家在享受游戏乐趣的同时获得真实收益，开启全新的游戏体验。"
      features={features}
      benefits={benefits}
      expectedLaunch="2024年第四季度"
    />
  );
}