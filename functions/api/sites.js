// 默认网站数据
const DEFAULT_SITES = [
  {
    id: 1,
    name: 'GitHub',
    url: 'https://github.com',
    logo: 'https://github.githubassets.com/favicons/favicon.png',
    description: '全球最大的开源代码托管平台',
    category_id: 'dev',
    tags: '开发,代码,Git',
    stars: 5,
    visits: 1500,
    is_visible: true,
    is_active: true,
    health_score: 100,
    created_at: new Date().toISOString(),
    last_checked: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Vue.js',
    url: 'https://vuejs.org',
    logo: 'https://vuejs.org/logo.svg',
    description: '渐进式JavaScript框架',
    category_id: 'dev',
    tags: '前端,Vue,框架',
    stars: 5,
    visits: 1200,
    is_visible: true,
    is_active: true,
    health_score: 100,
    created_at: new Date().toISOString(),
    last_checked: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    logo: 'https://tailwindcss.com/favicon-32x32.png',
    description: '实用优先的CSS框架',
    category_id: 'dev',
    tags: '前端,CSS,框架',
    stars: 4,
    visits: 800,
    is_visible: true,
    is_active: true,
    health_score: 100,
    created_at: new Date().toISOString(),
    last_checked: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Figma',
    url: 'https://figma.com',
    logo: 'https://static.figma.com/app/icon/1/touch-180.png',
    description: '协作式界面设计工具',
    category_id: 'design',
    tags: '设计,UI,协作',
    stars: 5,
    visits: 900,
    is_visible: true,
    is_active: true,
    health_score: 100,
    created_at: new Date().toISOString(),
    last_checked: new Date().toISOString()
  },
  {
    id: 5,
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    logo: 'https://chat.openai.com/favicon-32x32.png',
    description: 'OpenAI的AI聊天机器人',
    category_id: 'ai',
    tags: 'AI,聊天,GPT',
    stars: 5,
    visits: 2000,
    is_visible: true,
    is_active: true,
    health_score: 100,
    created_at: new Date().toISOString(),
    last_checked: new Date().toISOString()
  }
]

// CORS 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=300, s-maxage=600'
}

// 处理 OPTIONS 请求（CORS 预检）
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders
  })
}

// 获取所有网站
async function getSites(env) {
  try {
    const data = await env.WEBSTACK_DATA.get('sites')
    if (data) {
      return JSON.parse(data)
    }
    // 如果没有数据，初始化默认数据
    await env.WEBSTACK_DATA.put('sites', JSON.stringify(DEFAULT_SITES))
    return DEFAULT_SITES
  } catch (error) {
    console.error('获取网站数据失败:', error)
    return DEFAULT_SITES
  }
}

// 保存所有网站
async function saveSites(env, sites) {
  await env.WEBSTACK_DATA.put('sites', JSON.stringify(sites))
}

// 验证网站数据
function validateSiteData(data) {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: '网站名称不能为空' }
  }
  
  if (!data.url || typeof data.url !== 'string' || !isValidUrl(data.url)) {
    return { valid: false, error: '网站URL格式不正确' }
  }
  
  if (data.description && typeof data.description !== 'string') {
    return { valid: false, error: '描述必须是字符串' }
  }
  
  if (data.category_id && typeof data.category_id !== 'string') {
    return { valid: false, error: '分类ID必须是字符串' }
  }
  
  return { valid: true }
}

// 验证URL格式
function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
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
  const url = new URL(request.url)
  const method = request.method

  // 处理 CORS 预检请求
  if (method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    // GET - 获取所有网站
    if (method === 'GET') {
      const sites = await getSites(env)
      // 只返回可见的网站给前端（除非是管理员请求）
      const showAll = url.searchParams.get('all') === 'true'
      const filteredSites = showAll ? sites : sites.filter(s => s.is_visible !== false)
      
      return new Response(JSON.stringify({
        success: true,
        data: filteredSites
      }), {
        headers: corsHeaders
      })
    }

    // POST - 添加新网站
    if (method === 'POST') {
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
      
      const newSite = await request.json()
      const validation = validateSiteData(newSite)
      if (!validation.valid) {
        return new Response(JSON.stringify({
          success: false,
          error: validation.error
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      const sites = await getSites(env)
      
      // 生成新ID
      const maxId = sites.reduce((max, s) => Math.max(max, s.id || 0), 0)
      newSite.id = maxId + 1
      newSite.created_at = new Date().toISOString()
      newSite.updated_at = new Date().toISOString()
      newSite.visits = newSite.visits || 0
      newSite.health_score = 100
      newSite.is_active = true
      
      sites.unshift(newSite)
      await saveSites(env, sites)
      
      return new Response(JSON.stringify({
        success: true,
        data: newSite
      }), {
        headers: corsHeaders
      })
    }

    // PUT - 更新网站
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
      const validation = validateSiteData(updateData)
      if (!validation.valid) {
        return new Response(JSON.stringify({
          success: false,
          error: validation.error
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      const sites = await getSites(env)
      
      const index = sites.findIndex(s => s.id == updateData.id)
      if (index === -1) {
        return new Response(JSON.stringify({
          success: false,
          error: '网站不存在'
        }), {
          status: 404,
          headers: corsHeaders
        })
      }
      
      sites[index] = {
        ...sites[index],
        ...updateData,
        updated_at: new Date().toISOString()
      }
      
      await saveSites(env, sites)
      
      return new Response(JSON.stringify({
        success: true,
        data: sites[index]
      }), {
        headers: corsHeaders
      })
    }

    // DELETE - 删除网站
    if (method === 'DELETE') {
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
      
      const { id } = await request.json()
      if (!id) {
        return new Response(JSON.stringify({
          success: false,
          error: '网站ID不能为空'
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      const sites = await getSites(env)
      
      const filteredSites = sites.filter(s => s.id != id)
      if (filteredSites.length === sites.length) {
        return new Response(JSON.stringify({
          success: false,
          error: '网站不存在'
        }), {
          status: 404,
          headers: corsHeaders
        })
      }
      
      await saveSites(env, filteredSites)
      
      return new Response(JSON.stringify({
        success: true,
        message: '删除成功'
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
