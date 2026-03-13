import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays, parseISO } from 'date-fns';
import { TrendingUp, Info } from 'lucide-react';

// 组件导入
import { GrowthChart } from './components/GrowthChart';
import { GrowthAssessmentForm } from './components/GrowthAssessmentForm';
import { HeightPredictor } from './components/HeightPredictor';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  const { t } = useTranslation();
  
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

  const records = useMemo(() => {
    if (!assessmentData || !assessmentData.measurements) return [];
    return assessmentData.measurements
      .filter((m: any) => m.height && m.weight)
      .map((m: any, index: number) => {
        const ageInMonths = Number((differenceInDays(parseISO(m.date), parseISO(assessmentData.birthday)) / 30.4375).toFixed(2));
        return {
          id: `record-${index}`,
          date: m.date,
          ageInMonths,
          height: parseFloat(m.height),
          weight: parseFloat(m.weight),
        };
      }).sort((a: any, b: any) => a.ageInMonths - b.ageInMonths);
  }, [assessmentData]);

  const latestRecord = records[records.length - 1];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 pt-6">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：输入区域 */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-8">
            <h1 className="text-2xl font-black text-slate-900 mb-6 px-2 tracking-tight">BabyGrow AI</h1>
            <GrowthAssessmentForm 
              initialData={assessmentData} 
              onSubmit={handleAssessmentSubmit} 
            />
          </div>
        </div>

        {/* 右侧：结果区域 */}
        <div className="lg:col-span-7 space-y-6">
          {/* 数据概览卡片 */}
          {latestRecord && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">{t('latestHeight')}</p>
                <p className="text-3xl font-black text-slate-900">{latestRecord.height}<span className="text-sm ml-1 text-slate-300">cm</span></p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider mb-1">{t('latestWeight')}</p>
                <p className="text-3xl font-black text-slate-900">{latestRecord.weight}<span className="text-sm ml-1 text-slate-300">kg</span></p>
              </div>
            </div>
          )}

          {/* 核心预测组件 */}
          <HeightPredictor 
            gender={assessmentData.gender}
            fatherHeight={assessmentData.fatherHeight}
            motherHeight={assessmentData.motherHeight}
            latestHeight={latestRecord?.height}
            latestAgeInMonths={latestRecord?.ageInMonths}
          />

          {/* 💡 移除了分享按钮，直接提示用户截屏 */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-indigo-700 leading-relaxed">
              <strong>提示：</strong>评估已生成。由于浏览器安全限制，如需保存结果，请直接使用手机截屏或按下 <kbd className="bg-white px-1.5 py-0.5 rounded border shadow-sm text-xs font-sans">Cmd/Ctrl + S</kbd>。
            </p>
          </div>

          {/* 图表展示 */}
          <section className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800">{t('trends')}</h3>
            </div>
            <div className="space-y-10">
              <GrowthChart gender={assessmentData.gender} type="height" records={records} title={t('heightChartTitle')} unit="cm" />
              <GrowthChart gender={assessmentData.gender} type="weight" records={records} title={t('weightChartTitle')} unit="kg" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
