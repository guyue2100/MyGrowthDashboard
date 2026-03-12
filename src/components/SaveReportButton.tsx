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
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `baby-growth-${new Date().toLocaleDateString()}.png`;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleSave} 
      disabled={isGenerating}
      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50"
    >
      {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
      {isGenerating ? '正在生成图片...' : '保存精美分享图'}
    </button>
  );
};