// CORS 响应�?const corsHeaders = {
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

// 获取Logo存储
async function getLogoStorage(env) {
  try {
    const data = await env.WOW_NAV_DATA.get('logo_storage')
    if (data) {
      return JSON.parse(data)
    }
    return {}
  } catch (error) {
    console.error('获取Logo存储失败:', error)
    return {}
  }
}

// 保存Logo存储
async function saveLogoStorage(env, storage) {
  await env.WOW_NAV_DATA.put('logo_storage', JSON.stringify(storage))
}

// 下载Logo图片并转换为Base64
async function downloadLogo(logoUrl) {
  try {
    const response = await fetch(logoUrl)
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    
    // 检测图片类�?    const contentType = response.headers.get('content-type') || 'image/png'
    
    return {
      data: `data:${contentType};base64,${base64}`,
      contentType,
      size: arrayBuffer.byteLength
    }
  } catch (error) {
    console.error('下载Logo失败:', error)
    return null
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
    const url = new URL(request.url)
    const path = url.pathname

    // GET /api/logo/:domain - 获取Logo
    if (method === 'GET' && path.startsWith('/api/logo/')) {
      const domain = path.replace('/api/logo/', '')
      
      if (!domain) {
        return new Response(JSON.stringify({
          success: false,
          error: '缺少域名参数'
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      const storage = await getLogoStorage(env)
      const logo = storage[domain]
      
      if (!logo) {
        // 返回默认logo（Font Awesome地球图标�?        return new Response(JSON.stringify({
          success: true,
          data: {
            type: 'default',
            icon: 'fa-globe-americas'
          }
        }), {
          headers: corsHeaders
        })
      }
      
      return new Response(JSON.stringify({
        success: true,
        data: logo
      }), {
        headers: corsHeaders
      })
    }

    // POST /api/logo/download - 下载并存储Logo
    if (method === 'POST' && path === '/api/logo/download') {
      const { domain, logoUrl } = await request.json()
      
      if (!domain || !logoUrl) {
        return new Response(JSON.stringify({
          success: false,
          error: '缺少必要参数'
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      // 下载Logo
      const logoData = await downloadLogo(logoUrl)
      
      if (!logoData) {
        // 下载失败，返回默认logo
        const storage = await getLogoStorage(env)
        storage[domain] = {
          type: 'default',
          icon: 'fa-globe-americas',
          downloaded_at: new Date().toISOString()
        }
        await saveLogoStorage(env, storage)
        
        return new Response(JSON.stringify({
          success: true,
          data: storage[domain]
        }), {
          headers: corsHeaders
        })
      }
      
      // 保存到KV
      const storage = await getLogoStorage(env)
      storage[domain] = {
        type: 'custom',
        data: logoData.data,
        contentType: logoData.contentType,
        size: logoData.size,
        downloaded_at: new Date().toISOString()
      }
      await saveLogoStorage(env, storage)
      
      return new Response(JSON.stringify({
        success: true,
        data: storage[domain]
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

