import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, '..', 'dist')
const ROOT_DIR = path.join(__dirname, '..')

// 读取已生成的HTML模板（已经包含设置信息）
function getTemplate() {
  const templatePath = path.join(DIST_DIR, 'index.html')
  return fs.readFileSync(templatePath, 'utf-8')
}

// 读取本地设置
function getLocalSettings() {
  const dataFilePath = path.join(ROOT_DIR, 'data.json')
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    return parsed.settings || {}
  } catch (error) {
    console.error('读取本地设置失败:', error)
    return {}
  }
}

// 创建动态详情页模板
function generateDetailTemplate() {
  console.log('生成动态详情页模板...')
  const detailDir = path.join(DIST_DIR, 'detail')
  
  if (!fs.existsSync(detailDir)) {
    fs.mkdirSync(detailDir, { recursive: true })
  }

  // 获取模板（已包含设置信息）
  let template = getTemplate()
  
  // 获取本地设置
  const settings = getLocalSettings()
  const siteTitle = settings.siteTitle || 'WebStack导航'
  const siteDescription = settings.siteDescription || '发现优质网站资源'
  
  // 替换title标签为详情页标题
  template = template.replace(
    /<title>.*?<\/title>/,
    `<title>网站详情 - ${siteTitle}</title>`
  )
  
  // 替换description meta标签
  template = template.replace(
    /<meta name="description"[^>]*content="[^"]*"[^>]*>/,
    `<meta name="description" content="${siteDescription}">`
  )
  
  // 替换og:description meta标签
  template = template.replace(
    /<meta property="og:description"[^>]*content="[^"]*"[^>]*>/,
    `<meta property="og:description" content="${siteDescription}">`
  )
  
  // 替换og:title meta标签
  template = template.replace(
    /<meta property="og:title"[^>]*content="[^"]*"[^>]*>/,
    `<meta property="og:title" content="网站详情 - ${siteTitle}">`
  )
  
  // 替换keywords meta标签
  template = template.replace(
    /<meta name="keywords"[^>]*content="[^"]*"[^>]*>/,
    `<meta name="keywords" content="网站详情,网站导航,${siteTitle}">`
  )
  
  // 创建动态数据加载脚本
  const dataScript = `
<script>
// 动态加载详情页数据
window.__DYNAMIC_DETAIL__ = true
window.__SITE_ID__ = new URLSearchParams(window.location.search).get('id')
<\/script>
`
  
  // 在HTML中注入脚本
  template = template.replace(
    '<div id="app"></div>',
    `${dataScript}<div id="app"></div>`
  )
  
  const outputPath = path.join(detailDir, 'index.html')
  fs.writeFileSync(outputPath, template, 'utf-8')
  console.log('动态详情页模板生成成功:', outputPath)
}

// 主函数
async function generate() {
  console.log('开始生成动态详情页模板...')
  
  try {
    // 确保dist目录存在
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true })
    }

    // 生成动态详情页模板
    await generateDetailTemplate()

    console.log('动态详情页模板生成完成!')
  } catch (error) {
    console.error('生成失败:', error)
    process.exit(1)
  }
}

// 运行生成脚本
generate()
