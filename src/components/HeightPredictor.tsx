import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Info } from 'lucide-react';
import { 
  WHO_DATA, 
  getInterpolatedLMS, 
  calculateZScore, 
  zScoreToPercentile,
  Gender,
  predictHeight
} from '../services/growthCalculations';

interface HeightPredictorProps {
  gender: Gender;
  fatherHeight?: string;
  motherHeight?: string;
  latestHeight?: number;
  latestAgeInMonths?: number;
}

export const HeightPredictor: React.FC<HeightPredictorProps> = ({
  gender,
  fatherHeight,
  motherHeight,
  latestHeight,
  latestAgeInMonths
}) => {
  const { t } = useTranslation();

  const prediction = useMemo(() => {
    return predictHeight(
      gender,
      parseFloat(fatherHeight || '0'),
      parseFloat(motherHeight || '0'),
      latestHeight,
      latestAgeInMonths
    );
  }, [gender, fatherHeight, motherHeight, latestHeight, latestAgeInMonths]);

  if (!prediction) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm space-y-6 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/50 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-lg font-black text-indigo-900 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-indigo-500 animate-pulse" />
          {t('aiPredictor')}
        </h3>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-indigo-200 flex items-center">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{t('predictionLogic')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-4">
          <div className="bg-white/60 p-6 rounded-3xl border border-white">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">{t('predictedHeight')}</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-black text-indigo-600">{prediction.final.toFixed(1)}</span>
              <span className="text-sm font-bold text-indigo-300 ml-1">{t('cm')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-indigo-400 px-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <p className="text-[10px] leading-tight font-medium">{t('predictionDesc')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-200">
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">{t('fuzzyRange')}</p>
            <div className="flex items-baseline text-white">
              <span className="text-2xl font-black">{prediction.range[0].toFixed(0)}</span>
              <span className="mx-2 opacity-50 font-bold">-</span>
              <span className="text-2xl font-black">{prediction.range[1].toFixed(0)}</span>
              <span className="text-sm font-bold opacity-70 ml-1">{t('cm')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/40 p-4 rounded-2xl border border-white/50">
              <p className="text-[9px] font-bold text-indigo-300 uppercase mb-1">{t('fatherHeight')}</p>
              <p className="text-sm font-black text-indigo-900">{fatherHeight}cm</p>
            </div>
            <div className="bg-white/40 p-4 rounded-2xl border border-white/50">
              <p className="text-[9px] font-bold text-indigo-300 uppercase mb-1">{t('motherHeight')}</p>
              <p className="text-sm font-black text-indigo-900">{motherHeight}cm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
