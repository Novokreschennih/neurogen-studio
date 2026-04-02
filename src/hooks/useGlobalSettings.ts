import { useState, useEffect, useCallback } from 'react';

export interface NeuroGenSettings {
  geminiKey: string;
  openRouterKey: string;
  routerAiKey: string;
  geminiModel: string;
  openRouterModel: string;
  routerAiModel: string;
  activeProvider: 'gemini' | 'openrouter' | 'routerai';
  darkMode: boolean;
  language: 'ru' | 'en';
}

const DEFAULT_SETTINGS: NeuroGenSettings = {
  geminiKey: '',
  openRouterKey: '',
  routerAiKey: '',
  geminiModel: 'gemini-2.5-flash',
  openRouterModel: 'google/gemini-2.0-flash-001',
  routerAiModel: 'openai/gpt-4o',
  activeProvider: 'gemini',
  darkMode: false,
  language: 'ru',
};

export function useGlobalSettings() {
  const [settings, setSettings] = useState<NeuroGenSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage
  const loadSettings = useCallback(() => {
    const loaded: NeuroGenSettings = {
      geminiKey: localStorage.getItem('neurogen-gemini-key') || '',
      openRouterKey: localStorage.getItem('neurogen-openrouter-key') || '',
      routerAiKey: localStorage.getItem('neurogen-routerai-key') || '',
      geminiModel: localStorage.getItem('neurogen-gemini-model') || 'gemini-2.5-flash',
      openRouterModel: localStorage.getItem('neurogen-openrouter-model') || 'google/gemini-2.0-flash-001',
      routerAiModel: localStorage.getItem('neurogen-routerai-model') || 'openai/gpt-4o',
      activeProvider: (localStorage.getItem('neurogen-active-provider') as any) || 'gemini',
      darkMode: localStorage.getItem('neurogen-dark-mode') === 'true',
      language: (localStorage.getItem('neurogen-language') as any) || 'ru',
    };
    setSettings(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Save individual setting
  const saveSetting = useCallback(<K extends keyof NeuroGenSettings>(
    key: K,
    value: NeuroGenSettings[K]
  ) => {
    const storageKey = `neurogen-${key}`;
    if (typeof value === 'boolean') {
      localStorage.setItem(storageKey, String(value));
    } else {
      localStorage.setItem(storageKey, value as string);
    }
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Get API key for current provider
  const getCurrentApiKey = useCallback(() => {
    switch (settings.activeProvider) {
      case 'gemini': return settings.geminiKey;
      case 'openrouter': return settings.openRouterKey;
      case 'routerai': return settings.routerAiKey;
    }
  }, [settings]);

  // Get current model
  const getCurrentModel = useCallback(() => {
    switch (settings.activeProvider) {
      case 'gemini': return settings.geminiModel;
      case 'openrouter': return settings.openRouterModel;
      case 'routerai': return settings.routerAiModel;
    }
  }, [settings]);

  // Check if has API key for provider
  const hasApiKey = useCallback((provider?: 'gemini' | 'openrouter' | 'routerai') => {
    const p = provider || settings.activeProvider;
    switch (p) {
      case 'gemini': return !!settings.geminiKey;
      case 'openrouter': return !!settings.openRouterKey;
      case 'routerai': return !!settings.routerAiKey;
    }
  }, [settings]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    saveSetting('darkMode', !settings.darkMode);
  }, [settings.darkMode, saveSetting]);

  return {
    settings,
    isLoaded,
    loadSettings,
    saveSetting,
    getCurrentApiKey,
    getCurrentModel,
    hasApiKey,
    toggleDarkMode,
  };
}
