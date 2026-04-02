import { ApiProvider } from "../types";

const GEMINI_API_KEY_KEY = 'redesign-gemini-api-key';
const OPENROUTER_API_KEY_KEY = 'redesign-openrouter-api-key';
const OPENROUTER_MODEL_KEY = 'redesign-openrouter-model';
const ROUTERAI_API_KEY_KEY = 'redesign-routerai-api-key';
const ROUTERAI_MODEL_KEY = 'redesign-routerai-model';
const ACTIVE_PROVIDER_KEY = 'redesign-active-provider';

export const saveGeminiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(GEMINI_API_KEY_KEY, apiKey);
  } catch (error) {
    console.error("Could not save Gemini key", error);
  }
};

export const getGeminiKey = (): string | null => {
  try {
    return localStorage.getItem(GEMINI_API_KEY_KEY);
  } catch (error) {
    return null;
  }
};

export const saveOpenRouterKey = (apiKey: string): void => {
  try {
    localStorage.setItem(OPENROUTER_API_KEY_KEY, apiKey);
  } catch (error) {
    console.error("Could not save OpenRouter key", error);
  }
};

export const getOpenRouterKey = (): string | null => {
  try {
    return localStorage.getItem(OPENROUTER_API_KEY_KEY);
  } catch (error) {
    return null;
  }
};

export const saveRouterAiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(ROUTERAI_API_KEY_KEY, apiKey);
  } catch (error) {
    console.error("Could not save RouterAI key", error);
  }
};

export const getRouterAiKey = (): string | null => {
  try {
    return localStorage.getItem(ROUTERAI_API_KEY_KEY);
  } catch (error) {
    return null;
  }
};

export const saveActiveProvider = (provider: ApiProvider): void => {
    try {
        localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
    } catch (e) { console.error(e); }
}

export const getActiveProvider = (): ApiProvider => {
    return (localStorage.getItem(ACTIVE_PROVIDER_KEY) as ApiProvider) || 'gemini';
}

export const hasApiKey = (provider: ApiProvider = 'gemini'): boolean => {
  if (provider === 'gemini') return !!getGeminiKey();
  if (provider === 'openrouter') return !!getOpenRouterKey();
  if (provider === 'routerai') return !!getRouterAiKey();
  return false;
};
