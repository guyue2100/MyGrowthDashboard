import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';

export const SaveReportButton = ({ targetId }: { targetId: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    // 1. 获取目标元素
    const element = document.getElementById(targetId);
    
    if (!element) {
      alert("未找到评估区域，请刷新页面重试");
      return;
    }

    setIsGenerating(true);

    try {
      // 2. 预留时间等待图表动画完全静止（关键）
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. 配置 html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,               // 保持高清，适合分享
        useCORS: true,          // 允许跨域图片
        allowTaint: false,
        backgroundColor: '#ffffff', // 确保背景为白色而非透明
        logging: false,         // 生产环境关闭日志
        // 4. 关键修正：手动处理 SVG 元素
        // html2canvas 克隆节点时，SVG 若无显式宽高会渲染失败
        onclone: (clonedDoc) => {
          const svgs = clonedDoc.querySelectorAll('svg');
          svgs.forEach(svg => {
            const bbox = svg.getBoundingClientRect();
            if (bbox.width > 0 && bbox.height > 0) {
              svg.setAttribute('width', bbox.width.toString());
              svg.setAttribute('height', bbox.height.toString());
            }
          });
          
          // 移除克隆文档中可能存在的干扰元素（如悬浮按钮本身）
          const buttons = clonedDoc.querySelectorAll('button');
          buttons.forEach(btn => btn.style.display = 'none');
        }
      });

      // 5. 使用 Blob 方式导出，兼容性比 dataURL 更好
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas to Blob failed');
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // 使用 ISO 日期命名，避免非法字符导致的下载中断
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `宝宝生长评估报告-${dateStr}.png`;
        
        document.body.appendChild(link);
        link.click();
        
        // 清理内存
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');

    } catch (err) {
      console.error('报告生成失败详情:', err);
      alert("保存失败，请尝试手动截屏或稍后重试。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
