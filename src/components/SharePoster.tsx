import React from 'react';
import { Download, Share2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../lib/TypeScript';

interface SharePosterProps {
  imageUrl: string;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export const SharePoster: React.FC<SharePosterProps> = ({ imageUrl, onClose, onDownload, onShare }) => {
  const { t } = useTranslation();

  const handleDownload = () => {
    trackEvent('click_share_poster', { label: 'download_image' });
    onDownload();
  };

  const handleShare = () => {
    trackEvent('click_share_poster', { label: 'copy_link' });
    onShare();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl p-6 space-y-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
          {imageUrl ? (
            <img src={imageUrl} alt="Growth Poster" className="w-full h-full object-contain" />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">正在准备海报...</div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-zinc-800 transition-all active:scale-95"
          >
            <Download className="w-5 h-5 mr-2" />
            {t('saveImage')}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Share2 className="w-5 h-5 mr-2" />
            {t('share')}
          </button>
        </div>
      </div>
    </div>
  );
};
