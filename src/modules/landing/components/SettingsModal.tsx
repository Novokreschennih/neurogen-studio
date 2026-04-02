import React, { useState, useEffect } from 'react';
import { ApiProvider, AIModel, OpenRouterModel } from '../types';
import { getAvailableModels as getOpenRouterModels } from '../services/openRouterService';
import { getAvailableModels as getRouterAiModels } from '../services/routerAiService';
import {
  saveApiKey, getApiKey,
  saveOpenRouterKey, getOpenRouterKey, getOpenRouterModel, saveOpenRouterModel,
  saveRouterAiKey, getRouterAiKey, getRouterAiModel, saveRouterAiModel,
  saveActiveProvider, getActiveProvider
} from '../services/apiKeyService';
import { FALLBACK_OPENROUTER_MODELS, FALLBACK_ROUTERAI_MODELS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState<ApiProvider>('gemini');
  
  const [geminiKey, setGeminiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [routerAiKey, setRouterAiKey] = useState('');
  
  const [openRouterModel, setOpenRouterModel] = useState('google/gemini-2.0-flash-001');
  const [routerAiModel, setRouterAiModel] = useState('openai/gpt-4o');
  
  const [openRouterModels, setOpenRouterModels] = useState<OpenRouterModel[]>(FALLBACK_OPENROUTER_MODELS);
  const [routerAiModels, setRouterAiModels] = useState<OpenRouterModel[]>(FALLBACK_ROUTERAI_MODELS);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(getApiKey() || '');
      setOpenRouterKey(getOpenRouterKey() || '');
      setRouterAiKey(getRouterAiKey() || '');
      setOpenRouterModel(getOpenRouterModel());
      setRouterAiModel(getRouterAiModel());
      setActiveProvider(getActiveProvider());
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'openrouter' && openRouterModels.length <= FALLBACK_OPENROUTER_MODELS.length) {
      loadOpenRouterModels();
    }
    if (isOpen && activeTab === 'routerai' && routerAiModels.length <= FALLBACK_ROUTERAI_MODELS.length) {
      loadRouterAiModels();
    }
  }, [isOpen, activeTab]);

  const loadOpenRouterModels = async () => {
    if (!openRouterKey) return;
    setIsLoadingModels(true);
    try {
      const models = await getOpenRouterModels(openRouterKey);
      if (models.length > 0) {
        setOpenRouterModels(models);
      }
    } catch (error) {
      console.error('Failed to load OpenRouter models:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const loadRouterAiModels = async () => {
    if (!routerAiKey) return;
    setIsLoadingModels(true);
    try {
      const models = await getRouterAiModels(routerAiKey);
      if (models.length > 0) {
        setRouterAiModels(models);
      }
    } catch (error) {
      console.error('Failed to load RouterAI models:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSave = () => {
    saveApiKey(geminiKey);
    saveOpenRouterKey(openRouterKey);
    saveRouterAiKey(routerAiKey);
    saveOpenRouterModel(openRouterModel);
    saveRouterAiModel(routerAiModel);
    saveActiveProvider(activeTab);
    onSettingsChange?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-white/10 w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Настройки AI</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <TabButton active={activeTab === 'gemini'} onClick={() => setActiveTab('gemini')} icon="💎" label="Gemini" />
          <TabButton active={activeTab === 'openrouter'} onClick={() => setActiveTab('openrouter')} icon="🌐" label="OpenRouter" />
          <TabButton active={activeTab === 'routerai'} onClick={() => setActiveTab('routerai')} icon="🔄" label="RouterAI" />
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-grow space-y-4 pr-2">
          {activeTab === 'gemini' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Введите ваш API ключ"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Получите ключ на{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  aistudio.google.com/apikey
                </a>
              </p>
            </div>
          )}

          {activeTab === 'openrouter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="Введите ваш API ключ"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Модель
                </label>
                <select
                  value={openRouterModel}
                  onChange={(e) => setOpenRouterModel(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                >
                  {openRouterModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Получите ключ на{' '}
                <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  openrouter.ai
                </a>
              </p>
            </div>
          )}

          {activeTab === 'routerai' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  RouterAI API Key
                </label>
                <input
                  type="password"
                  value={routerAiKey}
                  onChange={(e) => setRouterAiKey(e.target.value)}
                  placeholder="Введите ваш API ключ"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Модель
                </label>
                <select
                  value={routerAiModel}
                  onChange={(e) => setRouterAiModel(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                >
                  {routerAiModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Получите ключ на{' '}
                <a href="https://routerai.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  routerai.ai
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
      active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);
