import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays, parseISO } from 'date-fns';
import { Award, LineChart } from 'lucide-react';

import { GrowthChart } from './components/GrowthChart';
import { GrowthAssessmentForm } from './components/GrowthAssessmentForm';
import { HeightPredictor } from './components/HeightPredictor';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  
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
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-6 font-sans">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-8">
            <div className="mb-6 px-2">
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Award className="w-8 h-8 text-indigo-600" />
                BabyGrow AI
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                {isEn ? "AI growth tool by a developer dad in Hangzhou" : "杭州程序猿爸爸为爱发电的 AI 育儿工具"}
              </p>
            </div>
            <GrowthAssessmentForm initialData={assessmentData} onSubmit={handleAssessmentSubmit} />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {latestRecord && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{t('latestHeight')}</p>
                <p className="text-3xl font-black text-slate-900">{latestRecord.height}<span className="text-sm ml-1 text-slate-300">cm</span></p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-1">{t('latestWeight')}</p>
                <p className="text-3xl font-black text-slate-900">{latestRecord.weight}<span className="text-sm ml-1 text-slate-300">kg</span></p>
              </div>
            </div>
          )}

          <HeightPredictor 
            gender={assessmentData.gender}
            fatherHeight={assessmentData.fatherHeight}
            motherHeight={assessmentData.motherHeight}
            latestHeight={latestRecord?.height}
            latestAgeInMonths={latestRecord?.ageInMonths}
          />

          <section className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-8 text-slate-800">
              <LineChart className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold">{t('trends')}</h3>
            </div>
            <div className="space-y-12">
              <GrowthChart gender={assessmentData.gender} type="height" records={records} title={t('heightChartTitle')} unit="cm" />
              <GrowthChart gender={assessmentData.gender} type="weight" records={records} title={t('weightChartTitle')} unit="kg" />
            </div>
          </section>

          <article className="p-8 md:p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-900">
                {isEn ? "Decoding the Growth Truth" : "深度解析：如何看懂宝宝的发育真相？"}
              </h2>
            </div>
            <div className="space-y-6 text-slate-600 leading-relaxed text-sm md:text-base">
              {isEn ? (
                <>
                  <p>Based on <strong>WHO Standards</strong>, growth is evaluated via <strong>Percentile Curves</strong>. Healthy growth parallels reference lines between 3rd and 97th percentiles.</p>
                  <p>Height prediction uses the <strong>FPH Algorithm</strong>. Genetics account for 70%, but quality sleep and nutrition help children reach their full potential.</p>
                </>
              ) : (
                <>
                  <p>本工具采用最新的 <strong>WHO（世界卫生组织）标准</strong>，通过 <strong>Percentile（百分位）曲线</strong> 进行动态评估。只要生长轨迹平行于参考线且处于 3rd 至 97th 百分位之间，通常属于健康。</p>
                  <p>遗传预测基于 <strong>FPH 算法</strong>。虽然遗传决定 70% 的最终身高，但后天的优质睡眠与精准营养干预，依然能帮助宝宝突破遗传潜能。</p>
                </>
              )}
              <footer className="pt-8 border-t border-slate-100 text-center font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                Science Based • Independent Developer Dad • BabyGrow.online
              </footer>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
