# 🌟 Nexus Frontend

一个现代化的社区平台前端应用，基于 Next.js 构建，提供丰富的社交功能和模块化设计。

## ✨ 功能特性

### 🔐 用户系统
- 用户注册、登录、密码重置
- 用户个人资料管理
- JWT 身份验证

### 📝 内容管理
- 帖子创建与编辑（支持 Markdown）
- 帖子详情页面
- 评论系统（支持多层嵌套回复）
- 点赞和收藏功能
- 标签系统

### 🎨 用户界面
- 响应式设计
- 新拟态（Neumorphism）风格
- 暗色/亮色主题切换
- 现代化的 UI 组件

### 🔧 模块化功能
- AI 聊天模块
- 众筹模块
- DAO 治理模块
- 游戏模块
- NFT 市场模块
- 工具模块

## 🛠️ 技术栈

- **框架**: Next.js 15.4.6
- **UI 库**: React 19.1.0
- **样式**: Tailwind CSS 4.0
- **Markdown**: React Markdown + Remark GFM
- **代码高亮**: Rehype Highlight
- **编辑器**: @uiw/react-md-editor

## 📁 项目结构

```
nexus-frontend/
├── app/
│   ├── components/          # 可复用组件
│   │   ├── Navbar.js       # 导航栏
│   │   ├── PostCard.js     # 帖子卡片
│   │   ├── ModuleIntro.js  # 模块介绍
│   │   └── ...
│   ├── context/            # React Context
│   │   ├── AuthContext.js  # 认证上下文
│   │   ├── ThemeContext.js # 主题上下文
│   │   └── SidebarContext.js
│   ├── services/           # API 服务
│   │   ├── api.js         # 通用 API
│   │   ├── postApi.js     # 帖子相关 API
│   │   └── accountApi.js  # 账户相关 API
│   ├── styles/            # 样式文件
│   │   └── neumorphism.css
│   ├── [功能模块]/         # 各功能页面
│   │   ├── ai-chat/
│   │   ├── crowdfunding/
│   │   ├── dao-governance/
│   │   ├── gaming/
│   │   ├── nft-market/
│   │   └── tools/
│   └── ...
└── public/                # 静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn、pnpm 或 bun

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm run start
```

## 🎯 主要页面

- **首页** (`/`) - 帖子列表和导航
- **帖子详情** (`/post/[id]`) - 帖子内容、评论、互动
- **创建帖子** (`/create-post`) - Markdown 编辑器
- **用户中心** (`/profile`) - 个人资料管理
- **登录/注册** (`/login`, `/register`) - 用户认证
- **模块介绍页** - 各功能模块的介绍页面

## 🔧 开发说明

### 样式系统

项目使用 Tailwind CSS 作为主要样式框架，结合自定义的新拟态样式：

- `globals.css` - 全局样式和 CSS 变量
- `neumorphism.css` - 新拟态风格样式
- 支持暗色/亮色主题切换

### 状态管理

使用 React Context 进行状态管理：

- `AuthContext` - 用户认证状态
- `ThemeContext` - 主题切换
- `SidebarContext` - 侧边栏状态

### API 集成

- 支持开发环境模拟数据
- 生产环境连接后端 API
- 统一的错误处理和加载状态

## 📝 开发规范

- 使用函数式组件和 Hooks
- 遵循 ESLint 代码规范
- 组件文件使用 PascalCase 命名
- 样式类名使用 Tailwind CSS

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

**Nexus Frontend** - 构建现代化的社区平台体验 🚀
