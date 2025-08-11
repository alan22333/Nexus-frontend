'use client';

import { useEffect } from 'react';

const GlobalErrorHandler = () => {
  useEffect(() => {
    // 处理未捕获的Promise rejection
    const handleUnhandledRejection = (event) => {
      console.warn('Unhandled Promise Rejection:', event.reason);
      // 阻止默认的错误处理，避免在控制台显示红色错误
      event.preventDefault();
    };

    // 处理未捕获的JavaScript错误
    const handleError = (event) => {
      console.warn('Uncaught Error:', event.error || event.message);
      // 阻止默认的错误处理
      event.preventDefault();
    };

    // 添加事件监听器
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // 清理函数
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null; // 这个组件不渲染任何内容
};

export default GlobalErrorHandler;