import ModuleIntro from '../../components/ModuleIntro';

export default function AIChatIntro() {
  const features = [
    {
      icon: '🤖',
      title: '智能对话',
      description: '基于先进AI模型的智能对话系统，理解上下文并提供准确回答'
    },
    {
      icon: '🔧',
      title: '编程助手',
      description: '专业的代码生成、调试和优化建议，支持多种编程语言'
    },
    {
      icon: '📚',
      title: '学习伙伴',
      description: '个性化学习计划和知识问答，帮助用户快速掌握新技能'
    },
    {
      icon: '💡',
      title: '创意灵感',
      description: '文案创作、设计思路、商业策划等创意内容生成'
    },
    {
      icon: '🌐',
      title: '多语言支持',
      description: '支持多种语言交流，打破语言障碍实现全球化沟通'
    },
    {
      icon: '🔒',
      title: '隐私保护',
      description: '端到端加密对话，用户隐私和数据安全得到充分保护'
    }
  ];

  const benefits = [
    {
      title: '24/7全天候服务',
      description: 'AI助手随时在线，无论何时都能为用户提供即时帮助和支持'
    },
    {
      title: '个性化体验',
      description: '根据用户习惯和偏好调整回答风格，提供更贴心的服务体验'
    },
    {
      title: '持续学习进化',
      description: 'AI模型持续更新优化，不断提升理解能力和回答质量'
    },
    {
      title: '专业领域深度',
      description: '在区块链、Web3、编程等专业领域提供深度专业的指导'
    }
  ];

  return (
    <ModuleIntro
      title="AI聊天助手"
      icon="🤖"
      description="智能AI助手为用户提供全方位的对话服务，包括技术咨询、学习指导、创意启发等，让AI成为您最贴心的数字伙伴。"
      features={features}
      benefits={benefits}
      expectedLaunch="2024年第一季度"
    />
  );
}