import React from 'react';

const HeightPredictor = ({ currentHeight, fatherHeight, motherHeight, gender }) => {
  // 核心遗传算法 (FPH)
  const midParentHeight = gender === 'boy' 
    ? (fatherHeight + motherHeight + 13) / 2 
    : (fatherHeight + motherHeight - 13) / 2;

  return (
    <div className="mt-6 p-6 bg-white rounded-[2.5rem] border-2 border-indigo-50 shadow-sm relative overflow-hidden">
      {/* 背景装饰：淡淡的渐变圆圈，增加设计感 */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
          <h3 className="text-lg font-black text-zinc-800">成年身高 AI 预测</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* 核心结果展示 */}
          <div className="bg-indigo-50/50 p-5 rounded-3xl text-center border border-indigo-100/50">
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">预计成年最终身高</p>
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-black text-indigo-600">
                {midParentHeight.toFixed(1)}
              </span>
              <span className="text-lg font-bold text-indigo-400 ml-1">cm</span>
            </div>
          </div>

          {/* 辅助信息：遗传潜力区间 */}
          <div className="flex justify-between items-center px-4 py-3 bg-zinc-50 rounded-2xl text-sm">
            <span className="text-zinc-500 font-medium">遗传潜力区间</span>
            <span className="text-zinc-800 font-black font-mono">
              {(midParentHeight - 6.5).toFixed(1)} - {(midParentHeight + 6.5).toFixed(1)} cm
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
          <span className="text-lg">💡</span>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <b>贴心提醒：</b>遗传因素占身高的 70%，后天的营养、运动和睡眠可帮助宝宝在遗传区间内争取更好的表现。
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeightPredictor;
