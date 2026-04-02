import { GoogleGenAI, Type } from "@google/genai";
import type { DesignVariant } from '../types';

const getAIClient = (apiKey: string) => {
    return new GoogleGenAI({ apiKey });
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        html: { type: Type.STRING },
    },
    required: ["name", "html"]
};

const parseAndValidateResponse = (responseText: string, defaultName: string): DesignVariant => {
    try {
        const parsed = JSON.parse(responseText);
        if (typeof parsed.name !== 'string' || typeof parsed.html !== 'string') {
            throw new Error('Invalid response structure from AI. Missing name or html.');
        }
        return {
            id: crypto.randomUUID(),
            name: parsed.name || defaultName,
            html: parsed.html,
        };
    } catch (error) {
        console.error("Failed to parse AI response:", responseText, error);
        throw new Error("The AI returned an invalid response format. Please try again.");
    }
};

const getStyleDescription = (styleKey: string): string => {
    const styleMap: Record<string, string> = {
        aiChoice: "Analyze the content and determine the most suitable, modern, and professional design style.",
        windows11: "Windows 11 Fluent Design system (acrylic, mica effects, rounded corners, Segoe UI font)",
        macos: "Apple macOS Big Sur/Ventura aesthetic (translucency, vibrant blur, SF Pro font, rounded rectangles)",
        apple: "Apple Website aesthetic (clean, minimalist, large typography, SF Pro font, generous whitespace)",
        material3: "Material Design 3 (Material You, dynamic colors, pills, large corner radii)",
        bento: "Bento Grid Layout (structured, modular, card-based, rounded corners, clean)",
        claymorphism: "Claymorphism (3D inflated soft shapes, inner shadows, pastel colors)",
        cyberpunk: "Cyberpunk (high contrast, neon colors, glitch effects, futuristic)",
        retroWave: "Retro Wave / Synthwave (80s neon, grids, sunset gradients, dark background)",
        bauhaus: "Bauhaus style (geometric shapes, primary colors, sans-serif typography)",
        swiss: "Swiss Style (grid systems, asymmetric layouts, Helvetica font)",
        y2k: "Y2K Aesthetic (late 90s/early 2000s, metallic textures, chrome, gradients)",
        sketch: "Hand-drawn Sketch style (rough edges, pencil-like borders, handwritten fonts)",
        luxury: "Luxury / Elegant style (serif headings, gold/black/white palette)",
        popArt: "Pop Art style (comic book aesthetics, bold outlines, vibrant colors)",
        isometric: "Isometric 3D style (pseudo-3D elements, floating cards)",
        minimalist: "Minimalist (clean, lots of whitespace, simple typography)",
        brutalism: "Brutalism (raw, unpolished, bold, stark contrasts)",
        corporate: "Corporate (professional, clean, trustworthy, blue tones)",
        playful: "Playful (bright colors, rounded shapes, fun typography)",
        futuristic: "Futuristic (tech-focused, dark themes, sci-fi elements)",
        neumorphism: "Neumorphism (soft UI, extruded plastic look, low contrast)",
        aurora: "Aurora Gradients (soft, shifting gradient backgrounds)",
        monochromatic: "Monochromatic (single color scheme with various tints)",
    };
    return styleMap[styleKey] || styleKey;
};

const generateDesignPrompt = (code: string, style: string) => {
    const styleDesc = getStyleDescription(style);
    const styleInstruction = style === "aiChoice"
        ? "First, analyze the provided content and determine a suitable, modern, and professional design style. Then, apply it."
        : `Apply a '${styleDesc}' design style.`;

    return `
You are an expert UI/UX designer and frontend developer specializing in Tailwind CSS.
Your task is to take the user's content (HTML or plain text) and turn it into a beautifully designed webpage.

**Instructions:**
1. **Content Analysis:** Analyze the input. If it's plain text, structure it into semantic HTML.
2. **Preserve Content:** Do NOT change the original text content.
3. **Apply New Styles:** Replace all existing styles with Tailwind CSS classes.
4. **Use Tailwind CSS ONLY:** All styling must use Tailwind utility classes.
5. **Include Tailwind CDN:** Include: <script src="https://cdn.tailwindcss.com"></script>
6. **Return Full HTML:** Output must be a complete HTML document.
7. **Design Style:** ${styleInstruction}

**Original Content:**
\`\`\`
${code}
\`\`\`

Return ONLY valid JSON: { "name": "Design Name", "html": "<!DOCTYPE html>..." }
`;
};

export const generateSingleDesign = async (apiKey: string, code: string, style: string, modelName: string): Promise<DesignVariant> => {
    const ai = getAIClient(apiKey);
    const prompt = generateDesignPrompt(code, style);

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    return parseAndValidateResponse(response.text, 'Untitled Design');
};

const applyDesignPrompt = (referenceHtml: string, targetHtml: string) => {
    return `
You are an expert UI/UX designer. Your task is to apply the design style from a reference webpage to a target webpage.

**Instructions:**
1. Analyze the reference HTML to understand its design style (colors, typography, spacing, effects).
2. Apply those design elements to the target HTML.
3. Preserve ALL content from the target HTML.
4. Use Tailwind CSS for all styling.
5. Include Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
6. Return a complete HTML document.

**Reference Design:**
\`\`\`
${referenceHtml}
\`\`\`

**Target Content:**
\`\`\`
${targetHtml}
\`\`\`

Return ONLY valid JSON: { "name": "Applied Design", "html": "<!DOCTYPE html>..." }
`;
};

export const applyDesign = async (
    apiKey: string,
    referenceHtml: string,
    targetHtml: string,
    modelName: string
): Promise<DesignVariant> => {
    const ai = getAIClient(apiKey);
    const prompt = applyDesignPrompt(referenceHtml, targetHtml);

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    return parseAndValidateResponse(response.text, 'Applied Design');
};

const refineDesignPrompt = (originalHtml: string, instruction: string) => {
    return `
You are an expert frontend developer. Your task is to modify an existing HTML design based on user instructions.

**Instructions:**
1. Keep the overall design consistent.
2. Apply ONLY the requested changes.
3. Preserve all content unless specifically asked to change it.
4. Use Tailwind CSS for styling.
5. Return a complete HTML document.

**Original HTML:**
\`\`\`
${originalHtml}
\`\`\`

**User Request:** "${instruction}"

Return ONLY valid JSON: { "name": "Refined Design", "html": "<!DOCTYPE html>..." }
`;
};

export const refineDesign = async (
    apiKey: string,
    originalHtml: string,
    instruction: string,
    modelName: string
): Promise<DesignVariant> => {
    const ai = getAIClient(apiKey);
    const prompt = refineDesignPrompt(originalHtml, instruction);

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    return parseAndValidateResponse(response.text, 'Refined Design');
};
