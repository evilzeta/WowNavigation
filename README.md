# WowNavigation 导航网站

一个基于 Vue 3 和 Cloudflare 的现代导航网站，支持静态化和动态部署两种模式。

## 演示站点

- [WowNavigation](https://960119.xyz) [哇塞导航](https://960119.xyz)

## 功能特性

### 核心功能
- 响应式设计，适配各种设备
- 深色/浅色主题切换
- 中英文语言切换
- 网站分类管理
- 网站推荐评分系统
- 访问统计
- 自动链接检查
- 后台管理功能
- PWA 支持，可安装为应用

### 管理功能
- 管理员账户修改
- 网站标题和页脚自定义
- 多种 Logo 源选择
- 网站标签管理
- 访问量统计
- 批量 Logo 获取功能

### SEO 优化
- 静态 HTML 生成
- 自定义网站标题和描述
- Open Graph 标签，优化社交媒体分享

## 部署模式

### 1. 静态化部署（推荐）
- 适用：内容更新不频繁，追求极致性能
- 优势：加载速度快、SEO 友好、成本低
- 平台：GitHub Pages、Netlify、Vercel、Cloudflare Pages

### 2. 动态部署
- 适用：需要频繁更新内容，需要在线管理
- 优势：可在线管理、实时更新、访问统计
- 平台：Cloudflare Pages（需配置 KV）

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
# 访问 http://localhost:3000
```

### 构建项目

```bash
# 完整构建（动态部署）
npm run build

# 静态化构建
npm run build:static
```

## 部署到 Cloudflare Pages

### 1. 创建 KV 命名空间

```bash
npm install -g wrangler
wrangler login
wrangler kv:namespace create "WEBSTACK_DATA"
```

### 2. 配置 wrangler.toml

```toml
name = "wow-navigation"
compatibility_date = "2023-10-10"
pages_build_output_dir = "./dist"

[[kv_namespaces]]
binding = "WEBSTACK_DATA"
id = "your_kv_namespace_id"
preview_id = "your_kv_preview_id"
```

### 3. 部署

```bash
npm run build
wrangler pages deploy dist
```

## 默认管理员账号

- 用户名：admin
- 密码：admin

首次登录后请在后台修改密码。

## 项目结构

```
webstack-kv/
├── src/                  # Vue 源代码
│   ├── components/       # 组件
│   ├── views/           # 页面
│   ├── stores/          # 状态管理
│   └── router/          # 路由
├── functions/           # Cloudflare Functions
│   └── api/             # API 接口
├── scripts/             # 构建脚本
├── public/              # 静态资源
├── data.json            # 静态数据
└── wrangler.toml        # Cloudflare 配置
```

## 技术栈

- Vue 3 + Vite
- Vue Router + Pinia
- Tailwind CSS
- Cloudflare Workers + KV
- Font Awesome

## 许可证

MIT
