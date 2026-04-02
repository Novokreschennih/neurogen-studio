import { GoogleGenAI } from "@google/genai";
import { getGeminiKey, getOpenRouterKey, getRouterAiKey } from './apiKeyService';
import type { ApiProvider } from './types';

const generateText = async (prompt: string, provider: ApiProvider): Promise<string> => {
    if (provider === 'gemini') {
        const apiKey = getGeminiKey();
        if (!apiKey) throw new Error("Gemini API key not configured");
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    }
    
    if (provider === 'openrouter' || provider === 'routerai') {
        const apiKey = provider === 'openrouter' ? getOpenRouterKey() : getRouterAiKey();
        if (!apiKey) throw new Error(`${provider} API key not configured`);
        
        const url = provider === 'openrouter' 
            ? 'https://openrouter.ai/api/v1/chat/completions'
            : 'https://routerai.ru/api/v1/chat/completions';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: provider === 'openrouter' ? 'anthropic/claude-3.5-sonnet' : 'openai/gpt-4o',
                messages: [{ role: 'user', content: prompt }],
            })
        });
        
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }
    
    throw new Error('Unknown provider');
};

export const analyzeHtmlContent = async (htmlContent: string, provider: ApiProvider): Promise<string> => {
    const truncatedContent = htmlContent.substring(0, 15000);
    
    const prompt = `Проанализируй HTML-код на предмет улучшения SEO, доступности и семантики.
Предоставь отчет в формате Markdown.

HTML:
\`\`\`html
${truncatedContent}
\`\`\`

Ответ в формате Markdown.`;

    return await generateText(prompt, provider);
};

export const optimizeFileName = async (htmlContent: string, provider: ApiProvider): Promise<string> => {
    const content = htmlContent.replace(/<[^>]+>/g, ' ').substring(0, 2000);
    
    const prompt = `Предложи короткое SEO-имя файла (без .html) для этого контента. Верни только имя в kebab-case:
${content}`;

    const text = await generateText(prompt, provider);
    return text.trim().toLowerCase().replace(/\.html$/, '').replace(/[^a-z0-9-]/g, '-');
};

export const applyAnalysisFixes = async (htmlContent: string, provider: ApiProvider): Promise<string> => {
    const prompt = `Улучши этот HTML: добавь meta description, alt для изображений, семантические теги.
Верни ТОЛЬКО полный HTML без объяснений.

HTML:
\`\`\`html
${htmlContent}
\`\`\``;

    const response = await generateText(prompt, provider);
    const match = response.match(/```html\s*([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
};

export const generateSEO = async (htmlContent: string, provider: ApiProvider): Promise<{title: string, description: string}> => {
    const content = htmlContent.substring(0, 8000);
    
    const prompt = `Сгенерируй SEO title (до 60 символов) и description (до 160 символов) для этого HTML.
Верни JSON: {"title": "...", "description": "..."}

HTML: ${content}`;

    const response = await generateText(prompt, provider);
    try {
        const cleanJson = response.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch {
        return { title: 'Page', description: 'Description' };
    }
};
