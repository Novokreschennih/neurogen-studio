import type { OpenRouterModel } from './types';

export const FALLBACK_OPENROUTER_MODELS: OpenRouterModel[] = [
    { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
];

export const LOADING_MESSAGES = [
    "Анализируем код...",
    "Оптимизируем SEO...",
    "Улучшаем доступность...",
    "Применяем лучшие практики...",
];
