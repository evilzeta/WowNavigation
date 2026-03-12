import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '..', 'data.json')

// 从已部署的API获取最新设置
async function fetchSettingsFromAPI() {
  try {
    // 从已部署的网站获取设置
    const response = await fetch('https://webstacknav.pages.dev/api/settings')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    if (result.success && result.data) {
      console.log('成功从API获取设置:', result.data)
      return result.data
    }
    throw new Error('API返回数据格式错误')
  } catch (error) {
    console.error('从API获取设置失败:', error.message)
    console.log('使用本地data.json中的设置')
    return null
  }
}

// 更新本地data.json文件
function updateLocalDataFile(newSettings) {
  try {
    let data = {}
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
      data = JSON.parse(fileContent)
    }
    
    // 更新设置
    data.settings = newSettings
    
    // 写回文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    console.log('已更新本地data.json文件')
  } catch (error) {
    console.error('更新本地文件失败:', error)
  }
}

// 主函数
async function main() {
  console.log('开始从API获取最新设置...')
  
  const settings = await fetchSettingsFromAPI()
  
  if (settings) {
    updateLocalDataFile(settings)
    console.log('设置同步完成!')
  } else {
    console.log('使用本地设置，无需更新')
  }
}

// 运行
main()
