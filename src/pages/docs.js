import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

/**
 * 文档重定向页面
 * 解决 /docs 路由404问题，支持多语言自动重定向
 * 
 * 使用页面级重定向而非嵌套路由，避免与docs插件冲突
 */
export default function DocsRedirectPage() {
  const history = useHistory();
  const location = useLocation();
  
  useEffect(() => {
    const pathname = location.pathname;
    
    // 根据当前路径确定重定向目标
    let redirectTarget = '/docs/intro'; // 默认英文
    
    if (pathname.startsWith('/zh-CN')) {
      redirectTarget = '/zh-CN/docs/intro';
    } else if (pathname.startsWith('/ja')) {
      redirectTarget = '/ja/docs/intro';  
    } else if (pathname.startsWith('/de')) {
      redirectTarget = '/de/docs/intro';
    }
    
    // 使用 replace 而不是 push，避免浏览器历史记录污染
    history.replace(redirectTarget);
  }, [history, location.pathname]);

  // 在重定向过程中显示加载提示
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div>
        <p>Redirecting to documentation...</p>
        <p>正在跳转到文档...</p>
      </div>
    </div>
  );
}