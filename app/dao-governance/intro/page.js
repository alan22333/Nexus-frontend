import ModuleIntro from '../../components/ModuleIntro';

export default function DAOGovernanceIntro() {
  const features = [
    {
      icon: '🗳️',
      title: '提案投票',
      description: '社区成员可以发起提案并参与投票，共同决定平台的发展方向'
    },
    {
      icon: '💰',
      title: '资金管理',
      description: '透明的资金池管理，所有资金流向都记录在区块链上'
    },
    {
      icon: '📋',
      title: '治理代币',
      description: '持有治理代币获得投票权，代币数量决定投票权重'
    },
    {
      icon: '⏰',
      title: '时间锁机制',
      description: '重要决策设置执行延迟，给社区充分的讨论和反对时间'
    },
    {
      icon: '📊',
      title: '数据透明',
      description: '所有治理活动数据公开透明，可追溯和审计'
    },
    {
      icon: '🤝',
      title: '委托投票',
      description: '支持投票权委托，让专业人士代表社区成员参与治理'
    }
  ];

  const benefits = [
    {
      title: '真正的去中心化',
      description: '没有中央权威，所有重要决策都由社区投票决定，实现真正的民主治理'
    },
    {
      title: '激励机制完善',
      description: '参与治理的用户可以获得代币奖励，鼓励积极参与社区建设'
    },
    {
      title: '多重安全保障',
      description: '多签钱包、时间锁、紧急暂停等多重安全机制保护社区资产'
    },
    {
      title: '渐进式去中心化',
      description: '从部分去中心化逐步过渡到完全去中心化，确保平稳过渡'
    }
  ];

  return (
    <ModuleIntro
      title="DAO治理中心"
      icon="🏛️"
      description="去中心化自治组织治理平台，让社区成员共同参与平台治理，通过提案、投票等方式决定平台的发展方向和资源分配。"
      features={features}
      benefits={benefits}
      expectedLaunch="2024年第三季度"
    />
  );
}