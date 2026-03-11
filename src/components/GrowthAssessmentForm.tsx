import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Weight, Calendar, Baby, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Gender } from '../services/growthCalculations';

export interface Measurement {
  date: string;
  height: string;
  weight: string;
}

export interface AssessmentData {
  gender: Gender;
  birthday: string;
  measurements: Measurement[];
}

interface GrowthAssessmentFormProps {
  initialData?: AssessmentData | null;
  onSubmit: (data: AssessmentData) => void;
}

const BoyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#E0F2FE" />
    <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#7DD3FC" />
    <circle cx="9" cy="11" r="1" fill="#0369A1" />
    <circle cx="15" cy="11" r="1" fill="#0369A1" />
    <path d="M10 14.5C10 14.5 11 15.5 12 15.5C13 15.5 14 14.5 14 14.5" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 6V4M10 5L12 4L14 5" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GirlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FCE7F3" />
    <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#F9A8D4" />
    <circle cx="9" cy="11" r="1" fill="#9D174D" />
    <circle cx="15" cy="11" r="1" fill="#9D174D" />
    <path d="M10 14.5C10 14.5 11 15.5 12 15.5C13 15.5 14 14.5 14 14.5" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 6C13 4 15 4 16 5M12 6C11 4 9 4 8 5" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const GrowthAssessmentForm: React.FC<GrowthAssessmentFormProps> = ({ initialData, onSubmit }) => {
  const { t } = useTranslation();
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'boy');
  const [birthday, setBirthday] = useState(initialData?.birthday || '');
  const [measurements, setMeasurements] = useState<Measurement[]>(
    initialData?.measurements || [
      { date: new Date().toISOString().split('T')[0], height: '', weight: '' }
    ]
  );

  const handleAddMeasurement = () => {
    if (measurements.length < 3) {
      setMeasurements([...measurements, { date: new Date().toISOString().split('T')[0], height: '', weight: '' }]);
    }
  };

  const handleRemoveMeasurement = (index: number) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter((_, i) => i !== index));
    }
  };

  const handleUpdateMeasurement = (index: number, field: keyof Measurement, value: string) => {
    const newMeasurements = [...measurements];
    newMeasurements[index] = { ...newMeasurements[index], [field]: value };
    setMeasurements(newMeasurements);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthday || measurements.some(m => !m.date || !m.height || !m.weight)) return;
    onSubmit({ gender, birthday, measurements });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-black/5 space-y-6 max-w-full">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-zinc-900">{t('measurements')}</h3>
        <p className="text-xs text-zinc-400">{t('subtitle')}</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#FFF9E6] rounded-[2rem] border border-[#FFEBB3]">
          <div className="space-y-4">
            <label className="block text-xs font-bold text-[#D4A017] uppercase tracking-widest">{t('gender')}</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setGender('boy')}
                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-4 transition-all duration-300 ${
                  gender === 'boy' 
                    ? 'border-[#7DD3FC] bg-white shadow-[0_8px_0_0_#7DD3FC] -translate-y-1' 
                    : 'border-transparent bg-white/50 text-zinc-400 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="mb-2 transform transition-transform group-hover:scale-110">
                  <BoyIcon />
                </div>
                <span className={`font-black text-sm ${gender === 'boy' ? 'text-[#0369A1]' : 'text-zinc-400'}`}>{t('boy')}</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('girl')}
                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-4 transition-all duration-300 ${
                  gender === 'girl' 
                    ? 'border-[#F9A8D4] bg-white shadow-[0_8px_0_0_#F9A8D4] -translate-y-1' 
                    : 'border-transparent bg-white/50 text-zinc-400 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="mb-2 transform transition-transform group-hover:scale-110">
                  <GirlIcon />
                </div>
                <span className={`font-black text-sm ${gender === 'girl' ? 'text-[#9D174D]' : 'text-zinc-400'}`}>{t('girl')}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('birthday')}</label>
            <div className="flex items-center bg-white p-3 rounded-xl border border-zinc-100 focus-within:border-indigo-500 transition-colors shadow-sm">
              <Calendar className="w-5 h-5 text-zinc-400 mr-2" />
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Measurements Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('measurements')}</label>
            {measurements.length < 3 && (
              <button
                type="button"
                onClick={handleAddMeasurement}
                className="text-xs font-black text-indigo-500 flex items-center hover:text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('addRecord')}
              </button>
            )}
          </div>

          <div className="space-y-4">
            {measurements.map((m, index) => (
              <div key={index} className="relative p-6 border border-zinc-100 rounded-3xl space-y-6 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#D4A017] bg-[#FFF9E6] px-3 py-1 rounded-full uppercase tracking-tighter">#{index + 1}</span>
                  {measurements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMeasurement(index)}
                      className="text-zinc-200 hover:text-red-400 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">{t('date')}</label>
                    <div className="flex items-center border-b border-zinc-100 focus-within:border-indigo-500 py-1 transition-colors">
                      <Calendar className="w-4 h-4 text-zinc-300 mr-2" />
                      <input
                        type="date"
                        value={m.date}
                        onChange={(e) => handleUpdateMeasurement(index, 'date', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">{t('height')} ({t('unitHeight')})</label>
                    <div className="flex items-center border-b border-zinc-100 focus-within:border-indigo-500 py-1 transition-colors">
                      <Ruler className="w-4 h-4 text-zinc-300 mr-2" />
                      <input
                        type="number"
                        step="0.1"
                        value={m.height}
                        onChange={(e) => handleUpdateMeasurement(index, 'height', e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">{t('weight')} ({t('unitWeight')})</label>
                    <div className="flex items-center border-b border-zinc-100 focus-within:border-indigo-500 py-1 transition-colors">
                      <Weight className="w-4 h-4 text-zinc-300 mr-2" />
                      <input
                        type="number"
                        step="0.01"
                        value={m.weight}
                        onChange={(e) => handleUpdateMeasurement(index, 'weight', e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#FFD700] text-[#8B4513] py-5 rounded-[2rem] font-black text-lg flex items-center justify-center hover:bg-[#FFC800] transition-all shadow-[0_8px_0_0_#DAA520] active:shadow-none active:translate-y-2"
      >
        {t('calculate')}
        <ChevronRight className="w-6 h-6 ml-2" />
      </button>
    </form>
  );
};
