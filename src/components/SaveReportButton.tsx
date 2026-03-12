import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';

export const SaveReportButton = ({ targetId }: { targetId: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    setIsGenerating(true);

    try {
      // 1. 强制清理 Recharts 留下的测量残余，这些是截图崩溃的罪魁祸首
      const spans = document.querySelectorAll('span[id^="recharts_measurement_span"]');
      spans.forEach(span => span.remove());

      // 2. 使用更轻量、不干涉内部逻辑的截图配置
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        // 关键：彻底禁用所有的克隆优化，只做纯静态截取
        foreignObjectRendering: false, 
        async: true,
        logging: false,
        onclone: (clonedDoc) => {
          // 彻底移除克隆文档中的隐藏测量元素
          const hiddenStuff = clonedDoc.querySelectorAll('[aria-hidden="true"], .recharts-legend-wrapper');
          hiddenStuff.forEach(el => (el as HTMLElement).style.display = 'none');
          
          // 给所有 SVG 强制加上宽高，防止在 Canvas 中缩成 0
          const svgs = clonedDoc.querySelectorAll('svg');
          svgs.forEach(svg => {
            svg.setAttribute('width', svg.getBoundingClientRect().width.toString());
            svg.setAttribute('height', svg.getBoundingClientRect().height.toString());
          });
        }
      });

      // 3. 稳健的下载触发
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `baby-report-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("捕获到崩溃:", err);
      alert("由于浏览器兼容性限制，请尝试长按页面手动截图保存。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleSave} 
      disabled={isGenerating}
      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all disabled:opacity-50"
    >
      {isGenerating ? <Loader2 className="animate-spin mx-auto" /> : '保存评估报告'}
    </button>
  );
};
