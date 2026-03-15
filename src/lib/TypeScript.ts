// src/lib/TypeScript.ts

// 声明全局 window 对象中的 gtag
declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      params?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
  }
}

// 导出统一的埋点函数
export const trackEvent = (action: string, params?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      ...params,
      // 这里的 category 默认设为 Engagement
      event_category: params?.category || 'Engagement',
      event_label: params?.label || '',
    });
  }
};
