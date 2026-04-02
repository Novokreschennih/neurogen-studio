import React from 'react';
import type { DesignVariant, Viewport } from '../types';

interface PreviewCardProps {
  variant: DesignVariant;
  onViewFullScreen: (variant: DesignVariant) => void;
  onUseAsReference: (variant: DesignVariant) => void;
  originalHtml?: string;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ 
  variant, 
  onViewFullScreen, 
  onUseAsReference,
  originalHtml 
}) => {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [showOriginal, setShowOriginal] = React.useState(false);

  return (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/50 dark:border-white/5 flex flex-col group relative transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-black/50 hover:-translate-y-1">
      <div className="relative flex flex-col h-full">
        <div className="p-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center z-10">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2 text-sm">{variant.name}</h3>
          <div className="flex items-center space-x-1">
            {originalHtml && (
              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition mr-2"
                title="Сравнить с оригиналом"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onUseAsReference(variant)}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Использовать как референс"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg transition ${viewport === 'mobile' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              title="Мобильный вид"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg transition ${viewport === 'desktop' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              title="Десктоп вид"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewFullScreen(variant)}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Полноэкранный режим"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative">
          <div className={`absolute inset-0 transition-opacity duration-300 ${showOriginal ? 'opacity-100' : 'opacity-0'}`}>
            <iframe
              srcDoc={originalHtml}
              className={`w-full h-full ${viewport === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}
              title="Original"
            />
          </div>
          <iframe
            srcDoc={variant.html}
            className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${showOriginal ? 'opacity-0' : 'opacity-100'} ${viewport === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}
            title={variant.name}
          />
        </div>
      </div>
    </div>
  );
};
