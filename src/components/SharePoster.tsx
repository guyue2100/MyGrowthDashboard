import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Sparkles } from 'lucide-react';

interface SharePosterProps {
  gender: 'boy' | 'girl';
  predictedHeight: number;
}

const BoyCartoon = () => (
  <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-xl">
    <circle cx="100" cy="80" r="50" fill="#FFD1A4" />
    <path d="M60 60 Q100 20 140 60" fill="#4B2C20" />
    <circle cx="85" cy="85" r="4" fill="#333" />
    <circle cx="115" cy="85" r="4" fill="#333" />
    <path d="M90 105 Q100 115 110 105" stroke="#333" strokeWidth="2" fill="none" />
    <rect x="70" y="130" width="60" height="70" rx="20" fill="#0EA5E9" />
    <rect x="80" y="140" width="40" height="30" rx="5" fill="#7DD3FC" />
    <rect x="75" y="190" width="20" height="10" rx="5" fill="#0369A1" />
    <rect x="105" y="190" width="20" height="10" rx="5" fill="#0369A1" />
  </svg>
);

const GirlCartoon = () => (
  <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-xl">
    <circle cx="100" cy="80" r="50" fill="#FFD1A4" />
    <path d="M50 80 Q50 30 100 30 Q150 30 150 80" fill="#FB7185" />
    <circle cx="85" cy="85" r="4" fill="#333" />
    <circle cx="115" cy="85" r="4" fill="#333" />
    <path d="M90 105 Q100 115 110 105" stroke="#333" strokeWidth="2" fill="none" />
    <path d="M70 130 L130 130 L140 200 L60 200 Z" fill="#F43F5E" />
    <circle cx="100" cy="150" r="10" fill="#FDA4AF" />
    <rect x="75" y="195" width="20" height="5" rx="2" fill="#9F1239" />
    <rect x="105" y="195" width="20" height="5" rx="2" fill="#9F1239" />
  </svg>
);

export const SharePoster: React.FC<SharePosterProps> = ({ gender, predictedHeight }) => {
  const { t } = useTranslation();
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDownload = async () => {
    if (posterRef.current === null) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(posterRef.current, { cacheBust: true, quality: 1 });
      const link = document.createElement('a');
      link.download = `baby-growth-prediction-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl hover:shadow-2xl ${
            gender === 'boy' 
              ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-100' 
              : 'bg-rose-400 hover:bg-rose-500 text-white shadow-rose-100'
          }`}
        >
          <Share2 className="w-6 h-6" />
          <span className="text-lg tracking-tight">{t('sharePoster')}</span>
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="relative z-10 w-full max-w-[260px] bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-zinc-100">
            {/* Ultra Compact Header */}
            <div className={`py-3 px-4 text-center ${gender === 'boy' ? 'bg-sky-50/50' : 'bg-rose-50/50'}`}>
              <h3 className={`text-sm font-black ${gender === 'boy' ? 'text-sky-600' : 'text-rose-600'} tracking-tight`}>
                {gender === 'boy' ? t('boyPosterTitle') : t('girlPosterTitle')}
              </h3>
            </div>

            {/* Ultra Compact Content */}
            <div className="p-4 space-y-4 text-center">
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.1em]">{t('predictedHeight')}</p>
                <div className="flex items-baseline justify-center">
                  <span className={`text-4xl font-black ${gender === 'boy' ? 'text-sky-600' : 'text-rose-600'}`}>
                    {predictedHeight.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-zinc-300 ml-0.5">cm</span>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-2 bg-zinc-50/80 p-3 rounded-2xl border border-zinc-100/50">
                <div className="bg-white p-1.5 rounded-lg shadow-sm border border-zinc-50">
                  <QRCodeSVG value="https://www.babygrow.online/" size={70} level="H" />
                </div>
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{t('scanToPredict')}</p>
              </div>

              <div className="flex flex-col space-y-1.5">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-black text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-md text-sm ${
                    gender === 'boy' ? 'bg-sky-500 shadow-sky-100' : 'bg-rose-400 shadow-rose-100'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>{isGenerating ? t('generating') : t('save')}</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-1.5 rounded-lg font-bold text-zinc-400 hover:text-zinc-600 transition-colors text-[11px]"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Poster for Generation */}
      <div className="overflow-hidden h-0 w-0 absolute -left-[9999px]">
        <div 
          ref={posterRef}
          className={`w-[400px] h-[600px] p-10 flex flex-col items-center justify-center relative ${
            gender === 'boy' 
              ? 'bg-gradient-to-b from-sky-400 to-indigo-600' 
              : 'bg-gradient-to-b from-rose-400 to-violet-600'
          }`}
        >
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full border border-white/10"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 text-center space-y-4 mb-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-xs font-black tracking-widest uppercase">{t('aiPredictor')}</span>
            </div>
            <h1 className="text-white text-4xl font-black tracking-tight drop-shadow-md">
              {gender === 'boy' ? t('boyPosterTitle') : t('girlPosterTitle')}
            </h1>
          </div>

          {/* Result Card */}
          <div className="relative z-10 w-full bg-white/95 backdrop-blur-lg rounded-[3rem] p-10 shadow-2xl space-y-6 text-center mb-10">
            <p className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              {t('predictedHeight')}
            </p>
            <div className="flex items-baseline justify-center">
              <span className={`text-7xl font-black ${gender === 'boy' ? 'text-sky-600' : 'text-rose-600'}`}>
                {predictedHeight.toFixed(1)}
              </span>
              <span className="text-2xl font-bold text-zinc-300 ml-2">cm</span>
            </div>
            <div className="h-1.5 w-16 bg-zinc-100 mx-auto rounded-full"></div>
            <p className="text-[12px] text-zinc-400 font-medium leading-relaxed px-4">
              {t('predictionDesc')}
            </p>
          </div>

          {/* Footer with QR */}
          <div className="relative z-10 w-full flex items-center justify-between bg-black/10 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10">
            <div className="text-left">
              <p className="text-white font-black text-lg tracking-tight">Baby Growth Dashboard</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{t('scanToPredict')}</p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-lg">
              <QRCodeSVG value="https://www.babygrow.online/" size={60} level="H" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
