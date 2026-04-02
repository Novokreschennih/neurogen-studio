import React, { useState } from 'react';
import { DESIGN_STYLE_CONFIG, FALLBACK_OPENROUTER_MODELS } from './constants';
import { generateDesign, applyDesign, refineDesign } from './services/aiService';
import { getActiveProvider, hasApiKey } from './services/apiKeyService';
import type { ApiProvider, DesignVariant } from './types';

export function RedesignModule() {
  const [mode, setMode] = useState<'redesign' | 'apply'>('redesign');
  const [inputHtml, setInputHtml] = useState('');
  const [referenceHtml, setReferenceHtml] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('aiChoice');
  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [generatedDesign, setGeneratedDesign] = useState<DesignVariant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refineInstruction, setRefineInstruction] = useState('');

  const handleGenerate = async () => {
    if (!inputHtml.trim()) {
      setError('Пожалуйста, введите HTML или текст для редизайна');
      return;
    }

    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен. Пожалуйста, добавьте его в настройках.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateDesign(provider, inputHtml, selectedStyle, model);
      setGeneratedDesign(result);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при генерации дизайна');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!referenceHtml.trim() || !inputHtml.trim()) {
      setError('Пожалуйста, введите оба HTML документа');
      return;
    }

    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await applyDesign(provider, referenceHtml, inputHtml, model);
      setGeneratedDesign(result);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при применении дизайна');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!generatedDesign || !refineInstruction.trim()) {
      setError('Введите инструкцию для улучшения');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await refineDesign(provider, generatedDesign.html, refineInstruction, model);
      setGeneratedDesign(result);
      setRefineInstruction('');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при улучшении дизайна');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedDesign) return;
    const blob = new Blob([generatedDesign.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redesign-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          🎨 Редизайн сайта
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Загрузите HTML и получите современный дизайн с сохранением контента
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMode('redesign')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            mode === 'redesign'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          ✨ Редизайн
        </button>
        <button
          onClick={() => setMode('apply')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            mode === 'apply'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          📋 Применить стиль
        </button>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Провайдер
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as ApiProvider)}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="gemini">Google Gemini</option>
            <option value="openrouter">OpenRouter</option>
            <option value="routerai">RouterAI</option>
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Модель
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Стиль дизайна
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
          >
            {Object.entries(DESIGN_STYLE_CONFIG).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        {mode === 'redesign' ? (
          <div>
            <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
              Введите HTML или текст для редизайна
            </label>
            <textarea
              value={inputHtml}
              onChange={(e) => setInputHtml(e.target.value)}
              placeholder="<html>...</html> или просто текст..."
              className="w-full h-64 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none font-mono text-sm"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
                Референс (дизайн)
              </label>
              <textarea
                value={referenceHtml}
                onChange={(e) => setReferenceHtml(e.target.value)}
                placeholder="<html>...</html>"
                className="w-full h-64 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
                Цель (контент)
              </label>
              <textarea
                value={inputHtml}
                onChange={(e) => setInputHtml(e.target.value)}
                placeholder="<html>...</html>"
                className="w-full h-64 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none font-mono text-sm"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={mode === 'redesign' ? handleGenerate : handleApply}
            disabled={isLoading}
            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Генерация...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>{mode === 'redesign' ? 'Сгенерировать' : 'Применить'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {generatedDesign && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Результат: {generatedDesign.name}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                📥 Скачать
              </button>
            </div>
          </div>

          {/* Refine */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={refineInstruction}
              onChange={(e) => setRefineInstruction(e.target.value)}
              placeholder="Например: сделай кнопки больше, измени цвет фона..."
              className="flex-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
            />
            <button
              onClick={handleRefine}
              disabled={isLoading || !refineInstruction.trim()}
              className="px-6 py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              Улучшить
            </button>
          </div>

          <iframe
            srcDoc={generatedDesign.html}
            className="w-full h-[600px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white"
            title="Preview"
          />
        </div>
      )}
    </div>
  );
}
