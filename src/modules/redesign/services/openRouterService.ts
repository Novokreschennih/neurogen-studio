import type { DesignVariant, OpenRouterModel } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const SITE_URL = window.location.origin;
const APP_NAME = 'NeuroGen Studio - Redesign';

const getHeaders = (apiKey: string) => ({
  'Authorization': `Bearer ${apiKey}`,
  'HTTP-Referer': SITE_URL,
  'X-Title': APP_NAME,
  'Content-Type': 'application/json',
});

export const getAvailableModels = async (apiKey: string): Promise<OpenRouterModel[]> => {
  try {
    const response = await fetch(`${OPENROUTER_API_URL}/models`, {
      headers: getHeaders(apiKey),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
    })).sort((a: OpenRouterModel, b: OpenRouterModel) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching OpenRouter models:", error);
    return [];
  }
};

const parseResponse = (content: string, defaultName: string): DesignVariant => {
    try {
        const cleanContent = content.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(cleanContent);

        if (!parsed.html) throw new Error('Missing HTML in response');

        return {
            id: crypto.randomUUID(),
            name: parsed.name || defaultName,
            html: parsed.html
        };
    } catch (e) {
        console.error("JSON Parse Error", e, content);
        throw new Error("The AI did not return valid JSON. Please try again.");
    }
};

const makeRequest = async (apiKey: string, model: string, messages: any[]) => {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
        method: 'POST',
        headers: getHeaders(apiKey),
        body: JSON.stringify({
            model,
            messages,
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
            throw new Error("OpenRouter Rate Limit Exceeded.");
        }
        throw new Error(errorData.error?.message || `OpenRouter API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "{}";
};

const getStyleDescription = (styleKey: string): string => {
    const styleMap: Record<string, string> = {
        aiChoice: "Analyze the content and determine the most suitable design style.",
        windows11: "Windows 11 Fluent Design (acrylic, mica effects, rounded corners)",
        macos: "Apple macOS Big Sur/Ventura aesthetic (translucency, SF Pro font)",
        apple: "Apple Website aesthetic (clean, minimalist, large typography)",
        material3: "Material Design 3 (dynamic colors, pills, large radii)",
        bento: "Bento Grid Layout (modular, card-based, rounded)",
        claymorphism: "Claymorphism (3D inflated shapes, inner shadows)",
        cyberpunk: "Cyberpunk (high contrast, neon colors, glitch effects)",
        retroWave: "Retro Wave / Synthwave (80s neon, grids, sunset gradients)",
        bauhaus: "Bauhaus style (geometric shapes, primary colors)",
        swiss: "Swiss Style (grid systems, Helvetica font)",
        y2k: "Y2K Aesthetic (metallic textures, chrome, gradients)",
        sketch: "Hand-drawn Sketch style (rough edges, handwritten fonts)",
        luxury: "Luxury / Elegant (serif headings, gold/black/white)",
        popArt: "Pop Art (comic book aesthetics, bold outlines)",
        isometric: "Isometric 3D (pseudo-3D elements, floating cards)",
        minimalist: "Minimalist (clean, whitespace, simple)",
        brutalism: "Brutalism (raw, bold, stark contrasts)",
        corporate: "Corporate (professional, clean, blue tones)",
        playful: "Playful (bright colors, rounded shapes)",
        futuristic: "Futuristic (tech-focused, dark themes)",
        neumorphism: "Neumorphism (soft UI, extruded plastic look)",
        aurora: "Aurora Gradients (soft, shifting gradients)",
        monochromatic: "Monochromatic (single color scheme)",
    };
    return styleMap[styleKey] || styleKey;
};

const generateDesignPrompt = (code: string, style: string) => {
    const styleDesc = getStyleDescription(style);
    return `
You are an expert UI/UX designer specializing in Tailwind CSS.
Transform the content into a beautifully designed webpage.

**Instructions:**
1. Preserve ALL original text content.
2. Apply Tailwind CSS for all styling.
3. Include Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
4. Design Style: ${styleDesc}
5. Return complete HTML document.

**Content:**
\`\`\`
${code}
\`\`\`

Return ONLY JSON: { "name": "Design Name", "html": "<!DOCTYPE html>..." }
`;
};

export const generateDesign = async (
    apiKey: string,
    code: string,
    style: string,
    model: string
): Promise<DesignVariant> => {
    const prompt = generateDesignPrompt(code, style);
    const content = await makeRequest(apiKey, model, [
        { role: "system", content: "You are an expert UI/UX designer. Output ONLY valid JSON." },
        { role: "user", content: prompt }
    ]);
    return parseResponse(content, 'Untitled Design');
};

const applyDesignPrompt = (referenceHtml: string, targetHtml: string) => {
    return `
Apply the design style from reference HTML to target HTML.
Preserve ALL content from target. Use Tailwind CSS.

**Reference:**
\`\`\`
${referenceHtml}
\`\`\`

**Target:**
\`\`\`
${targetHtml}
\`\`\`

Return ONLY JSON: { "name": "Applied Design", "html": "<!DOCTYPE html>..." }
`;
};

export const applyDesign = async (
    apiKey: string,
    referenceHtml: string,
    targetHtml: string,
    model: string
): Promise<DesignVariant> => {
    const content = await makeRequest(apiKey, model, [
        { role: "system", content: "You are an expert UI/UX designer. Output ONLY valid JSON." },
        { role: "user", content: applyDesignPrompt(referenceHtml, targetHtml) }
    ]);
    return parseResponse(content, 'Applied Design');
};

const refineDesignPrompt = (originalHtml: string, instruction: string) => {
    return `
Modify the HTML based on user instruction. Keep design consistent.

**Original:**
\`\`\`
${originalHtml}
\`\`\`

**Request:** "${instruction}"

Return ONLY JSON: { "name": "Refined Design", "html": "<!DOCTYPE html>..." }
`;
};

export const refineDesign = async (
    apiKey: string,
    originalHtml: string,
    instruction: string,
    model: string
): Promise<DesignVariant> => {
    const content = await makeRequest(apiKey, model, [
        { role: "system", content: "You are an expert frontend developer. Output ONLY valid JSON." },
        { role: "user", content: refineDesignPrompt(originalHtml, instruction) }
    ]);
    return parseResponse(content, 'Refined Design');
};
