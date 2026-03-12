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
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { GrowthRecord } from './types';

const BoyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#E0F2FE" />
    {/* Crown */}
    <path d="M9 7L10.5 5L12 7L13.5 5L15 7V9H9V7Z" fill="#FBBF24" />
    <path d="M12 10C8.68629 10 6 12.6863 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10Z" fill="#7DD3FC" />
    <circle cx="9" cy="15" r="1" fill="#0369A1" />
    <circle cx="15" cy="15" r="1" fill="#0369A1" />
    <path d="M10 18.5C10 18.5 11 19.5 12 19.5C13 19.5 14 18.5 14 18.5" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GirlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FCE7F3" />
    {/* Tiara */}
    <path d="M8 8C8 8 10 6 12 6C14 6 16 8 16 8L15 10H9L8 8Z" fill="#FBBF24" />
    <circle cx="12" cy="6" r="1" fill="#F59E0B" />
    <path d="M12 10C8.68629 10 6 12.6863 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10Z" fill="#F9A8D4" />
    <circle cx="9" cy="15" r="1" fill="#9D174D" />
    <circle cx="15" cy="15" r="1" fill="#9D174D" />
    <path d="M10 18.5C10 18.5 11 19.5 12 19.5C13 19.5 14 18.5 14 18.5" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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
    <div className="min-h-screen pb-10 md:pb-20 pt-6 md:pt-12">
      {/* Language Switcher Floating */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Left Column: Editor */}
        <div className="lg:col-span-5">
          <div className="sticky top-8">
            <GrowthAssessmentForm 
              initialData={assessmentData} 
              onSubmit={handleAssessmentSubmit} 
            />
          </div>
        </div>

        {/* Right Column: Charts */}
        <div className="lg:col-span-7 space-y-10">
          {latestRecord && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-8 border-blue-200 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 relative z-10">{t('latestHeight')}</p>
                <p className="text-3xl font-black text-blue-600 relative z-10">{latestRecord.height}<span className="text-sm ml-1 font-bold text-zinc-300">{t('unitHeight')}</span></p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-8 border-pink-200 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-pink-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-[10px] font-black text-pink-300 uppercase tracking-widest mb-2 relative z-10">{t('latestWeight')}</p>
                <p className="text-3xl font-black text-pink-500 relative z-10">{latestRecord.weight}<span className="text-sm ml-1 font-bold text-zinc-300">{t('unitWeight')}</span></p>
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
    </div>
  );
}
