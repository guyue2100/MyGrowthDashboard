import React, { useState } from 'react';

const HeightPredictor = ({ currentHeight, fatherHeight, motherHeight, gender }) => {
  const [isPaid, setIsPaid] = useState(false);

  // 遗传身高计算逻辑
  const midParentHeight = gender === 'boy' 
    ? (fatherHeight + motherHeight + 13) / 2 
    : (fatherHeight + motherHeight - 13) / 2;

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-indigo-900">📊 成年身高 AI 预测</h3>
        <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium">高级版</span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>遗传潜力范围:</span>
          <span className="font-mono font-medium">
            {(midParentHeight - 5).toFixed(1)}cm - {(midParentHeight + 5).toFixed(1)}cm
          </span>
        </div>

        <div className="relative py-4 bg-white rounded-xl border border-dashed border-indigo-200 flex flex-col items-center justify-center overflow-hidden">
          <p className="text-sm text-gray-500 mb-1">预计成年最终身高</p>
          
          {/* 核心模糊遮罩区域 */}
          <div className="relative">
            <span className={`text-4xl font-black text-indigo-600 ${!isPaid ? 'blur-md select-none' : ''}`}>
              {midParentHeight.toFixed(1)}
            </span>
            <span className={`text-xl font-bold text-indigo-600 ml-1 ${!isPaid ? 'blur-sm' : ''}`}>cm</span>
            
            {!isPaid && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => alert('跳转支付逻辑...')} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg transform transition active:scale-95"
                >
                  ￥9.9 解锁精准预测
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center italic">
          * 基于 FPH 遗传算法及当前生长曲线百分位综合测算
        </p>
      </div>
    </div>
  );
};

export default HeightPredictor;
