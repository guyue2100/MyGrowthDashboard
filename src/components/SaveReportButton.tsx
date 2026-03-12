import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';

export const SaveReportButton = ({ targetId }: { targetId: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      alert("未找到报告区域，请刷新重试");
      return;
    }

    setIsGenerating(true);

    try {
      // 1. 给图表一点时间停止一切内部计算
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
        // 关键：忽略 Recharts 用来辅助测量文字宽度的临时 Span，防止其干扰截图逻辑
        ignoreElements: (el) => {
          return el.id === 'recharts_measurement_span' || el.hasAttribute('aria-hidden');
        },
        // 2. 深度克隆处理：强制锁定 SVG 尺寸
        onclone: (clonedDoc) => {
          // 处理所有的 SVG，防止在克隆文档中塌陷
          const svgs = clonedDoc.querySelectorAll('svg');
          svgs.forEach(svg => {
            const bbox = svg.getBoundingClientRect();
            if (bbox.width > 0) {
              svg.setAttribute('width', bbox.width.toString());
              svg.setAttribute('height', bbox.height.toString());
            }
          });
          
          // 隐藏克隆版中的按钮
          const btn = clonedDoc.querySelector('button');
          if (btn) btn.style.display = 'none';
        }
      });

      // 3. 采用最稳定的下载方案
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `宝宝成长报告-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("保存失败具体日志:", err);
      alert("生成失败，请确认是否已在 App.tsx 中正确设置 id='report-area'");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleSave} 
      disabled={isGenerating}
      className="w-full max-w-md flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
    >
      {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
      {isGenerating ? '正在生成精美分享图...' : '保存精美评估报告'}
    </button>
  );
};
