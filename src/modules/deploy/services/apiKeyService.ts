import { ApiProvider } from "../types";

const GEMINI_API_KEY_KEY = 'deploy-gemini-api-key';
const OPENROUTER_API_KEY_KEY = 'deploy-openrouter-api-key';
const ROUTERAI_API_KEY_KEY = 'deploy-routerai-api-key';

export const saveGeminiKey = (apiKey: string): void => {
  localStorage.setItem(GEMINI_API_KEY_KEY, apiKey);
};

export const getGeminiKey = (): string | null => {
  return localStorage.getItem(GEMINI_API_KEY_KEY);
};

export const saveOpenRouterKey = (apiKey: string): void => {
  localStorage.setItem(OPENROUTER_API_KEY_KEY, apiKey);
};

export const getOpenRouterKey = (): string | null => {
  return localStorage.getItem(OPENROUTER_API_KEY_KEY);
};

export const saveRouterAiKey = (apiKey: string): void => {
  localStorage.setItem(ROUTERAI_API_KEY_KEY, apiKey);
};

export const getRouterAiKey = (): string | null => {
  return localStorage.getItem(ROUTERAI_API_KEY_KEY);
};

export const hasApiKey = (provider: ApiProvider = 'gemini'): boolean => {
  if (provider === 'gemini') return !!getGeminiKey();
  if (provider === 'openrouter') return !!getOpenRouterKey();
  if (provider === 'routerai') return !!getRouterAiKey();
  return false;
};
