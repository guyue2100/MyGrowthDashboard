import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays, parseISO } from 'date-fns';
import { 
  Baby, 
  TrendingUp,
  Edit2
} from 'lucide-react';
import { GrowthChart } from './components/GrowthChart';
import { GrowthAssessmentForm } from './components/GrowthAssessmentForm';
import { HeightPredictor } from './components/HeightPredictor';
import { SharePoster } from './components/SharePoster';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { predictHeight } from './services/growthCalculations';

// --- 图标定义保持不变 ---
const BoyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#F0F9FF" />
    <path d="M9 7L10.5 5L12 7L13.5 5L15 7V9H9V7Z" fill="#FDE047" />
    <path d="M12 10C8.68629 10 6 12.6863 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10Z" fill="#7DD3FC" />
    <circle cx="9" cy="15" r="1" fill="#0369A1" />
    <circle cx="15" cy="15" r="1" fill="#0369A1" />
    <path d="M10 18.5C10 18.5 11 19.5 12 19.5C13 19.5 14 18.5 14 18.5" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GirlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FFF1F2" />
    <path d="M8 8C8 8 10 6 12 6C14 6 16 8 16 8L15 10H9L8 8Z" fill="#FDE047" />
    <circle cx="12" cy="6" r="1" fill="#EAB308" />
    <path d="M12 10C8.68629 10 6 12.6863 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10Z" fill="#FB7185" />
    <circle cx="9" cy="15" r="1" fill="#9F1239" />
    <circle cx="15" cy="15" r="1" fill="#9F1239" />
    <path d="M10 18.5C10 18.5 11 19.5 12 19.5C13 19.5 14 18.5 14 18.5" stroke="#9F1239" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function App() {
  const { t, i18n } = useTranslation();

  // --- 核心改动：不再读取 localStorage，初始数据永远为空 ---
  const [assessmentData, setAssessmentData] = useState<any>({
    gender: 'boy',
    birthday: new Date().toISOString().split('T')[0],
    fatherHeight: '',
    motherHeight: '',
    measurements: [{ date: new Date().toISOString().split('T')[0], height: '', weight: '' }]
  });

  // SEO 更新逻辑
  useEffect(() => {
    document.title = `${t('title')} - ${t('aiPredictor')}`;
    document.documentElement.lang = i18n.language;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `${t('subtitle')}. ${t('seoContent1')}`);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + window.location.pathname);
  }, [t, i18n.language]);

  // --- 核心改动：只更新内存状态，不再写入 localStorage ---
  const handleAssessmentSubmit = (data: any) => {
    setAssessmentData(data);
  };

  const records = useMemo(() => {
    if (!assessmentData || !assessmentData.measurements) return [];
    
    return assessmentData.measurements
      .filter((m: any) => m.height && m.weight) // 只记录完整填写的行
      .map((m: any, index: number) => {
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

  const prediction = useMemo(() => {
    // 如果没有输入身高或父母身高，不生成预测
    if (!latestRecord?.height || !assessmentData.fatherHeight || !assessmentData.motherHeight) return null;
    
    return predictHeight(
      assessmentData.gender,
      parseFloat(assessmentData.fatherHeight || '0'),
      parseFloat(assessmentData.motherHeight || '0'),
      latestRecord?.height,
      latestRecord?.ageInMonths
    );
  }, [assessmentData.gender, assessmentData.fatherHeight, assessmentData.motherHeight, latestRecord]);

  return (
    <div className="min-h-screen pb-10 md:pb-20 pt-6 md:pt-12">
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <h1 className="sr-only">{t('title')} - {t('aiPredictor')}</h1>

        <div className="lg:col-span-5">
          <div className="sticky top-8">
            <GrowthAssessmentForm 
              initialData={assessmentData} 
              onSubmit={handleAssessmentSubmit} 
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-10">
          <HeightPredictor 
            gender={assessmentData.gender}
            fatherHeight={assessmentData.fatherHeight}
            motherHeight={assessmentData.motherHeight}
            latestHeight={latestRecord?.height}
            latestAgeInMonths={latestRecord?.ageInMonths}
          />

          {prediction && (
            <SharePoster 
              gender={assessmentData.gender} 
              predictedHeight={prediction.final} 
            />
          )}

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
      </main>

      <footer className="max-w-5xl mx-auto px-4 md:px-6 mt-12 md:mt-16 mb-10">
        <div className="bg-white/50 backdrop-blur-sm p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-black/5 space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight leading-tight">
            {t('seoTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-zinc-600 leading-relaxed">
            <div className="space-y-4">
              <p className="text-sm md:text-base opacity-80">{t('seoContent1')}</p>
            </div>
            <div className="space-y-4">
              <p className="text-sm md:text-base opacity-80">{t('seoContent2')}</p>
            </div>
          </div>
          <div className="pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center sm:text-left">
              © 2026 Baby Growth Dashboard • {t('reference')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
