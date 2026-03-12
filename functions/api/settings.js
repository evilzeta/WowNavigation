// 默认设置
const DEFAULT_SETTINGS = {
  siteTitle: 'WowNavigation',
  siteDescription: '发现优质网站资源',
  siteFooter: '© {{year}} WowNavigation. 保留所有权利.',
  sitesPerPage: 20,
  autoFetchInfo: true,
  enableCache: true,
  defaultCategory: 'all'
}

// CORS 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
}

// 处理 OPTIONS 请求
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders
  })
}

// 获取设置
async function getSettings(env) {
  try {
    const data = await env.WEBSTACK_DATA.get('settings')
    if (data) {
      return JSON.parse(data)
    }
    // 如果没有数据，初始化默认数据
    await env.WEBSTACK_DATA.put('settings', JSON.stringify(DEFAULT_SETTINGS))
    return DEFAULT_SETTINGS
  } catch (error) {
    console.error('获取设置失败:', error)
    return DEFAULT_SETTINGS
  }
}

// 保存设置
async function saveSettings(env, settings) {
  await env.WEBSTACK_DATA.put('settings', JSON.stringify(settings))
}

// 验证身份验证token
async function verifyAuth(env, request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false
    }
    
    const token = authHeader.substring(7)
    const authData = await env.WEBSTACK_DATA.get('auth_token')
    
    if (!authData) {
      return false
    }
    
    const storedToken = JSON.parse(authData)
    const now = Date.now()
    
    if (storedToken.expiresAt < now) {
      await env.WEBSTACK_DATA.delete('auth_token')
      return false
    }
    
    return token === storedToken.token
  } catch (error) {
    console.error('验证失败:', error)
    return false
  }
}

export async function onRequest(context) {
  const { request, env } = context
  const method = request.method

  // 处理 CORS 预检请求
  if (method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    // GET - 获取设置
    if (method === 'GET') {
      const settings = await getSettings(env)
      
      return new Response(JSON.stringify({
        success: true,
        data: settings
      }), {
        headers: corsHeaders
      })
    }

    // PUT - 更新设置
    if (method === 'PUT') {
      const isAuthenticated = await verifyAuth(env, request)
      if (!isAuthenticated) {
        return new Response(JSON.stringify({
          success: false,
          error: '未授权访问'
        }), {
          status: 401,
          headers: corsHeaders
        })
      }
      
      const updateData = await request.json()
      const settings = await getSettings(env)
      
      const newSettings = {
        ...settings,
        ...updateData
      }
      
      await saveSettings(env, newSettings)
      
      return new Response(JSON.stringify({
        success: true,
        data: newSettings
      }), {
        headers: corsHeaders
      })
    }

    return new Response(JSON.stringify({
      success: false,
      error: '不支持的请求方法'
    }), {
      status: 405,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('API错误:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    })
  }
}
