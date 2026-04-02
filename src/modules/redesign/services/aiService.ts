import * as geminiService from './geminiService';
import * as openRouterService from './openRouterService';
import type { ApiProvider, DesignVariant } from '../types';
import { getGeminiKey, getOpenRouterKey, getRouterAiKey } from './apiKeyService';

interface AiConfig {
    provider: ApiProvider;
    apiKey: string;
    model: string;
}

export const generateDesign = async (
    provider: ApiProvider,
    code: string,
    style: string,
    model: string
): Promise<DesignVariant> => {
    if (provider === 'openrouter') {
        const apiKey = getOpenRouterKey();
        if (!apiKey) throw new Error("OpenRouter API key not configured");
        return openRouterService.generateDesign(apiKey, code, style, model);
    }
    if (provider === 'routerai') {
        const apiKey = getRouterAiKey();
        if (!apiKey) throw new Error("RouterAI API key not configured");
        // RouterAI uses same API as OpenRouter compatible
        return openRouterService.generateDesign(apiKey, code, style, model);
    }
    const apiKey = getGeminiKey();
    if (!apiKey) throw new Error("Gemini API key not configured");
    return geminiService.generateSingleDesign(apiKey, code, style, model);
};

export const applyDesign = async (
    provider: ApiProvider,
    referenceHtml: string,
    targetHtml: string,
    model: string
): Promise<DesignVariant> => {
    if (provider === 'openrouter') {
        const apiKey = getOpenRouterKey();
        if (!apiKey) throw new Error("OpenRouter API key not configured");
        return openRouterService.applyDesign(apiKey, referenceHtml, targetHtml, model);
    }
    if (provider === 'routerai') {
        const apiKey = getRouterAiKey();
        if (!apiKey) throw new Error("RouterAI API key not configured");
        return openRouterService.applyDesign(apiKey, referenceHtml, targetHtml, model);
    }
    const apiKey = getGeminiKey();
    if (!apiKey) throw new Error("Gemini API key not configured");
    return geminiService.applyDesign(apiKey, referenceHtml, targetHtml, model);
};

export const refineDesign = async (
    provider: ApiProvider,
    originalHtml: string,
    instruction: string,
    model: string
): Promise<DesignVariant> => {
    if (provider === 'openrouter') {
        const apiKey = getOpenRouterKey();
        if (!apiKey) throw new Error("OpenRouter API key not configured");
        return openRouterService.refineDesign(apiKey, originalHtml, instruction, model);
    }
    if (provider === 'routerai') {
        const apiKey = getRouterAiKey();
        if (!apiKey) throw new Error("RouterAI API key not configured");
        return openRouterService.refineDesign(apiKey, originalHtml, instruction, model);
    }
    const apiKey = getGeminiKey();
    if (!apiKey) throw new Error("Gemini API key not configured");
    return geminiService.refineDesign(apiKey, originalHtml, instruction, model);
};
