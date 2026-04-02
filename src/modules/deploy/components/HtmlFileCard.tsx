import React from 'react';
import type { HtmlFile } from '../types';

interface HtmlFileCardProps {
  file: HtmlFile;
  previewUrl?: string;
  isSelected: boolean;
  onSetMain: (id: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onFullscreen: (file: HtmlFile) => void;
  onAnalyze: (id: string) => void;
  isAnalyzing: boolean;
}

export const HtmlFileCard: React.FC<HtmlFileCardProps> = ({
  file,
  previewUrl,
  isSelected,
  onSetMain,
  onSelect,
  onDelete,
  onFullscreen,
  onAnalyze,
  isAnalyzing,
}) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 ${isSelected ? 'ring-2 ring-indigo-500' : 'border border-slate-200 dark:border-slate-700'}`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">
            {file.path}
          </span>
          <button
            onClick={() => onDelete(file.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden mb-4 group border border-slate-200 dark:border-slate-700">
          {previewUrl ? (
            <iframe src={previewUrl} className="w-full h-full border-0" title={`Preview of ${file.name}`} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="text-4xl">⏳</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-start justify-end p-2 pointer-events-none">
            <button
              onClick={() => previewUrl && onFullscreen(file)}
              className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-auto"
            >
              ⛶
            </button>
          </div>
        </div>

        <input
          type="text"
          value={file.newFileName}
          disabled={file.isMain}
          onChange={(e) => {}}
          className="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all font-medium"
        />

        <div className="flex justify-between items-center mt-4 gap-2">
          <button
            onClick={() => onSetMain(file.id)}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-colors border ${
              file.isMain
                ? 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
          >
            ⭐ {file.isMain ? 'Главная' : 'Сделать главной'}
          </button>
          <button
            onClick={() => onAnalyze(file.id)}
            disabled={isAnalyzing}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
              isAnalyzing
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
            }`}
          >
            {isAnalyzing ? '⏳...' : '🔍 Анализ'}
          </button>
        </div>
      </div>
    </div>
  );
};
