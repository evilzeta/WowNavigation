import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, '..', 'dist')
const DATA_FILE = path.join(__dirname, '..', 'data.json')

// 从本地文件读取数据
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('读取数据文件失败:', error)
    return {
      sites: [],
      categories: [],
      settings: {},
      logoCache: {}
    }
  }
}

const mockData = loadData()

// 读取HTML模板
function getTemplate() {
  const templatePath = path.join(DIST_DIR, 'index.html')
  return fs.readFileSync(templatePath, 'utf-8')
}

// 创建静态页面 - 简化版本，直接修改HTML
function generateStaticPage(componentName, data) {
  try {
    // 获取模板
    let template = getTemplate()
    
    // 获取设置信息
    const settings = data.settings || {}
    const siteTitle = settings.siteTitle || 'WebStack导航'
    const siteDescription = settings.siteDescription || '发现优质网站资源'
    const siteFooter = settings.siteFooter || ''
    
    // 检查是否已经有meta标签（避免重复添加）
    const hasMetaTags = template.includes('<meta name="description"')
    
    if (!hasMetaTags) {
      // 替换title标签
      template = template.replace(
        /<title>.*?<\/title>/,
        `<title>${siteTitle}</title>`
      )
      
      // 添加SEO meta标签
      const metaTags = `
  <meta name="description" content="${siteDescription}">
  <meta name="keywords" content="网站导航,资源推荐,${siteTitle}">
  <meta property="og:title" content="${siteTitle}">
  <meta property="og:description" content="${siteDescription}">
  <meta property="og:type" content="website">
`
      
      // 在viewport meta标签后插入SEO meta标签
      template = template.replace(
        /<meta name="viewport"[^>]*>/,
        `$&${metaTags}`
      )
    }
    
    // 只注入设置信息，不注入网站数据（让页面从API获取最新数据）
    const dataScript = `<script>window.__STATIC_DATA__ = ${JSON.stringify({
      settings: settings,
      selectedCategory: data.selectedCategory || null
    })}</script>`
    template = template.replace(
      '<div id="app"></div>',
      `${dataScript}<div id="app"></div>`
    )
    
    return template
  } catch (error) {
    console.error(`生成页面失败 ${componentName}:`, error)
    throw error
  }
}

// 生成主页
function generateHomePage() {
  console.log('生成主页...')
  const html = generateStaticPage('Home', mockData)
  const outputPath = path.join(DIST_DIR, 'index.html')
  fs.writeFileSync(outputPath, html, 'utf-8')
  console.log('主页生成成功:', outputPath)
}

// 生成详情页 - 使用静态模板方式
function generateDetailPage() {
  console.log('生成详情页模板...')
  const detailDir = path.join(DIST_DIR, 'detail')
  
  if (!fs.existsSync(detailDir)) {
    fs.mkdirSync(detailDir, { recursive: true })
  }

  // 只生成一个通用的详情页模板，包含设置信息
  console.log('生成通用详情页模板')
  
  // 获取模板
  let template = getTemplate()
  
  // 检查是否已经有meta标签（避免重复添加）
  const hasMetaTags = template.includes('<meta name="description"')
  
  if (!hasMetaTags) {
    // 替换title标签为通用标题
    template = template.replace(
      /<title>.*?<\/title>/,
      '<title>网站详情 - WebStack导航</title>'
    )
    
    // 添加SEO meta标签
    const metaTags = `
  <meta name="description" content="查看网站详细信息">
  <meta name="keywords" content="网站详情,网站导航">
  <meta property="og:title" content="网站详情">
  <meta property="og:description" content="查看网站详细信息">
  <meta property="og:type" content="website">
`
    
    // 在viewport meta标签后插入SEO meta标签
    template = template.replace(
      /<meta name="viewport"[^>]*>/,
      `$&${metaTags}`
    )
  }
  
  // 只注入设置信息，不注入网站数据（让页面从API获取最新数据）
  const dataScript = `<script>window.__STATIC_DATA__ = ${JSON.stringify({
    settings: mockData.settings,
    isStaticTemplate: true
  })}</script>`
  template = template.replace(
    '<div id="app"></div>',
    `${dataScript}<div id="app"></div>`
  )
  
  const outputPath = path.join(detailDir, 'index.html')
  fs.writeFileSync(outputPath, template, 'utf-8')
  console.log('详情页模板生成成功:', outputPath)
}

// 生成分类页面
function generateCategoryPages() {
  console.log('生成分类页面...')
  const categoryDir = path.join(DIST_DIR, 'category')
  
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true })
  }

  for (const category of mockData.categories) {
    if (category.id === 'all') continue
    
    console.log(`生成分类页面: ${category.name}`)
    const html = generateStaticPage('Home', {
      ...mockData,
      selectedCategory: category.id
    })
    const outputPath = path.join(categoryDir, `${category.id}.html`)
    fs.writeFileSync(outputPath, html, 'utf-8')
    console.log('分类页面生成成功:', outputPath)
  }
}

// 主函数
async function generateStatic() {
  console.log('开始生成静态页面...')
  console.log('数据文件:', DATA_FILE)
  console.log('输出目录:', DIST_DIR)
  
  try {
    // 确保dist目录存在
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true })
    }

    console.log('网站数量:', mockData.sites.length)
    console.log('分类数量:', mockData.categories.length)

    // 生成主页
    await generateHomePage()

    // 生成详情页模板
    await generateDetailPage()

    // 生成分类页面
    await generateCategoryPages()

    console.log('静态页面生成完成!')
    console.log('生成的页面:')
    console.log('  - 主页: index.html')
    console.log('  - 详情页: detail/index.html (通用模板)')
    console.log('  - 分类页: category/[id].html')
  } catch (error) {
    console.error('静态页面生成失败:', error)
    process.exit(1)
  }
}

// 运行生成脚本
generateStatic()
