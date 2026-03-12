const fs = require('fs')
const path = require('path')

async function generateLoginPage() {
  console.log('开始生成登录页面...')

  const distPath = path.join(__dirname, '..', 'dist')
  const loginDir = path.join(distPath, 'login')

  if (!fs.existsSync(distPath)) {
    console.error('dist目录不存在，请先运行构建命令')
    return
  }

  if (!fs.existsSync(loginDir)) {
    fs.mkdirSync(loginDir, { recursive: true })
  }

  const indexPath = path.join(distPath, 'index.html')
  const loginIndexPath = path.join(loginDir, 'index.html')

  if (!fs.existsSync(indexPath)) {
    console.error('index.html不存在，请先运行构建命令')
    return
  }

  let indexContent = fs.readFileSync(indexPath, 'utf-8')

  const loginContent = indexContent
    .replace(/<title>.*?<\/title>/, '<title>登录 - WebStack导航</title>')
    .replace(/<script src="\/assets\/Home-.*?\.js"><\/script>/, '<script src="/assets/Login-d30d78bb.js"></script>')

  fs.writeFileSync(loginIndexPath, loginContent, 'utf-8')

  console.log('登录页面生成成功:', loginIndexPath)
  console.log('登录页面生成完成!')
}

generateLoginPage().catch(console.error)