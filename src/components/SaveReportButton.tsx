import React from 'react';
import { Share2 } from 'lucide-react';

interface SaveReportButtonProps {
  // 传入当前所有的评估数据
  data: {
    gender: string;
    birthday: string;
    fatherHeight: string;
    motherHeight: string;
    latestHeight: number | string;
    latestWeight: number | string;
    predictedHeight?: string;
  };
}

export const SaveReportButton = ({ data }: SaveReportButtonProps) => {
  const handleGenerateSharePage = () => {
    try {
      // 1. 将最新的评估数据序列化存储
      // 这样在新打开的页面中可以直接读取，无需复杂的状态管理
      localStorage.setItem('share_report_data', JSON.stringify({
        ...data,
        timestamp: new Date().getTime()
      }));

      // 2. 跳转到分享预览页
      // 使用 window.open 在新标签页打开，方便用户返回修改数据
      window.open('/share', '_blank');
      
    } catch (error) {
      console.error('准备分享数据失败:', error);
      alert('生成失败，请检查浏览器是否禁用了弹出窗口');
    }
  };

  return (
    <div className="w-full px-4 flex flex-col items-center gap-3">
      <button 
        onClick={handleGenerateSharePage}
        className="group relative w-full max-w-md flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[2rem] font-bold shadow-xl hover:shadow-indigo-200 active:scale-95 transition-all duration-300"
      >
        <div className="absolute inset-0 rounded-[2rem] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Share2 className="w-6 h-6" />
        <span className="text-lg">生成精美评估海报</span>
      </button>
      
      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
        点击后长按图片即可保存至相册
      </p>
    </div>
  );
};
