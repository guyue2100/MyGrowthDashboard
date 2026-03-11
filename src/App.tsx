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
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { GrowthRecord } from './types';

const BoyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#E0F2FE" />
    <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#7DD3FC" />
    <circle cx="9" cy="11" r="1" fill="#0369A1" />
    <circle cx="15" cy="11" r="1" fill="#0369A1" />
    <path d="M10 14.5C10 14.5 11 15.5 12 15.5C13 15.5 14 14.5 14 14.5" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 6V4M10 5L12 4L14 5" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GirlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FCE7F3" />
    <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#F9A8D4" />
    <circle cx="9" cy="11" r="1" fill="#9D174D" />
    <circle cx="15" cy="11" r="1" fill="#9D174D" />
    <path d="M10 14.5C10 14.5 11 15.5 12 15.5C13 15.5 14 14.5 14 14.5" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 6C13 4 15 4 16 5M12 6C11 4 9 4 8 5" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function App() {
  const { t } = useTranslation();
  const [assessmentData, setAssessmentData] = useState<any>(() => {
    const saved = localStorage.getItem('growth_assessment');
    return saved ? JSON.parse(saved) : {
      gender: 'boy',
      birthday: new Date().toISOString().split('T')[0],
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
    <div className="min-h-screen pb-20 pt-12">
      {/* Language Switcher Floating */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
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
