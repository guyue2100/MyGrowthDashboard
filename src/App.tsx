import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays, parseISO } from 'date-fns';
import { 
  TrendingUp,
  Award,
  LineChart
} from 'lucide-react';

// 组件导入
import { GrowthChart } from './components/GrowthChart';
import { GrowthAssessmentForm } from './components/GrowthAssessmentForm';
import { HeightPredictor } from './components/HeightPredictor';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { SaveReportButton } from './components/SaveReportButton';

export default function App() {
  const { t } = useTranslation();
  
  // 1. 初始化状态：优先从 LocalStorage 读取
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

  // 2. 提交处理
  const handleAssessmentSubmit = (data: any) => {
    setAssessmentData(data);
    localStorage.setItem('growth_assessment', JSON.stringify(data));
  };

  // 3. 数据计算逻辑
  const records = useMemo(() => {
    if (!assessmentData || !assessmentData.measurements) return [];
    
    return assessmentData.measurements
      .filter((m: any) => m.height && m.weight) // 过滤掉空数据
      .map((m: any, index: number) => {
        const ageInMonths = Number(
          (differenceInDays(parseISO(m.date), parseISO(assessmentData.birthday)) / 30.4375).toFixed(2)
        );
        
        return {
          id: `record-${index}`,
          childId: 'child',
          date: m.date,
          ageInMonths,
          height: parseFloat(m.height),
          weight: parseFloat(m.weight),
        };
      })
      .sort((a: any, b: any) => a.ageInMonths - b.ageInMonths);
  }, [assessmentData]);

  const latestRecord = records[records.length - 1];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-6 md:pt-12">
      {/* 语言切换器 */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左侧区域：表单输入 */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-8">
            <div className="mb-6 px-2">
              <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
                <Award className="w-8 h-8 text-indigo-600" />
                宝宝成长 AI 评估
              </h1>
              <p className="text-zinc-500 text-sm mt-1">输入数据，获取科学的成长预测报告</p>
            </div>
            
            <GrowthAssessmentForm 
              initialData={assessmentData} 
              onSubmit={handleAssessmentSubmit} 
            />
          </div>
        </div>

        {/* 右侧区域：结果展示 */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 实时评估卡片 */}
          {latestRecord ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-blue-400">
                <p className="text-xs font-bold text-blue-400 uppercase mb-1">{t('latestHeight')}</p>
                <p className="text-3xl font-black text-blue-600">
                  {latestRecord.height}
                  <span className="text-sm ml-1 text-zinc-300">cm</span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-pink-400">
                <p className="text-xs font-bold text-pink-400 uppercase mb-1">{t('latestWeight')}</p>
                <p className="text-3xl font-black text-pink-500">
                  {latestRecord.weight}
                  <span className="text-sm ml-1 text-zinc-300">kg</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 p-8 rounded-3xl border-2 border-dashed border-indigo-200 text-center text-indigo-400 font-medium">
              请在左侧输入宝宝的最新身高体重数据
            </div>
          )}

          {/* AI 预测组件 */}
          <HeightPredictor 
            gender={assessmentData.gender}
            fatherHeight={assessmentData.fatherHeight}
            motherHeight={assessmentData.motherHeight}
            latestHeight={latestRecord?.height}
            latestAgeInMonths={latestRecord?.ageInMonths}
          />

          {/* 📍 核心：新的分享按钮调用方式 */}
          <div className="py-4">
            <SaveReportButton 
              data={{
                gender: assessmentData.gender,
                birthday: assessmentData.birthday,
                fatherHeight: assessmentData.fatherHeight,
                motherHeight: assessmentData.motherHeight,
                latestHeight: latestRecord?.height || 0,
                latestWeight: latestRecord?.weight || 0,
              }} 
            />
          </div>

          {/* 图表趋势 */}
          <section className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-zinc-100">
            <div className="flex items-center gap-2 mb-8">
              <LineChart className="w-6 h-6 text-indigo-500" />
              <h3 className="text-xl font-bold text-zinc-900">{t('trends')}</h3>
            </div>
            
            <div className="space-y-12">
              <GrowthChart 
                gender={assessmentData.gender} 
                type="height" 
                records={records} 
                title={t('heightChartTitle')} 
                unit="cm" 
              />
              <GrowthChart 
                gender={assessmentData.gender} 
                type="weight" 
                records={records} 
                title={t('weightChartTitle')} 
                unit="kg" 
              />
            </div>
          </section>

          {/* 科学说明区 */}
          <footer className="p-8 bg-zinc-800 rounded-[2.5rem] text-zinc-400 text-sm">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              科学评估说明
            </h4>
            <p className="leading-relaxed">
              本工具采用 WHO（世界卫生组织）儿童生长发育标准进行数据对比，遗传身高预测基于 FPH（Final Parental Height）公式计算。评估结果仅供家庭参考，不作为医学诊断依据。
            </p>
            <div className="mt-6 pt-6 border-t border-zinc-700 text-center text-[10px] uppercase tracking-tighter">
              Science Based • Independent Developer Dad • BabyGrow.online
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
