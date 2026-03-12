import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, '..', 'dist')
const ROOT_DIR = path.join(__dirname, '..')

// 读取已生成的HTML模板
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

// 读取本地数据
function getLocalData() {
  const dataFilePath = path.join(ROOT_DIR, 'data.json')
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('读取本地数据失败:', error)
    return { sites: [], categories: [], settings: {} }
  }
}

// 生成收藏页面
function generateFavoritesPage() {
  console.log('生成收藏页面...')
  let template = getTemplate()
  const settings = getLocalSettings()
  const siteTitle = settings.siteTitle || 'WebStack导航'
  
  // 替换title标签
  template = template.replace(
    /<title>.*?<\/title>/,
    `<title>收藏本站 - ${siteTitle}</title>`
  )
  
  // 替换meta描述
  template = template.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="查看您收藏的网站 - ${siteTitle}">`
  )
  
  // 保存收藏页面
  const favoritesDir = path.join(DIST_DIR, 'favorites')
  if (!fs.existsSync(favoritesDir)) {
    fs.mkdirSync(favoritesDir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(favoritesDir, 'index.html'), template, 'utf-8')
  console.log('收藏页面生成成功:', path.join(favoritesDir, 'index.html'))
}

// 生成网站地图页面
function generateSitemapPage() {
  console.log('生成网站地图页面...')
  let template = getTemplate()
  const settings = getLocalSettings()
  const siteTitle = settings.siteTitle || 'WebStack导航'
  
  // 替换title标签
  template = template.replace(
    /<title>.*?<\/title>/,
    `<title>网站地图 - ${siteTitle}</title>`
  )
  
  // 替换meta描述
  template = template.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="浏览所有网站资源 - ${siteTitle}">`
  )
  
  // 保存网站地图页面
  const sitemapDir = path.join(DIST_DIR, 'sitemap')
  if (!fs.existsSync(sitemapDir)) {
    fs.mkdirSync(sitemapDir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(sitemapDir, 'index.html'), template, 'utf-8')
  console.log('网站地图页面生成成功:', path.join(sitemapDir, 'index.html'))
}

// 生成联系我们页面
function generateContactPage() {
  console.log('生成联系我们页面...')
  let template = getTemplate()
  const settings = getLocalSettings()
  const siteTitle = settings.siteTitle || 'WebStack导航'
  
  // 替换title标签
  template = template.replace(
    /<title>.*?<\/title>/,
    `<title>联系我们 - ${siteTitle}</title>`
  )
  
  // 替换meta描述
  template = template.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="联系我们获取更多信息 - ${siteTitle}">`
  )
  
  // 保存联系我们页面
  const contactDir = path.join(DIST_DIR, 'contact')
  if (!fs.existsSync(contactDir)) {
    fs.mkdirSync(contactDir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(contactDir, 'index.html'), template, 'utf-8')
  console.log('联系我们页面生成成功:', path.join(contactDir, 'index.html'))
}

// 生成XML网站地图
function generateXmlSitemap() {
  console.log('生成XML网站地图...')
  const data = getLocalData()
  const baseUrl = 'https://webstacknav.pages.dev'
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  // 主页
  xml += '  <url>\n'
  xml += '    <loc>' + baseUrl + '/</loc>\n'
  xml += '    <priority>1.0</priority>\n'
  xml += '  </url>\n'
  
  // About页面
  xml += '  <url>\n'
  xml += '    <loc>' + baseUrl + '/about</loc>\n'
  xml += '    <priority>0.8</priority>\n'
  xml += '  </url>\n'
  
  // 收藏页面
  xml += '  <url>\n'
  xml += '    <loc>' + baseUrl + '/favorites</loc>\n'
  xml += '    <priority>0.7</priority>\n'
  xml += '  </url>\n'
  
  // 网站地图页面
  xml += '  <url>\n'
  xml += '    <loc>' + baseUrl + '/sitemap</loc>\n'
  xml += '    <priority>0.6</priority>\n'
  xml += '  </url>\n'
  
  // 联系我们页面
  xml += '  <url>\n'
  xml += '    <loc>' + baseUrl + '/contact</loc>\n'
  xml += '    <priority>0.7</priority>\n'
  xml += '  </url>\n'
  
  // 分类页面
  data.categories.forEach(category => {
    xml += '  <url>\n'
    xml += '    <loc>' + baseUrl + '/category/' + category.id + '.html</loc>\n'
    xml += '    <priority>0.7</priority>\n'
    xml += '  </url>\n'
  })
  
  // 网站详情页
  data.sites.forEach(site => {
    xml += '  <url>\n'
    xml += '    <loc>' + baseUrl + '/detail/index.html?id=' + site.id + '</loc>\n'
    xml += '    <priority>0.6</priority>\n'
    xml += '  </url>\n'
  })
  
  xml += '</urlset>'
  
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml, 'utf-8')
  console.log('XML网站地图生成成功:', path.join(DIST_DIR, 'sitemap.xml'))
}

// 主函数
function main() {
  console.log('开始生成收藏、网站地图和联系我们页面...')
  
  try {
    generateFavoritesPage()
    generateSitemapPage()
    generateContactPage()
    generateXmlSitemap()
    console.log('所有页面生成完成!')
  } catch (error) {
    console.error('生成页面失败:', error)
    process.exit(1)
  }
}

main()
