export async function onRequest(context) {
  const { env } = context
  
  try {
    const settings = await env.WEBSTACK_DATA.get('settings', { type: 'json' }) || {}
    const baseUrl = settings.siteUrl || 'https://960119.xyz'
    const currentDate = new Date().toISOString()
    
    let robots = `# Robots.txt for ${settings.siteTitle || 'WebStack导航'}
# Generated on ${currentDate}

User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin pages
Disallow: /admin
Disallow: /login

# Crawl-delay (optional)
Crawl-delay: 1
`
    
    return new Response(robots, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('生成robots.txt失败:', error)
    return new Response('Error generating robots.txt', { status: 500 })
  }
}
