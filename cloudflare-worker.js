// ChoreoAtlas 双地域智能路由 Cloudflare Worker
// 中国用户 -> Oracle Cloud 服务器
// 海外用户 -> GitHub Pages

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 获取用户IP地理位置信息
  const country = request.cf.country
  const clientIP = request.headers.get('CF-Connecting-IP')
  
  // 定义目标服务器
  const ORACLE_CLOUD = 'http://140.238.86.4:8080'
  const GITHUB_PAGES = 'https://choreoatlas2025.github.io'
  
  // 中国地区路由到 Oracle Cloud 服务器
  const CHINA_REGIONS = ['CN', 'HK', 'MO', 'TW']
  
  let targetUrl
  let routeInfo
  
  if (CHINA_REGIONS.includes(country)) {
    // 中国用户走 Oracle Cloud
    targetUrl = ORACLE_CLOUD + url.pathname + url.search
    routeInfo = `CN-Route -> Oracle Cloud (${country})`
  } else {
    // 海外用户走 GitHub Pages
    targetUrl = GITHUB_PAGES + url.pathname + url.search
    routeInfo = `Global-Route -> GitHub Pages (${country})`
  }
  
  try {
    // 发起请求到目标服务器
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    
    // 创建新的响应，添加路由信息头
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })
    
    // 添加自定义响应头
    newResponse.headers.set('X-ChoreoAtlas-Route', routeInfo)
    newResponse.headers.set('X-ChoreoAtlas-Country', country)
    newResponse.headers.set('X-ChoreoAtlas-Target', targetUrl)
    
    return newResponse
    
  } catch (error) {
    // 故障转移：如果主路由失败，尝试备用路由
    console.error(`Primary route failed: ${error.message}`)
    
    const fallbackUrl = CHINA_REGIONS.includes(country) ? 
      GITHUB_PAGES + url.pathname + url.search : 
      ORACLE_CLOUD + url.pathname + url.search
    
    try {
      const fallbackResponse = await fetch(fallbackUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      })
      
      const newResponse = new Response(fallbackResponse.body, {
        status: fallbackResponse.status,
        statusText: fallbackResponse.statusText,
        headers: fallbackResponse.headers
      })
      
      newResponse.headers.set('X-ChoreoAtlas-Route', `Fallback-Route (${country})`)
      newResponse.headers.set('X-ChoreoAtlas-Error', error.message)
      
      return newResponse
      
    } catch (fallbackError) {
      // 如果两个路由都失败，返回错误页面
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>ChoreoAtlas - Service Unavailable</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1>服务暂时不可用 / Service Temporarily Unavailable</h1>
          <p>我们正在努力恢复服务，请稍后重试。</p>
          <p>We are working to restore service, please try again later.</p>
          <hr>
          <small>
            Country: ${country} | 
            Primary Error: ${error.message} | 
            Fallback Error: ${fallbackError.message}
          </small>
        </body>
        </html>
      `, {
        status: 503,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-ChoreoAtlas-Route': 'Error-Page',
          'X-ChoreoAtlas-Country': country
        }
      })
    }
  }
}