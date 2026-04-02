import { ApiProvider } from "../types";

// Используем единые ключи для всех модулей (совместимо с auth.js)
const GEMINI_API_KEY_KEY = "neurogen-gemini-key";
const OPENROUTER_API_KEY_KEY = "neurogen-openrouter-api-key";
const ROUTERAI_API_KEY_KEY = "neurogen-routerai-key";
const ACTIVE_PROVIDER_KEY = "neurogen-provider";

// Gemini Keys
export const saveApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(GEMINI_API_KEY_KEY, apiKey);
  } catch (error) {
    console.error("Could not save API key to local storage", error);
  }
};

export const getApiKey = (): string | null => {
  try {
    return localStorage.getItem(GEMINI_API_KEY_KEY);
  } catch (error) {
    return null;
  }
};

// OpenRouter Keys
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

// OpenRouter Model Preference
export const saveOpenRouterModel = (modelId: string): void => {
  try {
    localStorage.setItem(OPENROUTER_MODEL_KEY, modelId);
  } catch (e) {
    console.error(e);
  }
};

export const getOpenRouterModel = (): string => {
  return (
    localStorage.getItem(OPENROUTER_MODEL_KEY) || "anthropic/claude-3.5-sonnet"
  );
};

// RouterAI Keys
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

// RouterAI Model Preference
export const saveRouterAiModel = (modelId: string): void => {
  try {
    localStorage.setItem(ROUTERAI_MODEL_KEY, modelId);
  } catch (e) {
    console.error(e);
  }
};

export const getRouterAiModel = (): string => {
  return localStorage.getItem(ROUTERAI_MODEL_KEY) || "openai/gpt-4o";
};

// Active Provider
export const saveActiveProvider = (provider: ApiProvider): void => {
  try {
    localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
  } catch (e) {
    console.error(e);
  }
};

export const getActiveProvider = (): ApiProvider => {
  return (localStorage.getItem(ACTIVE_PROVIDER_KEY) as ApiProvider) || "gemini";
};

export const hasApiKey = (provider: ApiProvider = "gemini"): boolean => {
  if (provider === "gemini") return !!getApiKey();
  if (provider === "openrouter") return !!getOpenRouterKey();
  if (provider === "routerai") return !!getRouterAiKey();
  return false;
};
