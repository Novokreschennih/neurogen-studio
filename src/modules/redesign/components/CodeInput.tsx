import React from 'react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  height?: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Вставьте HTML код или текст...",
  label = "HTML код",
  height = "h-64"
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${height} p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-900 dark:text-white resize-none`}
      />
    </div>
  );
};
