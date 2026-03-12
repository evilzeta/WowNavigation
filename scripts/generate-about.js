const fs = require('fs')
const path = require('path')

async function generateAboutPage() {
  console.log('开始生成关于我们页面...')

  const distPath = path.join(__dirname, '..', 'dist')
  const aboutDir = path.join(distPath, 'about')

  if (!fs.existsSync(distPath)) {
    console.error('dist目录不存在，请先运行构建命令')
    return
  }

  if (!fs.existsSync(aboutDir)) {
    fs.mkdirSync(aboutDir, { recursive: true })
  }

  const indexPath = path.join(distPath, 'index.html')
  const aboutIndexPath = path.join(aboutDir, 'index.html')

  if (!fs.existsSync(indexPath)) {
    console.error('index.html不存在，请先运行构建命令')
    return
  }

  let indexContent = fs.readFileSync(indexPath, 'utf-8')

  const aboutContent = indexContent
    .replace(/<title>.*?<\/title>/, '<title>关于我们 - WebStack导航</title>')
    .replace(/<script src="\/assets\/Home-.*?\.js"><\/script>/, '<script src="/assets/About-de3b538d.js"></script>')

  fs.writeFileSync(aboutIndexPath, aboutContent, 'utf-8')

  console.log('关于我们页面生成成功:', aboutIndexPath)
  console.log('关于我们页面生成完成!')
}

generateAboutPage().catch(console.error)