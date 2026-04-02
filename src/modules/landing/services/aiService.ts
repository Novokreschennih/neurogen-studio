import { FormData } from "../types";
import * as GeminiService from "./geminiService";
import * as OpenRouterService from "./openRouterService";
import * as RouterAiService from "./routerAiService";

export const generateTextContent = async (formData: FormData): Promise<any> => {
    if (formData.provider === 'openrouter') {
        return OpenRouterService.generateTextContent(formData);
    }
    if (formData.provider === 'routerai') {
        return RouterAiService.generateTextContent(formData);
    }
    return GeminiService.generateTextContent(formData);
};

export const generateHtmlLayout = async (textContent: any, formData: FormData): Promise<string> => {
    if (formData.provider === 'openrouter') {
        return OpenRouterService.generateHtmlLayout(textContent, formData);
    }
    if (formData.provider === 'routerai') {
        return RouterAiService.generateHtmlLayout(textContent, formData);
    }
    return GeminiService.generateHtmlLayout(textContent, formData);
};

export const refineHtml = async (currentHtml: string, userRequest: string, formData: FormData): Promise<string> => {
    if (formData.provider === 'openrouter') {
        return OpenRouterService.refineHtml(currentHtml, userRequest, formData);
    }
    if (formData.provider === 'routerai') {
        return RouterAiService.refineHtml(currentHtml, userRequest, formData);
    }
    return GeminiService.refineHtml(currentHtml, userRequest, formData);
};
