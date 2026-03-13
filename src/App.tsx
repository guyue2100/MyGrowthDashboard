import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { differenceInDays, parseISO } from 'date-fns';
import { Award, LineChart } from 'lucide-react';

// 组件导入 (请确保文件名拼写完全一致)
import { GrowthChart } from './components/GrowthChart';
import { GrowthAssessmentForm, AssessmentData } from './components/GrowthAssessmentForm';
import { HeightPredictor } from './components/HeightPredictor';
import { LanguageSwitcher } from './components/LanguageSwitcher';

// --- 1. i18n 配置直接内置，防止外部加载失败导致 Build Failed ---
const resources = {
  zh: {
    translation: {
      latestHeight: "当前身高",
      latestWeight: "当前体重",
      trends: "生长发育曲线",
      heightChartTitle: "身高发育参考曲线 (WHO)",
      weightChartTitle: "体重发育参考曲线 (WHO)",
      articleTitle: "深度解析：如何看懂宝宝的发育真相？",
      articleP1: "本工具采用最新的 WHO（世界卫生组织）标准，通过 Percentile（百分位）曲线进行动态评估。只要生长轨迹平行于参考线且处于 3rd 至 97th 百分位之间，通常属于健康发育范畴。",
      articleP2: "遗传身高预测基于 FPH 算法。虽然遗传基因决定了约 70% 的最终身高，但后天的优质睡眠、适度负重运动与精准营养干预，依然能帮助宝宝突破遗传潜能。",
      footerNote: "基于科学数据 • 杭州程序员爸爸为爱发电 • BabyGrow.online",
      medicalDisclaimer: "注：评估结果基于统计学模型，不作为医学诊断依据。"
    }
  },
  en: {
    translation: {
      latestHeight: "Latest Height",
      latestWeight: "Latest Weight",
      trends: "Growth Trends",
      heightChartTitle: "Height-for-age Percentiles (WHO)",
      weightChartTitle: "Weight-for-age Percentiles (WHO)",
      articleTitle: "Decoding the Growth Truth",
      articleP1: "Based on WHO Child Growth Standards, we evaluate development via Percentile Curves. Growth is generally healthy if the curve parallels reference lines and stays between 3rd and 97th percentiles.",
      articleP2: "Height prediction is based on the FPH algorithm. While genetics account for ~70%, quality sleep and nutrition can help children reach their full potential.",
      footerNote: "Science Based • Made by a Developer Dad • BabyGrow.online",
      medicalDisclaimer: "Note: Results are for reference only and not medical advice."
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "zh",
  fallbackLng: "zh",
  interpolation: { escapeValue: false }
});

export default function App() {
  const { t, i18n: i18nInstance } = useTranslation();
  const isEn = i18nInstance.language.startsWith('en');
  
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(() => {
    const saved = localStorage.getItem('growth_assessment');
    return saved ? JSON.parse(saved) : {
      gender: 'boy',
      birthday: new Date().toISOString().split('T')[0],
      fatherHeight: '',
      motherHeight: '',
      measurements: [{ date: new Date().toISOString().split('T')[0], height: '', weight: '' }]
    };
  });

  const handleAssessmentSubmit = (data: AssessmentData) => {
    setAssessmentData(data);
    localStorage.setItem('growth_assessment', JSON.stringify(data));
  };

  const records = useMemo(() => {
    if (!assessmentData?.measurements) return [];
    return assessmentData.measurements
      .filter((m) => m.height && m.weight)
      .map((m, index) => {
        const ageInMonths = Number((differenceInDays(parseISO(m.date), parseISO(assessmentData.birthday)) / 30.4375).toFixed(2));
        return {
          id: `record-${index}`,
          date: m.date,
          ageInMonths,
          height: parseFloat(m.height),
          weight: parseFloat(m.weight),
        };
      }).sort((a, b) => a.ageInMonths - b.ageInMonths);
  }, [assessmentData]);

  const latestRecord = records[records.length - 1];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-6">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：输入区域 */}
