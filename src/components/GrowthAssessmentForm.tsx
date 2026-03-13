import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Weight, Calendar, ChevronRight, Plus, Trash2 } from 'lucide-react';

export interface Measurement {
  date: string;
  height: string;
  weight: string;
}

export interface AssessmentData {
  gender: 'boy' | 'girl';
  birthday: string;
  fatherHeight?: string;
  motherHeight?: string;
  measurements: Measurement[];
}

interface GrowthAssessmentFormProps {
  initialData?: AssessmentData | null;
  onSubmit: (data: AssessmentData) => void;
}

const BoyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#E0F2FE" />
    <path d="M9 7L10.5 5L12 7L13.5 5L15 7V9H9V7Z" fill="#FBBF24" />
    <path d="M12 10C8.68629 10 6 12.6863 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10Z" fill="#7DD3FC" />
    <circle cx="9" cy="15" r="1" fill="#0369A1" />
    <circle cx="15" cy="15" r="1" fill="#0369A1" />
    <path d="M10 18.5C10 18.5 11 19.5 12 19.5C13 19.5 14 18.5 14 18.5" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GirlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FCE7F3" />
    <path d="M8 8C8 8 10 6 12 6C14 6 16 8 16 8L15 10H9L8 8Z" fill="#FBBF24" />
    <circle cx="12" cy="6" r="1" fill="#F59E0B" />
    <path d="M12 10C8.68629 10 6 12.6863 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 12.6863 15.3137 10 12 10Z" fill="#F9A8D4" />
    <circle cx="9" cy="15" r="1" fill="#9D174D" />
    <circle cx="15" cy="15" r="1" fill="#9D174D" />
    <path d="M10 18.5C10 18.5 11 19.5 12 19.5C13 19.5 14 18.5 14 18.5" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const GrowthAssessmentForm: React.FC<GrowthAssessmentFormProps> = ({ initialData, onSubmit }) => {
  const { t } = useTranslation();
  const [gender, setGender] = useState<'boy' | 'girl'>(initialData?.gender || 'boy');
  const [birthday, setBirthday] = useState(initialData?.birthday || '');
  const [fatherHeight, setFatherHeight] = useState(initialData?.fatherHeight || '');
  const [motherHeight, setMotherHeight] = useState(initialData?.motherHeight || '');
  const [measurements, setMeasurements] = useState<Measurement[]>(
    initialData?.measurements || [{ date: new Date().toISOString().split('T')[0], height: '', weight: '' }]
  );

  const formatDisplayDate = (dateStr: string) => dateStr ? dateStr.replace(/-/g, '.') : 'YYYY.MM.DD';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ gender, birthday, fatherHeight, motherHeight, measurements });
  };

  const updateMeasurement = (index: number, field: keyof Measurement, value: string) => {
    const next = [...measurements];
    next[index] = { ...next[index], [field]: value };
    setMeasurements(next);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-black/5 space-y-8">
      <div className="space-y-6 p-6 bg-[#FFF9E6] rounded-[2rem] border border-[#FFEBB3] grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#D4A017] uppercase tracking-widest">性别</label>
          <div className="flex gap-4">
            {['boy', 'girl'].map((g) => (
              <button key={g} type="button" onClick={() => setGender(g as 'boy' | 'girl')} 
                className={`flex-1 p-4 rounded-2xl border-4 transition-all ${gender === g ? (g === 'boy' ? 'border-[#7DD3FC] bg-white shadow-[0_6px_0_0_#7DD3FC] -translate-y-1' : 'border-[#F9A8D4] bg-white shadow-[0_6px_0_0_#F9A8D4] -translate-y-1') : 'border-transparent opacity-40'}`}>
                {g === 'boy' ? <BoyIcon /> : <GirlIcon />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">出生日期</label>
          <div className="relative flex items-center bg-white p-4 rounded-xl border border-zinc-100 min-h-[56px]">
            <Calendar className="w-5 h-5 text-zinc-300 mr-3" />
            <span className="text-sm font-mono font-medium text-zinc-900">{formatDisplayDate(birthday)}</span>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full" required />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">父亲身高 (cm)</label>
          <div className="flex items-center bg-white p-4 rounded-xl border border-zinc-100">
            <Ruler className="w-5 h-5 text-zinc-300 mr-3" />
            <input type="number" step="0.1" value={fatherHeight} onChange={(e) => setFatherHeight(e.target.value)} placeholder="175" className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">母亲身高 (cm)</label>
          <div className="flex items-center bg-white p-4 rounded-xl border border-zinc-100">
            <Ruler className="w-5 h-5 text-zinc-300 mr-3" />
            <input type="number" step="0.1" value={motherHeight} onChange={(e) => setMotherHeight(e.target.value)} placeholder="162" className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">测量记录</label>
          <button type="button" onClick={() => setMeasurements([...measurements, { date: new Date().toISOString().split('T')[0], height: '', weight: '' }])} className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full uppercase tracking-widest hover:scale-105 transition-transform">
            <Plus className="w-3 h-3 inline mr-1" /> 添加记录
          </button>
        </div>
        {measurements.map((m, i) => (
          <div key={i} className="p-6 border border-zinc-100 rounded-[2rem] bg-white relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative flex items-center border-b border-zinc-50 py-2">
                <Calendar className="w-4 h-4 text-zinc-300 mr-2" />
                <span className="text-sm font-mono">{formatDisplayDate(m.date)}</span>
                <input type="date" value={m.date} onChange={(e) => updateMeasurement(i, 'date', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
              </div>
              <div className="flex items-center border-b border-zinc-50 py-2">
                <Ruler className="w-4 h-4 text-zinc-300 mr-2" />
                <input type="number" step="0.1" value={m.height} onChange={(e) => updateMeasurement(i, 'height', e.target.value)} placeholder="身高" className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono" required />
              </div>
              <div className="flex items-center border-b border-zinc-50 py-2">
                <Weight className="w-4 h-4 text-zinc-300 mr-2" />
                <input type="number" step="0.01" value={m.weight} onChange={(e) => updateMeasurement(i, 'weight', e.target.value)} placeholder="体重" className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono" required />
              </div>
            </div>
            {measurements.length > 1 && (
              <button type="button" onClick={() => setMeasurements(measurements.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-white text-zinc-300 hover:text-red-400 p-2 rounded-full shadow-sm border border-zinc-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button type="submit" className="w-full bg-[#FFD700] text-[#8B4513] py-5 rounded-[2rem] font-black text-lg flex items-center justify-center shadow-[0_8px_0_0_#DAA520] hover:bg-[#FFC800] active:translate-y-2 active:shadow-none transition-all">
        开始评估 <ChevronRight className="w-6 h-6 ml-2" />
      </button>
    </form>
  );
};
