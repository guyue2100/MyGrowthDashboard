import React, { useState, useEffect, useMemo } from 'react';
// ... 保持原有导入不变

export default function App() {
  const { t, i18n } = useTranslation();

  // 1. 修改状态初始化逻辑：增加 URL 优先级
  const [assessmentData, setAssessmentData] = useState<any>(() => {
    // 首先检查 URL 参数是否存在分享数据
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('sd');

    if (sharedData) {
      try {
        // 解码 Base64 数据 (使用 decodeURIComponent 兼容特殊字符)
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        return decoded;
      } catch (e) {
        console.error("Failed to parse shared data from URL", e);
      }
    }

    // 如果没有分享数据，再读取本地存储
    const saved = localStorage.getItem('growth_assessment');
    return saved ? JSON.parse(saved) : {
      gender: 'boy',
      birthday: new Date().toISOString().split('T')[0],
      fatherHeight: '',
      motherHeight: '',
      measurements: [{ date: new Date().toISOString().split('T')[0], height: '', weight: '' }]
    };
  });

  // 2. 新增：监听 URL 变化 (处理用户在页面内点击新的分享链接的情况)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const sharedData = params.get('sd');
      if (sharedData) {
        try {
          const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
          setAssessmentData(decoded);
        } catch (e) {
          console.error("URL Data update failed", e);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // ... 保持你原有的 Dynamic SEO Update useEffect 不变

  const handleAssessmentSubmit = (data: any) => {
    setAssessmentData(data);
    localStorage.setItem('growth_assessment', JSON.stringify(data));
    
    // 提交后清除 URL 中的分享参数，切换回本地编辑模式
    if (window.location.search.includes('sd=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // ... 保持 records, latestRecord, prediction 的 useMemo 不变

  return (
    <div className="min-h-screen pb-10 md:pb-20 pt-6 md:pt-12">
      {/* ... 保持原有 JSX 结构不变 ... */}
      
      {/* 确保传给 SharePoster 的数据是完整的 */}
      {prediction && (
        <SharePoster 
          gender={assessmentData.gender} 
          predictedHeight={prediction.final}
          assessmentData={assessmentData} // 新增：把完整数据传给海报生成链接
        />
      )}

      {/* ... 保持其余 JSX 不变 ... */}
    </div>
  );
}
