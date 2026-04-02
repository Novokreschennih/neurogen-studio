import { FormData, Goal, OpenRouterModel, ImageInputType, DesignStyle } from "../types";
import { getRouterAiKey } from "./apiKeyService";
import { FALLBACK_ROUTERAI_MODELS } from "../constants";

const ROUTERAI_API_URL = "https://routerai.ru/api/v1";
const SITE_URL = window.location.origin;
const APP_NAME = "NeuroGen Studio";

const cleanJsonString = (str: string): string => {
  const match = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (match) return match[1].trim();

  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
      return str.substring(firstBrace, lastBrace + 1);
  }

  return str.replace(/^```json\s*|```\s*$/g, "").trim();
};

const cleanHtmlString = (str: string): string => {
    const match = str.match(/```(?:html)?\s*([\s\S]*?)```/i);
    if (match) return match[1].trim();

    const docTypeIndex = str.indexOf('<!DOCTYPE');
    const htmlStartIndex = str.indexOf('<html');
    const startIndex = docTypeIndex !== -1 ? docTypeIndex : htmlStartIndex;
    const endIndex = str.lastIndexOf('</html>');

    if (startIndex !== -1 && endIndex !== -1) {
        return str.substring(startIndex, endIndex + 7).trim();
    }

    return str.trim();
};

const getHeaders = (apiKey: string) => ({
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
});

const getStyleRules = (style: DesignStyle | null): string => {
    switch (style) {
        case DesignStyle.WINDOWS_11:
            return `Style: Windows 11 Fluent. Use bg-slate-50, mica effect cards (white/70 backdrop-blur), rounded-lg, Segoe UI font feel.`;
        case DesignStyle.CYBERPUNK:
            return `Style: Cyberpunk. Use bg-black, Neon Green/Pink text, Glitch effects, Angular borders (clip-path), Monospace font.`;
        case DesignStyle.BRUTALISM:
            return `Style: Brutalism. Use High contrast, Thick black borders (border-4), No rounding (rounded-none), Hard shadows.`;
        case DesignStyle.GLASSMORPHISM:
            return `Style: Glassmorphism. Use Colorful gradient background, white/20 backdrop-blur-xl cards, white text.`;
        case DesignStyle.NEUMORPHISM:
            return `Style: Neumorphism. Use #e0e5ec light gray bg, Soft double shadows, rounded-3xl, low contrast.`;
        case DesignStyle.RETRO_WAVE:
             return `Style: Synthwave 80s. Use Dark purple/navy bg, Grid lines, Neon gradients, Retro fonts.`;
        default:
            return `Style: Modern Clean SaaS. Use Tailwind defaults, lots of whitespace, rounded-xl, shadow-lg.`;
    }
};

export const getAvailableModels = async (providedApiKey?: string): Promise<OpenRouterModel[]> => {
    const apiKey = providedApiKey || getRouterAiKey();
    if (!apiKey) return FALLBACK_ROUTERAI_MODELS;

    try {
        const response = await fetch(`${ROUTERAI_API_URL}/models`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
            }
        });

        if (!response.ok) return FALLBACK_ROUTERAI_MODELS;

        const data = await response.json();
        if (data && data.data) {
            return data.data.map((m: any) => ({
                id: m.id,
                name: m.name || m.id
            })).sort((a: any, b: any) => a.name.localeCompare(b.name));
        }
        return FALLBACK_ROUTERAI_MODELS;
    } catch (error) {
        console.error("Error fetching RouterAI models:", error);
        return FALLBACK_ROUTERAI_MODELS;
    }
};

const callRouterAi = async (messages: any[], modelId: string, jsonMode: boolean = false) => {
    const apiKey = getRouterAiKey();
    if (!apiKey) throw new Error("API-ключ RouterAI не настроен.");

    const body: any = {
        model: modelId,
        messages: messages,
    };

    if (jsonMode) {
        body.response_format = { type: "json_object" };
    }

    const response = await fetch(`${ROUTERAI_API_URL}/chat/completions`, {
        method: "POST",
        headers: getHeaders(apiKey),
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`RouterAI Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
};

export const generateTextContent = async (formData: FormData): Promise<any> => {
    const isLandingPage = formData.goal === Goal.LANDING_PAGE;
    const modelId = formData.routerAiModelId || 'openai/gpt-4o';

    const blocks = isLandingPage ? formData.landingBlocks : formData.leadMagnetBlocks;
    const blockList = blocks.join(', ');

    const systemPrompt = `You are an elite marketer. Generate JSON content for a ${isLandingPage ? 'Landing Page' : 'Lead Magnet'}.
    Target Audience: ${formData.targetAudience || 'General'}.
    Included Sections: ${blockList}.
    Formula: PAS (Problem-Agitation-Solution).
    Language: Russian.

    Return ONLY JSON matching this structure keys: ${blockList}.
    `;

    const userPrompt = `Idea: ${formData.ideaDescription}. Generate content in JSON format.`;

    try {
        const content = await callRouterAi([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ], modelId, true);

        const cleanJson = cleanJsonString(content);
        return JSON.parse(cleanJson);
    } catch (error: any) {
        console.error("RouterAI Text Gen Error:", error);
        throw new Error(error.message || "Не удалось сгенерировать текст через RouterAI");
    }
};

export const generateHtmlLayout = async (textContent: any, formData: FormData): Promise<string> => {
    const modelId = formData.routerAiModelId || 'openai/gpt-4o';
    const isLandingPage = formData.goal === Goal.LANDING_PAGE;

    const imageReplacements = new Map<string, string>();
    let imageInstruction = "";

    if (formData.includeImages) {
        const validCustomImages = formData.customImages
            ? formData.customImages.filter(img =>
                (img.type === ImageInputType.URL && img.url && img.url.trim() !== '') ||
                (img.type === ImageInputType.FILE && img.url) ||
                (img.type === ImageInputType.PROMPT)
              )
            : [];

        if (validCustomImages.length > 0) {
            const mappedImages = validCustomImages.map((img, idx) => {
                 if (img.url && img.url.startsWith('data:')) {
                     const placeholder = `{{LOCAL_IMG_${img.role.toUpperCase()}_${idx}}}`;
                     imageReplacements.set(placeholder, img.url);
                     return `- Role: ${img.role}, URL: ${placeholder}`;
                 }
                 if (img.type === ImageInputType.PROMPT) {
                    return `- Role: ${img.role}, URL: AUTO_GENERATE_VIA_POLLINATIONS`;
                 }
                 return `- Role: ${img.role}, URL: ${img.url}`;
            }).join('\n');

            imageInstruction = `
            USER IMAGES:
            ${mappedImages}
            Use Pollinations.ai for auto-generation or Picsum if missing.
            `;
        } else {
            imageInstruction = `Use https://picsum.photos/seed/{random}/800/600 with different seeds.`;
        }
    } else {
        imageInstruction = `IMAGES DISABLED. Use gradients and typography only.`;
    }

    const styleRules = getStyleRules(formData.designStyle);

    const systemPrompt = `Role: Senior Frontend Developer.
    Task: Create HTML (Tailwind CSS) for a ${isLandingPage ? 'Landing Page' : 'Lead Magnet'}.

    [DESIGN RULES]
    ${styleRules}

    [CRITICAL CONTENT RULES]
    1. **NO PLACEHOLDERS:** Do NOT use {hero.title} or {items.map}.
       You MUST inject the actual strings from the JSON data into the HTML.
    2. **EXPAND ARRAYS:** Write out HTML for every item in arrays (features, testimonials, etc).
    3. **LINKS & BUTTONS:** For ALL Call-To-Action (CTA) buttons or links, you MUST use href="{{Button Text}}".
       - NEVER use '#' or 'javascript:void(0)'.

    [OUTPUT]
    Return ONLY valid HTML code. No markdown.
    `;

    const userPrompt = `Generate HTML using this JSON data:
    ${JSON.stringify(textContent, null, 2)}
    `;

    try {
        const content = await callRouterAi([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ], modelId, false);

        let finalHtml = cleanHtmlString(content);

        if (imageReplacements.size > 0) {
            imageReplacements.forEach((base64Data, placeholder) => {
                finalHtml = finalHtml.split(placeholder).join(base64Data);
            });
        }

        return finalHtml;
    } catch (error: any) {
        throw new Error(error.message || "Не удалось сгенерировать HTML через RouterAI");
    }
};

export const refineHtml = async (currentHtml: string, userRequest: string, formData: FormData): Promise<string> => {
    const modelId = formData.routerAiModelId || 'openai/gpt-4o';

    const systemPrompt = `Role: Senior Frontend Developer.
    Task: Edit HTML.
    Rules:
    1. Keep design consistency.
    2. PRESERVE all href="{{...}}" placeholders exactly as they are. Do not change them to '#'.
    3. Return ONLY valid HTML.
    `;

    const userPrompt = `Current HTML: ${currentHtml}\n\nRequest: ${userRequest}`;

    try {
        const content = await callRouterAi([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ], modelId, false);

        return cleanHtmlString(content);
    } catch (error: any) {
        throw new Error(error.message || "Не удалось обновить HTML через RouterAI");
    }
};
