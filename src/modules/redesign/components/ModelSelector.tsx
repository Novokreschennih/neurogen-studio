import React from 'react';
import { ApiProvider } from '../types';

interface ModelSelectorProps {
  provider: ApiProvider;
  model: string;
  onChange: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ provider, model, onChange }) => {
  const getModelOptions = () => {
    switch (provider) {
      case 'gemini':
        return [
          { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Быстрый)' },
          { value: 'gemini-3-pro-preview', label: 'Gemini 3.0 Pro (Продвинутый)' },
        ];
      case 'openrouter':
        return [
          { value: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
          { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
          { value: 'openai/gpt-4o', label: 'GPT-4o' },
          { value: 'deepseek/deepseek-chat', label: 'DeepSeek V3' },
        ];
      case 'routerai':
        return [
          { value: 'openai/gpt-4o', label: 'GPT-4o' },
          { value: 'openai/gpt-4o-mini', label: 'GPT-4o mini' },
          { value: 'anthropic/claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet' },
        ];
      default:
        return [];
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Модель ({provider === 'gemini' ? 'Google Gemini' : provider === 'openrouter' ? 'OpenRouter' : 'RouterAI'})
      </label>
      <select
        value={model}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
      >
        {getModelOptions().map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
