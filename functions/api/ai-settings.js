// 默认AI设置
const DEFAULT_AI_SETTINGS = {
  provider: 'deepseek',
  apiKey: '',
  apiUrl: '',
  model: 'deepseek-chat',
  maxLength: 200,
  promptTemplate: '请为以下网站生成一个简洁的描述（200字以内）：网站名称：{name}，网址：{url}'
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

// 获取AI设置
async function getAISettings(env) {
  try {
    const data = await env.WEBSTACK_DATA.get('ai_settings')
    if (data) {
      const settings = JSON.parse(data)
      return { ...DEFAULT_AI_SETTINGS, ...settings }
    }
    return DEFAULT_AI_SETTINGS
  } catch (error) {
    console.error('获取AI设置失败:', error)
    return DEFAULT_AI_SETTINGS
  }
}

// 保存AI设置
async function saveAISettings(env, settings) {
  await env.WEBSTACK_DATA.put('ai_settings', JSON.stringify(settings))
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

  if (method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    if (method === 'GET') {
      const settings = await getAISettings(env)
      
      return new Response(JSON.stringify({
        success: true,
        data: settings
      }), {
        headers: corsHeaders
      })
    }

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
      const currentSettings = await getAISettings(env)
      
      const newSettings = {
        ...currentSettings,
        ...updateData
      }
      
      await saveAISettings(env, newSettings)
      
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