import ModuleIntro from '../../components/ModuleIntro';

export default function CrowdfundingIntro() {
  const features = [
    {
      icon: '💡',
      title: '项目发起',
      description: '创作者可以轻松发起众筹项目，展示创意想法和资金需求'
    },
    {
      icon: '💰',
      title: '智能合约',
      description: '基于区块链的智能合约确保资金安全和透明使用'
    },
    {
      icon: '🎁',
      title: '回报机制',
      description: '支持者可以获得独特的回报，包括产品、NFT、特殊权益等'
    },
    {
      icon: '📊',
      title: '进度追踪',
      description: '实时追踪项目进度和资金使用情况，保持透明度'
    },
    {
      icon: '🌍',
      title: '全球众筹',
      description: '打破地域限制，让全世界的支持者都能参与项目众筹'
    },
    {
      icon: '🔍',
      title: '项目审核',
      description: '严格的项目审核机制，确保众筹项目的质量和可行性'
    }
  ];

  const benefits = [
    {
      title: '去中心化资金管理',
      description: '智能合约自动管理资金，达到目标自动释放，未达标自动退款'
    },
    {
      title: '低门槛创业支持',
      description: '为有创意但缺乏资金的创业者提供平台，降低创业门槛'
    },
    {
      title: '社区驱动评估',
      description: '社区成员参与项目评估和投票，提高项目成功率'
    },
    {
      title: '知识产权保护',
      description: '区块链技术保护创意知识产权，防止抄袭和盗用'
    }
  ];

  return (
    <ModuleIntro
      title="创意众筹平台"
      icon="💡"
      description="去中心化众筹平台，连接有创意的项目发起者和愿意支持的投资者，通过区块链技术确保资金安全和项目透明。"
      features={features}
      benefits={benefits}
      expectedLaunch="2024年第三季度"
    />
  );
}