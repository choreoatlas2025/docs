// ChoreoAtlas 单服务器版 Cloudflare Worker
// 暂时全部流量路由到 Oracle Cloud 服务器
// 后续 GitHub Pages 修复后可切换到双地域版本

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 获取用户地理位置信息
  const country = request.cf.country || 'Unknown'
  const clientIP = request.headers.get('CF-Connecting-IP')
  
  // 目标服务器 (暂时全部路由到 Oracle Cloud)
  const ORACLE_CLOUD = 'http://144.21.49.157:80'
  
  // 构建目标URL
  const targetUrl = ORACLE_CLOUD + url.pathname + url.search
  
  try {
    // 发起请求到目标服务器
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        // 转发必要的请求头
        'User-Agent': request.headers.get('User-Agent') || 'ChoreoAtlas-Worker',
        'Accept': request.headers.get('Accept') || '*/*',
        'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
        'Accept-Encoding': request.headers.get('Accept-Encoding') || 'gzip, deflate',
        'Cache-Control': request.headers.get('Cache-Control') || 'no-cache',
        // 添加原始请求信息
        'X-Original-Host': url.hostname,
        'X-Forwarded-For': clientIP,
        'X-Country': country,
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
    })
    
    // 创建新的响应，添加自定义头信息
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })
    
    // 添加 ChoreoAtlas 响应头
    newResponse.headers.set('X-ChoreoAtlas-Route', `Single-Server → Oracle Cloud (${country})`)
    newResponse.headers.set('X-ChoreoAtlas-Country', country)
    newResponse.headers.set('X-ChoreoAtlas-Server', '144.21.49.157')
    newResponse.headers.set('X-ChoreoAtlas-Version', 'Single-Server-v1.0')
    
    // 缓存控制
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000') // 1年缓存
    }
    
    return newResponse
    
  } catch (error) {
    console.error(`Request failed: ${error.message}`)
    
    // 错误回退页面
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>ChoreoAtlas - Service Temporarily Unavailable</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px; margin: 100px auto; padding: 20px; 
            background: #f8f9fa; text-align: center;
          }
          .container { 
            background: white; padding: 40px; border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #dc3545; margin-bottom: 20px; }
          .details { 
            background: #f8f9fa; padding: 15px; border-radius: 4px; 
            margin: 20px 0; font-family: monospace; font-size: 12px; color: #666;
          }
          .retry { 
            margin-top: 30px; padding: 12px 24px; 
            background: #007bff; color: white; border: none; 
            border-radius: 4px; cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚧 服务暂时不可用</h1>
          <h2>Service Temporarily Unavailable</h2>
          
          <p>我们正在努力恢复服务，请稍后重试。<br>
             We are working to restore service, please try again later.</p>
          
          <div class="details">
            Error: ${error.message}<br>
            Country: ${country}<br>
            Time: ${new Date().toISOString()}<br>
            Request: ${request.method} ${url.pathname}
          </div>
          
          <button class="retry" onclick="window.location.reload()">
            🔄 重试 / Retry
          </button>
        </div>
      </body>
      </html>
    `, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-ChoreoAtlas-Route': 'Error-Page',
        'X-ChoreoAtlas-Country': country,
        'X-ChoreoAtlas-Error': error.message
      }
    })
  }
}