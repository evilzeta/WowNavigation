# Cloudflare Pages + KV 部署详细指南

本指南详细介绍如何使用 Cloudflare Pages 和 Cloudflare KV 部署 WebStack 导航网站（动态模式）。

## 前提条件

- 已安装 Node.js (版本 16 或更高)
- 已安装 Git
- 拥有 Cloudflare 账号（免费即可）

## 目录

1. [项目准备](#1-项目准备)
2. [创建 Cloudflare KV 命名空间](#2-创建-cloudflare-kv-命名空间)
3. [配置项目](#3-配置项目)
4. [本地测试](#4-本地测试)
5. [部署到 Cloudflare Pages](#5-部署到-cloudflare-pages)
6. [绑定 KV 命名空间](#6-绑定-kv-命名空间)
7. [验证部署](#7-验证部署)
8. [常见问题](#8-常见问题)

---

## 1. 项目准备

### 1.1 克隆或下载项目

```bash
# 如果是从 GitHub 克隆
git clone https://github.com/your-username/webstack-kv.git
cd webstack-kv

# 或者直接下载解压后进入目录
cd webstack-kv
```

### 1.2 安装依赖

```bash
npm install
```

### 1.3 验证项目结构

确保项目包含以下文件：

```
webstack-kv/
├── src/
├── functions/
│   └── api/
│       ├── sites.js
│       ├── categories.js
│       ├── settings.js
│       ├── auth.js
│       ├── visits.js
│       └── logo-cache.js
├── public/
├── wrangler.toml
├── package.json
└── vite.config.js
```

---

## 2. 创建 Cloudflare KV 命名空间

### 2.1 安装 Wrangler CLI

Wrangler 是 Cloudflare 的官方命令行工具。

```bash
# 全局安装
npm install -g wrangler

# 验证安装
wrangler --version
```

### 2.2 登录 Cloudflare

```bash
wrangler login
```

执行后会打开浏览器，需要你：
1. 登录 Cloudflare 账号
2. 授权 Wrangler 访问你的账号
3. 授权成功后返回终端

### 2.3 创建 KV 命名空间

```bash
wrangler kv:namespace create "WEBSTACK_DATA"
```

**重要提示**：
- `WEBSTACK_DATA` 是命名空间的名称，建议不要修改
- 这个命令会创建两个命名空间：生产环境和预览环境

### 2.4 保存命名空间 ID

命令执行成功后会返回类似以下内容：

```
🌀 Creating namespace with title "webstack-navigation-WEBSTACK_DATA"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "WEBSTACK_DATA", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx", preview_id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

**请务必保存以下信息**：
- `id`: 生产环境命名空间 ID（例如：`45d2a7f940764a82882bfe674464080a`）
- `preview_id`: 预览环境命名空间 ID

### 2.5 验证命名空间创建

```bash
# 列出所有 KV 命名空间
wrangler kv:namespace list
```

应该能看到刚创建的 `WEBSTACK_DATA` 命名空间。

---

## 3. 配置项目

### 3.1 更新 wrangler.toml

打开项目根目录的 `wrangler.toml` 文件，更新为以下内容：

```toml
name = "webstacknav"
compatibility_date = "2023-10-10"
pages_build_output_dir = "./dist"

# KV 命名空间绑定
[[kv_namespaces]]
binding = "WEBSTACK_DATA"
id = "你的生产环境ID"  # 替换为步骤 2.4 获取的 id
preview_id = "你的预览环境ID"  # 替换为步骤 2.4 获取的 preview_id
```

**示例**：
```toml
name = "webstacknav"
compatibility_date = "2023-10-10"
pages_build_output_dir = "./dist"

[[kv_namespaces]]
binding = "WEBSTACK_DATA"
id = "45d2a7f940764a82882bfe674464080a"
preview_id = "45d2a7f940764a82882bfe674464080a"
```

### 3.2 验证配置文件

```bash
# 验证 wrangler 配置
wrangler whoami

# 应该显示你的 Cloudflare 账号信息
```

---

## 4. 本地测试

### 4.1 构建项目

```bash
npm run build
```

构建成功后会在 `dist` 目录生成以下文件：

```
dist/
├── assets/           # 静态资源（JS、CSS）
├── functions/        # Cloudflare Functions
│   └── api/
│       ├── sites.js
│       ├── categories.js
│       └── ...
├── index.html
└── manifest.json
```

### 4.2 本地预览（可选）

```bash
# 使用 Vite 预览（不包含 Functions）
npm run preview

# 使用 Wrangler 预览（包含 Functions 和 KV）
wrangler pages dev dist --kv=WEBSTACK_DATA
```

Wrangler 预览会启动本地服务器，通常在 `http://localhost:8788`。

### 4.3 测试 API 端点

在浏览器中访问（需要 Wrangler 预览运行）：

- `http://localhost:8788/api/sites` - 获取网站列表
- `http://localhost:8788/api/categories` - 获取分类列表
- `http://localhost:8788/api/settings` - 获取系统设置

应该返回 JSON 格式的数据。

---

## 5. 部署到 Cloudflare Pages

### 方式一：通过命令行部署（推荐）

#### 5.1 首次部署

```bash
wrangler pages deploy dist
```

首次部署会提示你：
1. 选择创建新项目或使用现有项目
2. 输入项目名称（例如：`webstack-nav`）
3. 选择生产分支（通常是 `main` 或 `master`）

#### 5.2 后续部署

```bash
# 直接部署到现有项目
wrangler pages deploy dist
```

### 方式二：通过 GitHub 自动部署

#### 5.1 推送代码到 GitHub

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/your-username/webstack-kv.git

# 推送
git push -u origin main
```

#### 5.2 在 Cloudflare Dashboard 创建 Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** 标签
5. 点击 **Connect to Git**
6. 选择你的 GitHub 仓库
7. 配置构建设置：

   ```
   Project name: webstack-nav
   Production branch: main
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   Root directory: (留空)
   ```

8. 点击 **Save and Deploy**

#### 5.3 配置环境变量（可选）

如果需要环境变量：

1. 进入项目 Settings → Environment variables
2. 添加变量：
   - Key: `NODE_VERSION`
   - Value: `18`
3. 点击 Encrypt 保存

---

## 6. 绑定 KV 命名空间

**这是最关键的一步！** 没有绑定 KV，网站无法存储和读取数据。

### 6.1 进入项目设置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 选择你的 Pages 项目（例如：`webstack-nav`）
4. 点击 **Settings** 标签

### 6.2 添加 KV 命名空间绑定

1. 找到 **Functions** 部分
2. 点击 **KV namespace bindings**
3. 点击 **Add binding**
4. 填写以下信息：

   ```
   Variable name: WEBSTACK_DATA
   KV namespace: 选择你创建的命名空间（通常显示为 webstack-navigation-WEBSTACK_DATA）
   ```

5. 点击 **Save**

### 6.3 验证绑定

在 KV namespace bindings 页面应该看到：

```
Variable name        | KV namespace
--------------------|------------------------------------
WEBSTACK_DATA      | webstack-navigation-WEBSTACK_DATA
```

### 6.4 重新部署（重要！）

绑定 KV 后必须重新部署才能生效：

```bash
# 命令行部署
wrangler pages deploy dist

# 或者推送一个空提交触发 GitHub 自动部署
git commit --allow-empty -m "Trigger deployment"
git push
```

---

## 7. 验证部署

### 7.1 访问网站

部署成功后，Cloudflare 会提供一个 URL，例如：
- `https://webstack-nav.pages.dev`
- 或自定义域名：`https://nav.yourdomain.com`

### 7.2 验证前端功能

1. 打开网站首页
2. 检查页面是否正常加载
3. 测试主题切换（深色/浅色）
4. 测试语言切换（中文/英文）
5. 检查分类筛选功能

### 7.3 验证 API 功能

在浏览器控制台执行：

```javascript
// 测试获取网站列表
fetch('/api/sites')
  .then(res => res.json())
  .then(data => console.log('Sites:', data))

// 测试获取分类
fetch('/api/categories')
  .then(res => res.json())
  .then(data => console.log('Categories:', data))

// 测试获取设置
fetch('/api/settings')
  .then(res => res.json())
  .then(data => console.log('Settings:', data))
```

应该返回 JSON 数据，而不是错误。

### 7.4 测试管理后台

1. 访问 `/login` 页面
2. 使用默认账号登录：
   - 用户名：`admin`
   - 密码：`sorrysir`
3. 登录成功后进入管理后台
4. 尝试添加一个新网站
5. 刷新页面，检查数据是否保存

### 7.5 验证 KV 数据存储

#### 方法一：通过 Wrangler 查看

```bash
# 列出 KV 中的所有键
wrangler kv:key list --namespace-id=你的命名空间ID

# 获取特定键的值
wrangler kv:key get "sites" --namespace-id=你的命名空间ID
```

#### 方法二：通过 Dashboard 查看

1. 进入 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **KV**
3. 选择你的命名空间（`webstack-navigation-WEBSTACK_DATA`）
4. 应该能看到以下键：
   - `sites`
   - `categories`
   - `settings`
   - `admin_account`

### 7.6 测试数据持久化

1. 在管理后台添加一个新网站
2. 刷新页面
3. 检查新网站是否还在
4. 在不同浏览器或设备上访问，检查数据是否一致

---

## 8. 常见问题

### Q1: 部署后网站显示空白

**原因**：KV 命名空间未正确绑定

**解决方法**：
1. 检查 wrangler.toml 中的 KV ID 是否正确
2. 在 Cloudflare Dashboard 中确认 KV 绑定是否存在
3. 重新部署项目

### Q2: API 返回 500 错误

**原因**：Functions 无法访问 KV 存储

**解决方法**：
1. 检查 KV 绑定的变量名是否为 `WEBSTACK_DATA`
2. 检查 KV 命名空间 ID 是否正确
3. 查看 Cloudflare Dashboard 中的 Functions 日志

### Q3: 管理后台登录失败

**原因**：管理员账户未初始化

**解决方法**：
1. 首次访问会自动初始化默认账号
2. 如果还是失败，手动通过 API 创建：
   ```bash
   curl -X PUT https://your-site.pages.dev/api/auth \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"sorrysir"}'
   ```

### Q4: 数据无法保存

**原因**：KV 写入失败或权限问题

**解决方法**：
1. 检查 KV 命名空间是否有写入权限
2. 查看 Cloudflare Dashboard 中的 KV 使用情况
3. 检查是否超过免费额度（免费版每天 100,000 次读取，1,000 次写入）

### Q5: 如何更新已部署的网站？

**方法一：通过管理后台更新**
1. 登录管理后台
2. 直接添加/编辑网站和分类
3. 数据实时保存到 KV

**方法二：通过代码更新**
1. 修改代码后提交到 GitHub
2. Cloudflare Pages 自动部署
3. 数据保持不变（存储在 KV 中）

### Q6: 如何查看部署日志？

**方法一：Wrangler 命令行**
```bash
# 查看实时日志
wrangler pages deployment tail --project-name=webstack-nav
```

**方法二：Dashboard**
1. 进入 Cloudflare Dashboard
2. 选择 Pages 项目
3. 进入 **Logs** 标签
4. 可以查看访问日志和错误日志

### Q7: 如何绑定自定义域名？

1. 进入 Cloudflare Dashboard
2. 选择 Pages 项目
3. 进入 **Custom domains**
4. 点击 **Set up a custom domain**
5. 输入你的域名（例如：`nav.yourdomain.com`）
6. 按照提示配置 DNS 记录

### Q8: KV 存储有限制吗？

**免费版限制**：
- 每天读取：100,000 次
- 每天写入：1,000 次
- 存储：1 GB
- 键值对：无限

**付费版**：
- 每月 $0.50/GB
- 读取：$0.50/百万次
- 写入：$5.00/百万次

对于个人导航网站，免费版完全够用。

### Q9: 如何备份数据？

**方法一：通过 Wrangler 导出**
```bash
# 导出所有数据
wrangler kv:key list --namespace-id=你的ID --prefix="" > backup.json
```

**方法二：通过 API 导出**
```javascript
// 在浏览器控制台执行
Promise.all([
  fetch('/api/sites').then(r => r.json()),
  fetch('/api/categories').then(r => r.json()),
  fetch('/api/settings').then(r => r.json())
]).then(([sites, categories, settings]) => {
  const backup = { sites: sites.data, categories: categories.data, settings: settings.data }
  console.log(JSON.stringify(backup, null, 2))
})
```

### Q10: 如何迁移数据到新的 KV 命名空间？

```bash
# 导出旧数据
wrangler kv:key list --namespace-id=旧ID --prefix="" > backup.json

# 导入新数据
# 需要编写脚本逐个写入键值对
```

---

## 9. 维护和监控

### 9.1 监控 KV 使用情况

1. 进入 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **KV**
3. 查看使用统计

### 9.2 定期备份数据

建议每周备份一次数据：

```bash
# 创建备份脚本 backup-kv.sh
#!/bin/bash
DATE=$(date +%Y%m%d)
wrangler kv:key list --namespace-id=你的ID --prefix="" > backup-$DATE.json
echo "Backup created: backup-$DATE.json"
```

### 9.3 更新项目

```bash
# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 构建并部署
npm run build
wrangler pages deploy dist
```

---

## 10. 故障排查

### 10.1 检查部署状态

```bash
# 列出所有部署
wrangler pages deployment list --project-name=webstack-nav
```

### 10.2 查看实时日志

```bash
# 实时查看日志
wrangler pages deployment tail --project-name=webstack-nav
```

### 10.3 测试 Functions

```bash
# 直接测试 Function
wrangler pages dev dist --kv=WEBSTACK_DATA
```

### 10.4 检查网络请求

在浏览器开发者工具中：
1. 打开 Network 标签
2. 刷新页面
3. 检查 API 请求：
   - `/api/sites` - 应该返回 200
   - `/api/categories` - 应该返回 200
   - `/api/settings` - 应该返回 200

---

## 11. 安全建议

1. **修改默认密码**：首次登录后立即修改管理员密码
2. **启用 HTTPS**：Cloudflare Pages 自动提供免费 SSL 证书
3. **限制访问**：如果需要，可以在 Functions 中添加访问控制
4. **定期备份**：定期备份 KV 数据
5. **监控日志**：定期检查访问日志，发现异常访问

---

## 12. 性能优化

1. **启用缓存**：在 wrangler.toml 中添加缓存配置
2. **压缩资源**：Vite 默认已启用压缩
3. **使用 CDN**：Cloudflare Pages 自动提供全球 CDN
4. **优化图片**：使用 WebP 格式，压缩图片大小

---

## 总结

通过以上步骤，你应该能够成功将 WebStack 导航网站部署到 Cloudflare Pages，并使用 Cloudflare KV 进行数据存储。

**关键要点**：
- ✅ 正确创建和配置 KV 命名空间
- ✅ 在 wrangler.toml 中正确配置 KV 绑定
- ✅ 在 Cloudflare Dashboard 中绑定 KV 到 Pages 项目
- ✅ 绑定后必须重新部署
- ✅ 定期备份和监控

如有问题，请参考 [常见问题](#8-常见问题) 或查看 Cloudflare 官方文档。
