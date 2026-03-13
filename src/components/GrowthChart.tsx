import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { WHO_DATA, Gender, getInterpolatedLMS, calculateZScore, zScoreToPercentile } from '../services/growthCalculations';
import { GrowthRecord } from '../types';

interface GrowthChartProps {
  gender: Gender;
  type: 'height' | 'weight' | 'headCircumference';
  records: GrowthRecord[];
  title: string;
  unit: string;
}

const PERCENTILES = [
  { p: 0.03, label: '3rd', color: '#000000', dash: '4 4' },
  { p: 0.15, label: '15th', color: '#000000', dash: '3 3' },
  { p: 0.5, label: 'Median', color: '#000000', dash: '' },
  { p: 0.85, label: '85th', color: '#000000', dash: '3 3' },
  { p: 0.97, label: '97th', color: '#000000', dash: '4 4' },
];

export const GrowthChart: React.FC<GrowthChartProps> = ({ gender, type, records, title, unit }) => {
  const { t } = useTranslation();
  const referenceData = WHO_DATA[gender][type];
  
  // Generate reference curve data (more points for smoother WHO curves)
  const referenceCurves = Array.from({ length: 121 }, (_, i) => {
    const month = i * 2; // Every 2 months
    const lms = getInterpolatedLMS(month, referenceData);
    const dataPoint: any = { month };
    
    PERCENTILES.forEach(({ p }) => {
      const zMap: Record<number, number> = { 0.03: -1.88, 0.15: -1.036, 0.5: 0, 0.85: 1.036, 0.97: 1.88 };
      const z = zMap[p];
      const { L, M, S } = lms;
      let value;
      if (L === 0) {
        value = M * Math.exp(S * z);
      } else {
        value = M * Math.pow(1 + L * S * z, 1 / L);
      }
      dataPoint[`p${Math.round(p * 100)}`] = Number(value.toFixed(2));
    });
    return dataPoint;
  });

  // Prepare user data points
  const userData = records.map(r => ({
    month: r.ageInMonths,
    userValue: r[type],
  })).sort((a, b) => a.month - b.month);

  const yDomain: [number, number] = type === 'height' ? [80, 200] : [2, 100];
  const yTicks = type === 'height' 
    ? Array.from({ length: (200 - 80) / 5 + 1 }, (_, i) => 80 + i * 5)
    : undefined;

  return (
    <div className="w-full h-[350px] md:h-[500px] bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-black/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-8 gap-2">
        <div>
          <h3 className="text-lg md:text-2xl font-black text-zinc-900 tracking-tight">{title}</h3>
          <p className="text-[10px] md:text-xs font-bold text-zinc-300 mt-1">{t('reference')}</p>
        </div>
        <div className={`px-3 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest ${gender === 'boy' ? 'bg-sky-50 text-sky-500 border border-sky-100' : 'bg-rose-50 text-rose-400 border border-rose-100'}`}>
          {gender === 'boy' ? t('prince') : t('princess')}
        </div>
      </div>
      <div className="w-full h-[calc(100%-60px)] md:h-[80%]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              type="number"
              domain={[0, 240]}
              tickFormatter={(m) => Math.floor(m / 12).toString()}
              ticks={[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240]}
              label={{ value: t('ageYears'), position: 'insideBottom', offset: 35, fontSize: 10, fill: '#a1a1aa', fontWeight: 'bold' }} 
              tick={{ fontSize: 9, fill: '#71717a' }}
              minTickGap={15}
            />
            <YAxis 
              domain={yDomain} 
              ticks={yTicks}
              tick={{ fontSize: 9, fill: '#71717a' }}
              tickFormatter={(val) => `${val}${unit}`}
              label={{ 
                value: `${t('value')} (${unit})`, 
                angle: -90, 
                position: 'insideLeft', 
                offset: 0,
                style: { textAnchor: 'middle', fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' } 
              }}
            />
          <Tooltip 
            labelFormatter={(m) => `${t('yearsOld', { count: Math.floor(m / 12) })} ${t('monthsOld', { count: Math.round(m % 12) })}`}
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
          />
          
          {PERCENTILES.map(({ p, label, color, dash }) => (
            <Line
              key={p}
              data={referenceCurves}
              type="monotone"
              dataKey={`p${Math.round(p * 100)}`}
              stroke={color}
              strokeDasharray={dash}
              dot={false}
              strokeWidth={label === 'Median' ? 2 : 1}
              opacity={label === 'Median' ? 0.8 : 0.5}
              name={label}
              connectNulls
            />
          ))}
          
          {userData.length > 0 && (
            <Line
              data={userData}
              type="monotone"
              dataKey="userValue"
              stroke={gender === 'boy' ? '#0ea5e9' : '#fb7185'}
              strokeWidth={3}
              dot={{ 
                r: 4, 
                fill: gender === 'boy' ? '#0ea5e9' : '#fb7185', 
                strokeWidth: 2, 
                stroke: '#fff' 
              }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name={t('babyData')}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};
