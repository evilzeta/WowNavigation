export async function onRequest(context) {
  const { env } = context
  
  try {
    const sites = await env.WEBSTACK_DATA.get('sites', { type: 'json' }) || []
    const categories = await env.WEBSTACK_DATA.get('categories', { type: 'json' }) || []
    const settings = await env.WEBSTACK_DATA.get('settings', { type: 'json' }) || {}
    
    const baseUrl = settings.siteUrl || 'https://960119.xyz'
    const currentDate = new Date().toISOString()
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
    
    xml += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`
    
    categories.forEach(category => {
      if (category.id === 'all') return
      xml += `  <url>
    <loc>${baseUrl}/category/${category.slug}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
    })
    
    sites.forEach(site => {
      if (!site.is_visible) return
      xml += `  <url>
    <loc>${baseUrl}/detail?id=${site.id}</loc>
    <lastmod>${site.updated_at || site.created_at || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
    })
    
    xml += `</urlset>`
    
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('生成sitemap失败:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
