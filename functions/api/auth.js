// 默认管理员账户
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'sorrysir'
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

// 生成随机token
function generateToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// 获取管理员账户
async function getAdminAccount(env) {
  try {
    const data = await env.WEBSTACK_DATA.get('admin_account')
    if (data) {
      return JSON.parse(data)
    }
    // 如果没有数据，初始化默认数据
    await env.WEBSTACK_DATA.put('admin_account', JSON.stringify(DEFAULT_ADMIN))
    return DEFAULT_ADMIN
  } catch (error) {
    console.error('获取管理员账户失败:', error)
    return DEFAULT_ADMIN
  }
}

// 保存管理员账户
async function saveAdminAccount(env, account) {
  await env.WEBSTACK_DATA.put('admin_account', JSON.stringify(account))
}

export async function onRequest(context) {
  const { request, env } = context
  const method = request.method

  // 处理 CORS 预检请求
  if (method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    // GET - 获取当前管理员账户信息（不返回密码）
    if (method === 'GET') {
      const account = await getAdminAccount(env)
      const { password, ...accountInfo } = account
      
      return new Response(JSON.stringify({
        success: true,
        data: accountInfo
      }), {
        headers: corsHeaders
      })
    }

    // POST - 验证登录
    if (method === 'POST') {
      const loginData = await request.json()
      const account = await getAdminAccount(env)
      
      // 验证用户名和密码
      if (loginData.username === account.username && loginData.password === account.password) {
        const token = generateToken()
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24小时后过期
        
        await env.WEBSTACK_DATA.put('auth_token', JSON.stringify({
          token,
          expiresAt,
          username: account.username
        }))
        
        return new Response(JSON.stringify({
          success: true,
          data: {
            username: account.username,
            role: 'admin',
            token,
            expiresAt
          }
        }), {
          headers: corsHeaders
        })
      }
      
      return new Response(JSON.stringify({
        success: false,
        error: '用户名或密码错误'
      }), {
        status: 401,
        headers: corsHeaders
      })
    }

    // PUT - 更新管理员账户
    if (method === 'PUT') {
      const updateData = await request.json()
      const account = await getAdminAccount(env)
      
      // 验证旧密码
      if (updateData.oldPassword && updateData.oldPassword !== account.password) {
        return new Response(JSON.stringify({
          success: false,
          error: '旧密码错误'
        }), {
          status: 400,
          headers: corsHeaders
        })
      }
      
      // 更新账户信息
      const newAccount = {
        ...account,
        username: updateData.username || account.username,
        password: updateData.newPassword || account.password
      }
      
      await saveAdminAccount(env, newAccount)
      
      const { password, ...accountInfo } = newAccount
      
      return new Response(JSON.stringify({
        success: true,
        data: accountInfo
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
