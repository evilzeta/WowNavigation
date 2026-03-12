// CORS 响应�?
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

// 处理 OPTIONS 请求
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders
  })
}

// 获取所有网�?
async function getSites(env) {
  try {
    const data = await env.WOW_NAV_DATA.get('sites')
    if (data) {
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('获取网站数据失败:', error)
    return []
  }
}

// 保存所有网�?
async function saveSites(env, sites) {
  await env.WOW_NAV_DATA.put('sites', JSON.stringify(sites))
}

// 获取页面浏览�?
async function getPageViews(env) {
  try {
    const data = await env.WOW_NAV_DATA.get('pageViews')
    if (data) {
      const pv = parseInt(data)
      if (pv === 0) {
        await env.WOW_NAV_DATA.put('pageViews', '1426')
        return 1426
      }
      return pv
    }
    await env.WOW_NAV_DATA.put('pageViews', '1426')
    return 1426
  } catch (error) {
    console.error('获取页面浏览量失�?', error)
    return 1426
  }
}

// 确保PV已初始化为基础�?
async function ensurePVInitialized(env) {
  try {
    const data = await env.WOW_NAV_DATA.get('pageViews')
    if (!data || parseInt(data) < 1426) {
      await env.WOW_NAV_DATA.put('pageViews', '1426')
    }
  } catch (error) {
    console.error('初始化PV失败:', error)
  }
}

// 增加页面浏览�?
async function incrementPageViews(env) {
  try {
    let currentViews = await getPageViews(env)
    
    if (currentViews < 1426) {
      currentViews = 1426
    }
    
    const newViews = currentViews + 1
    await env.WOW_NAV_DATA.put('pageViews', newViews.toString())
    return newViews
  } catch (error) {
    console.error('增加页面浏览量失�?', error)
    return 1426
  }
}

// 获取UV（独立访客数�?
async function getUniqueVisitors(env) {
  try {
    const data = await env.WOW_NAV_DATA.get('uniqueVisitors')
    if (data) {
      const uv = parseInt(data)
      if (uv === 0) {
        await env.WOW_NAV_DATA.put('uniqueVisitors', '713')
        return 713
      }
      return uv
    }
    await env.WOW_NAV_DATA.put('uniqueVisitors', '713')
    return 713
  } catch (error) {
    console.error('获取UV失败:', error)
    return 713
  }
}

// 确保UV已初始化为基础�?
async function ensureUVInitialized(env) {
  try {
    const data = await env.WOW_NAV_DATA.get('uniqueVisitors')
    if (!data || parseInt(data) < 713) {
      await env.WOW_NAV_DATA.put('uniqueVisitors', '713')
    }
  } catch (error) {
    console.error('初始化UV失败:', error)
  }
}

// 增加UV（独立访客数�? 2小时时间窗口去重
async function incrementUniqueVisitors(env, visitorId) {
  try {
    const visitorKey = `visitor:${visitorId}`
    const existing = await env.WOW_NAV_DATA.get(visitorKey)
    
    if (existing) {
      const lastVisitTime = parseInt(existing)
      const currentTime = Date.now()
      const twoHoursInMs = 2 * 60 * 60 * 1000
      
      if (currentTime - lastVisitTime < twoHoursInMs) {
        return false
      }
    }
    
    await env.WOW_NAV_DATA.put(visitorKey, Date.now().toString())
    
    let currentUV = await getUniqueVisitors(env)
    
    if (currentUV < 713) {
      currentUV = 713
    }
    
    const newUV = currentUV + 1
    await env.WOW_NAV_DATA.put('uniqueVisitors', newUV.toString())
    
    return true
  } catch (error) {
    console.error('增加UV失败:', error)
    return false
  }
}

// 获取UV和PV统计数据
async function getStats(env) {
  try {
    const uv = await getUniqueVisitors(env)
    const pv = await getPageViews(env)
    return { uv, pv }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return { uv: 713, pv: 1426 }
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
    // 确保UV和PV已初始化
    await ensureUVInitialized(env)
    await ensurePVInitialized(env)
    
    // GET - 获取总访问量
    if (method === 'GET') {
      const stats = await getStats(env)
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          total: stats.uv,
          pageViews: stats.pv,
          sites: (await getSites(env)).length
        }
      }), {
        headers: corsHeaders
      })
    }
    
    // POST - 增加访问�?
    if (method === 'POST') {
      // 确保UV和PV已初始化
      await ensureUVInitialized(env)
      await ensurePVInitialized(env)
      
      const { id } = await request.json()
      
      if (!id) {
        return new Response(JSON.stringify({
          success: false,
          error: '缺少网站ID'
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      // 获取访客ID（使用IP地址�?
      const visitorId = request.headers.get('CF-Connecting-IP') || 
                       request.headers.get('X-Forwarded-For') || 
                       'unknown'
      
      // 增加UV统计
      await incrementUniqueVisitors(env, visitorId)
      
      // 如果是页面浏览量
      if (id === 'pageview') {
        const newPageViews = await incrementPageViews(env)
        return new Response(JSON.stringify({
          success: true,
          data: {
            pageViews: newPageViews
          }
        }), {
          headers: corsHeaders
        })
      }
      
      const sites = await getSites(env)
      const site = sites.find(s => s.id == id)
      
      if (!site) {
        return new Response(JSON.stringify({
          success: false,
          error: '网站不存�?
        }), {
          status: 404,
          headers: corsHeaders
        })
      }
      
      // 增加访问�?
      site.visits = (site.visits || 0) + 1
      
      await saveSites(env, sites)
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          id: site.id,
          visits: site.visits
        }
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

