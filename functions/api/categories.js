// 默认分类数据
const DEFAULT_CATEGORIES = [
  { id: 'all', name: '全部', slug: 'all', sort_order: 0 },
  { id: 'design', name: '设计', slug: 'design', sort_order: 1 },
  { id: 'dev', name: '开�?, slug: 'dev', sort_order: 2 },
  { id: 'tools', name: '工具', slug: 'tools', sort_order: 3 },
  { id: 'ai', name: 'AI', slug: 'ai', sort_order: 4 },
  { id: 'news', name: '新闻', slug: 'news', sort_order: 5 },
  { id: 'shop', name: '购物', slug: 'shop', sort_order: 6 },
  { id: 'edu', name: '学习', slug: 'edu', sort_order: 7 }
]

// CORS 响应�?
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=300, s-maxage=600'
}

// 处理 OPTIONS 请求
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders
  })
}

// 获取所有分�?
async function getCategories(env) {
  try {
    const data = await env.WOW_NAV_DATA.get('categories')
    if (data) {
      return JSON.parse(data)
    }
    // 如果没有数据，初始化默认数据
    await env.WOW_NAV_DATA.put('categories', JSON.stringify(DEFAULT_CATEGORIES))
    return DEFAULT_CATEGORIES
  } catch (error) {
    console.error('获取分类数据失败:', error)
    return DEFAULT_CATEGORIES
  }
}

// 保存所有分�?
async function saveCategories(env, categories) {
  await env.WOW_NAV_DATA.put('categories', JSON.stringify(categories))
}

// 验证身份验证token
async function verifyAuth(env, request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false
    }
    
    const token = authHeader.substring(7)
    const authData = await env.WOW_NAV_DATA.get('auth_token')
    
    if (!authData) {
      return false
    }
    
    const storedToken = JSON.parse(authData)
    const now = Date.now()
    
    if (storedToken.expiresAt < now) {
      await env.WOW_NAV_DATA.delete('auth_token')
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
    // GET - 获取所有分�?
    if (method === 'GET') {
      const categories = await getCategories(env)
      // 按排序顺序返�?
      const sortedCategories = categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      
      return new Response(JSON.stringify({
        success: true,
        data: sortedCategories
      }), {
        headers: corsHeaders
      })
    }

    // POST - 添加新分�?
    if (method === 'POST') {
      const isAuthenticated = await verifyAuth(env, request)
      if (!isAuthenticated) {
        return new Response(JSON.stringify({
          success: false,
          error: '未授权访�?
        }), {
          status: 401,
          headers: corsHeaders
        })
      }
      
      const newCategory = await request.json()
      const categories = await getCategories(env)
      
      // 检查slug是否已存�?
      if (categories.some(c => c.slug === newCategory.slug)) {
        return new Response(JSON.stringify({
          success: false,
          error: '分类标识已存�?
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      // 标记为新增分类，用于后端判断不执行网站关�?
      const isNewCategory = newCategory._isNew
      delete newCategory._isNew
      
      // 使用slug作为id
      newCategory.id = newCategory.slug
      newCategory.sort_order = newCategory.sort_order || categories.length
      
      categories.push(newCategory)
      await saveCategories(env, categories)
      
      return new Response(JSON.stringify({
        success: true,
        data: newCategory
      }), {
        headers: corsHeaders
      })
    }

    // PUT - 更新分类
    if (method === 'PUT') {
      const isAuthenticated = await verifyAuth(env, request)
      if (!isAuthenticated) {
        return new Response(JSON.stringify({
          success: false,
          error: '未授权访�?
        }), {
          status: 401,
          headers: corsHeaders
        })
      }
      
      const updateData = await request.json()
      const categories = await getCategories(env)
      
      const index = categories.findIndex(c => c.id === updateData.id)
      if (index === -1) {
        return new Response(JSON.stringify({
          success: false,
          error: '分类不存�?
        }), {
          status: 404,
          headers: corsHeaders
        })
      }
      
      categories[index] = {
        ...categories[index],
        ...updateData
      }
      
      await saveCategories(env, categories)
      
      return new Response(JSON.stringify({
        success: true,
        data: categories[index]
      }), {
        headers: corsHeaders
      })
    }

    // DELETE - 删除分类
    if (method === 'DELETE') {
      const isAuthenticated = await verifyAuth(env, request)
      if (!isAuthenticated) {
        return new Response(JSON.stringify({
          success: false,
          error: '未授权访�?
        }), {
          status: 401,
          headers: corsHeaders
        })
      }
      
      const { id } = await request.json()
      
      // 不能删除 'all' 分类
      if (id === 'all') {
        return new Response(JSON.stringify({
          success: false,
          error: '不能删除"全部"分类'
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      const categories = await getCategories(env)
      const filteredCategories = categories.filter(c => c.id !== id)
      
      if (filteredCategories.length === categories.length) {
        return new Response(JSON.stringify({
          success: false,
          error: '分类不存�?
        }), {
          status: 404,
          headers: corsHeaders
        })
      }
      
      await saveCategories(env, filteredCategories)
      
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

