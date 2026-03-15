// src/lib/TypeScript.ts
export const GA_TRACKING_ID = 'G-0MTELQGND1';

export const trackEvent = (action: string, { category, label, value }: {
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    // 增加一条日志，方便你在浏览器 F12 控制台看到埋点是否触发
    console.log(`✅ GA埋点已发送: ${action}`, { category, label, value });
  } else {
    console.warn("❌ 未找到 gtag，请检查 index.html 是否正确安装了 GA4 脚本");
  }
};
