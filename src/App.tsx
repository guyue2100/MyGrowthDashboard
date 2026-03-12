import { SaveReportButton } from './components/SaveReportButton';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays, parseISO } from 'date-fns';
import { 
  TrendingUp 
} from 'lucide-react';
import { GrowthChart } from './components/GrowthChart';
import { GrowthAssessmentForm } from './components/GrowthAssessmentForm';
import { HeightPredictor } from './components/HeightPredictor';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  const { t } = useTranslation();
  
  // 状态初始化逻辑保持不变
  const [assessmentData, setAssessmentData] = useState<any>(() => {
    const saved = localStorage.getItem('growth_assessment');
    return saved ? JSON.parse(saved) : {
      gender: 'boy',
      birthday: new Date().toISOString().split('T')[0],
      fatherHeight: '',
      motherHeight: '',
      measurements: [{ date: new Date().toISOString().split('T')[0], height: '', weight: '' }]
    };
  });

  const handleAssessmentSubmit = (data: any) => {
    setAssessmentData(data);
    localStorage.setItem('growth_assessment', JSON.stringify(data));
  };

  // 这里的逻辑处理宝宝的生长数据
  const records = useMemo(() => {
    if (!assessmentData || !assessmentData.measurements) return [];
    
    return assessmentData.measurements.map((m: any, index: number) => {
      const ageInMonths = Number((differenceInDays(parseISO(m.date), parseISO(assessmentData.birthday)) / 30.4375).toFixed(2));
      
      return {
        id: `record-${index}`,
        childId: 'child',
        date: m.date,
        ageInMonths,
        height: parseFloat(m.height),
        weight: parseFloat(m.weight),
        headCircumference: 0,
      };
    }).sort((a: any, b: any) => a.ageInMonths - b.ageInMonths);
  }, [assessmentData]);

  const latestRecord = records[records.length - 1];

  return (
    <div className="min-h-screen pb-10 md:pb-20 pt-6 md:pt-12 bg-slate-50">
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* 左侧：输入表单（不参与截图） */}
        <div className="lg:col-span-5">
          <div className="sticky top-8">
            <GrowthAssessmentForm 
              initialData={assessmentData} 
              onSubmit={handleAssessmentSubmit} 
            />
          </div>
        </div>

        {/* 右侧：结果展示区域 */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* 📍 核心截图区域：id="report-area" 仅包裹需要分享的数据部分 */}
          <div id="report-area" className="space-y-10 bg-white md:bg-transparent p-2 md:p-0 rounded-[2.5rem]">
            
            {/* 最新数据卡片 */}
            {latestRecord && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-8 border-blue-200">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">{t('latestHeight')}</p>
                  <p className="text-3xl font-black text-blue-600">{latestRecord.height}<span className="text-sm ml-1 font-bold text-zinc-300">{t('unitHeight')}</span></p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-8 border-pink-200">
                  <p className="text-[10px] font-black text-pink-300 uppercase tracking-widest mb-2">{t('latestWeight')}</p>
                  <p className="text-3xl font-black text-pink-500">{latestRecord.weight}<span className="text-sm ml-1 font-bold text-zinc-300">{t('unitWeight')}</span></p>
                </div>
              </div>
            )}

            {/* AI 预测结果卡片 */}
            <HeightPredictor 
              gender={assessmentData.gender}
              fatherHeight={assessmentData.fatherHeight}
              motherHeight={assessmentData.motherHeight}
              latestHeight={latestRecord?.height}
              latestAgeInMonths={latestRecord?.ageInMonths}
            />

            {/* 图表展示区 */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-black/5 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-zinc-900 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-indigo-500" />
                  {t('trends')}
                </h3>
              </div>
              
              <div className="space-y-10">
                <GrowthChart 
                  gender={assessmentData.gender} 
                  type="height" 
                  records={records} 
                  title={t('heightChartTitle')} 
                  unit={t('unitHeight')} 
                />
                <GrowthChart 
                  gender={assessmentData.gender} 
                  type="weight" 
                  records={records} 
                  title={t('weightChartTitle')} 
                  unit={t('unitWeight')} 
                />
              </div>
            </section>
          </div>

          {/* 📍 保存按钮：放在截图区域外部，防止按钮本身被截进去 */}
          <div className="flex justify-center px-4">
            <SaveReportButton targetId="report-area" />
          </div>

          {/* 📍 科学科普区域：放在截图区域外部，减少 html2canvas 的负担和报错率 */}
          <article className="mt-12 p-8 md:p-10 bg-white/60 backdrop-blur-sm rounded-[3rem] border border-white shadow-sm space-y-6 text-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
              <h2 className="text-xl font-bold">科学原理：如何预测孩子未来的“海拔”？</h2>
            </div>
            <div className="text-zinc-600 leading-relaxed space-y-5 text-sm md:text-base">
              <p>身高的秘密大约 <span className="font-bold text-indigo-600">70% 隐藏在遗传基因中</span>，剩下的 <span className="font-bold text-emerald-600">30% 则取决于后天的环境努力</span>。</p>
              <div className="bg-zinc-50/50 p-6 rounded-2xl border border-zinc-100">
                <h3 className="font-bold text-zinc-700 mb-3 text-sm">FPH 遗传预测公式</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <span className="block text-xs text-blue-400 font-
