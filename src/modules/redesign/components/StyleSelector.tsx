import React from 'react';
import { DESIGN_STYLE_CONFIG } from '../constants';

interface StyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="style" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Стиль дизайна
      </label>
      <div className="relative">
        <select
          id="style"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm py-3 px-4 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm transition-all cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/80"
        >
          {Object.entries(DESIGN_STYLE_CONFIG).map(([key, label]) => (
            <option key={key} value={key} className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
