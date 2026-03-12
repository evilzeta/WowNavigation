import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, '..')
const DATA_FILE = path.join(ROOT_DIR, 'data.json')
const DIST_DIR = path.join(ROOT_DIR, 'dist')

// 读取数据文件
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('读取数据文件失败:', error)
    return { sites: [], categories: [], settings: {} }
  }
}

// 生成sitemap.xml
function generateSitemap(data) {
  const settings = data.settings || {}
  const sites = data.sites || []
  const categories = data.categories || []
  
  // 获取网站URL（从环境变量或使用默认值）
  const baseUrl = process.env.SITE_URL || 'https://webstacknav.pages.dev'
  
  const currentDate = new Date().toISOString()
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
  
  // 添加主页
  xml += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`
  
  // 添加分类页面
  categories.forEach(category => {
    if (category.id === 'all') return
    xml += `  <url>
    <loc>${baseUrl}/category/${category.slug}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
  })
  
  // 添加网站详情页
  sites.forEach(site => {
    if (!site.is_visible) return
    xml += `  <url>
    <loc>${baseUrl}/detail?id=${site.id}</loc>
    <lastmod>${site.updated_at || site.created_at || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
  })
  
  xml += `</urlset>`
  
  return xml
}

// 生成robots.txt
function generateRobotsTxt(data) {
  const settings = data.settings || {}
  const baseUrl = process.env.SITE_URL || 'https://webstacknav.pages.dev'
  
  let robots = `# Robots.txt for ${settings.siteTitle || 'WebStack导航'}
# Generated on ${new Date().toISOString()}

User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin pages
Disallow: /admin
Disallow: /login

# Crawl-delay (optional)
Crawl-delay: 1
`
  
  return robots
}

// 主函数
async function generate() {
  console.log('开始生成SEO文件...')
  
  try {
    // 确保dist目录存在
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true })
    }
    
    // 读取数据
    const data = loadData()
    
    // 生成sitemap.xml
    console.log('生成sitemap.xml...')
    const sitemapXml = generateSitemap(data)
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8')
    console.log('sitemap.xml生成成功')
    
    // 生成robots.txt
    console.log('生成robots.txt...')
    const robotsTxt = generateRobotsTxt(data)
    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8')
    console.log('robots.txt生成成功')
    
    console.log('SEO文件生成完成!')
  } catch (error) {
    console.error('生成SEO文件失败:', error)
    process.exit(1)
  }
}

// 运行生成脚本
generate()
