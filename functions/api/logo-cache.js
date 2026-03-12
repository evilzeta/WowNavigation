// CORS 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
}

// 处理 OPTIONS 请求
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders
  })
}

// 获取Logo缓存
async function getLogoCache(env) {
  try {
    const data = await env.WEBSTACK_DATA.get('logo_cache')
    if (data) {
      return JSON.parse(data)
    }
    return {}
  } catch (error) {
    console.error('获取Logo缓存失败:', error)
    return {}
  }
}

// 保存Logo缓存
async function saveLogoCache(env, cache) {
  await env.WEBSTACK_DATA.put('logo_cache', JSON.stringify(cache))
}

export async function onRequest(context) {
  const { request, env } = context
  const method = request.method

  // 处理 CORS 预检请求
  if (method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    // GET - 获取Logo缓存
    if (method === 'GET') {
      const url = new URL(request.url)
      const domain = url.searchParams.get('domain')
      
      if (!domain) {
        return new Response(JSON.stringify({
          success: true,
          data: await getLogoCache(env)
        }), {
          headers: corsHeaders
        })
      }
      
      const cache = await getLogoCache(env)
      const cachedLogo = cache[domain]
      
      return new Response(JSON.stringify({
        success: true,
        data: cachedLogo || null
      }), {
        headers: corsHeaders
      })
    }

    // POST - 保存Logo缓存
    if (method === 'POST') {
      const { domain, logoUrl, source } = await request.json()
      
      if (!domain || !logoUrl) {
        return new Response(JSON.stringify({
          success: false,
          error: '缺少必要参数'
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      const cache = await getLogoCache(env)
      cache[domain] = {
        url: logoUrl,
        source: source || 'custom',
        cached_at: new Date().toISOString()
      }
      
      await saveLogoCache(env, cache)
      
      return new Response(JSON.stringify({
        success: true,
        data: cache[domain]
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
