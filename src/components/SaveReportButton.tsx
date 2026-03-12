import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';

export const SaveReportButton = ({ targetId }: { targetId: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    // 1. 同时尝试 ID 和 QuerySelector，确保能抓取到元素
    const element = document.getElementById(targetId) || document.querySelector(`#${targetId}`);
    
    if (!element) {
      alert("未发现可截图区域，请检查 ID 是否正确");
      return;
    }

    setIsGenerating(true);

    try {
      // 2. 核心优化：给浏览器 800ms 处理图表动画，防止截取到空白或动画中途的图表
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,               // 2倍高清
        useCORS: true,          // 允许加载跨域资源
        allowTaint: true,       // 允许污染画布
        backgroundColor: '#ffffff', // 强制白色背景，防止透明
        logging: false,         // 关闭日志提高性能
        // 3. 关键修正：手动处理 SVG，防止 Recharts 导致渲染崩溃
        onclone: (clonedDoc) => {
          const svgElements = clonedDoc.getElementsByTagName('svg');
          Array.from(svgElements).forEach(svg => {
            const bbox = svg.getBoundingClientRect();
            svg.setAttribute('width', bbox.width.toString());
            svg.setAttribute('height', bbox.height.toString());
          });
        }
      });

      // 4. 下载逻辑增强
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      // 使用 ISO 日期避免非法字符导致的保存失败
      link.download = `babygrow-report-${new Date().toISOString().split('T')[0]}.png`;
      
      // 兼容移动端浏览器的下载触发
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('保存失败详情:', err);
      alert("生成报告失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleSave} 
      disabled={isGenerating}
      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
    >
      {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
      {isGenerating ? '正在生成精美报告...' : '下载生长评估报告'}
    </button>
  );
};
