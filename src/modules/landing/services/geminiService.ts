import { GoogleGenAI, Type } from "@google/genai";
import { FormData, Goal, ImageInputType, DesignStyle } from "../types";
import { getApiKey } from "./apiKeyService";

const cleanJsonString = (str: string): string => {
  const match = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (match) return match[1].trim();

  const firstBrace = str.indexOf("{");
  const lastBrace = str.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    return str.substring(firstBrace, lastBrace + 1);
  }

  return str.replace(/^```json\s*|```\s*$/g, "").trim();
};

const cleanHtmlString = (str: string): string => {
  const match = str.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (match) return match[1].trim();

  const docTypeIndex = str.indexOf("<!DOCTYPE");
  const htmlStartIndex = str.indexOf("<html");
  const startIndex = docTypeIndex !== -1 ? docTypeIndex : htmlStartIndex;
  const endIndex = str.lastIndexOf("</html>");

  if (startIndex !== -1 && endIndex !== -1) {
    return str.substring(startIndex, endIndex + 7).trim();
  }
  return str.trim();
};

const getAuthenticatedAi = (): GoogleGenAI => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "API-ключ Google Gemini не настроен. Пожалуйста, добавьте его в настройках.",
    );
  }
  return new GoogleGenAI({ apiKey });
};

const handleApiError = (error: any, defaultMessage: string): Error => {
  console.error("Gemini API Error:", error);
  if (
    error instanceof Error &&
    (error.message.includes("API key not valid") ||
      error.message.includes("permission denied") ||
      error.message.includes("API_KEY_INVALID"))
  ) {
    return new Error(
      "Неверный API-ключ. Пожалуйста, проверьте его в настройках.",
    );
  }
  return new Error(defaultMessage);
};

const getStyleRules = (style: DesignStyle | null): string => {
  switch (style) {
    case DesignStyle.WINDOWS_11:
      return `
            - Background: bg-slate-50 or slight gradients.
            - Cards: bg-white/70 backdrop-blur-md border border-white/40 shadow-sm rounded-lg (Mica effect).
            - Typography: Sans-serif (Segoe UI feel), text-slate-900.
            - Buttons: Rounded-md, solid colors with slight inner shadow.
            `;
    case DesignStyle.MACOS:
      return `
            - Background: Vivid gradients or abstract wallpapers.
            - Cards: bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl.
            - Typography: SF Pro style, clean, legible.
            - Buttons: Highly rounded (pills), gradient backgrounds.
            `;
    case DesignStyle.RETRO_WAVE:
      return `
            - Background: bg-slate-900 or deep purple.
            - Colors: Neon Pink, Cyan, Violet.
            - Typography: Monospace or retro display fonts.
            - Effects: Text shadows (glow), grid backgrounds.
            `;
    case DesignStyle.CYBERPUNK:
      return `
            - Background: bg-black or very dark grey.
            - Colors: Acid Green, Hot Pink, Bright Yellow.
            - Shapes: Angular, clipped corners (clip-path), heavy borders.
            - Typography: Glitch effects, Monospace, Uppercase.
            - UI: High contrast, futuristic.
            `;
    case DesignStyle.NEUMORPHISM:
      return `
            - Background: #e0e5ec (light gray).
            - Cards: Same color as background with double shadows (light top-left, dark bottom-right).
            - Borders: None or very subtle.
            - Rounding: Soft rounded corners (rounded-3xl).
            - Contrast: Low contrast, soft UI.
            `;
    case DesignStyle.BRUTALISM:
      return `
            - Background: Stark white or aggressive yellow/orange.
            - Borders: Thick black borders (border-4 border-black).
            - Shadows: Hard shadows (shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]).
            - Typography: Bold, large, standard sans-serif or serif.
            - Rounding: rounded-none (Sharp edges).
            `;
    case DesignStyle.GLASSMORPHISM:
      return `
            - Background: Colorful, deep gradients.
            - Cards: bg-white/10 backdrop-blur-lg border border-white/20 text-white.
            - Typography: White text, high readability.
            - Shadows: Soft, diffuse shadows.
            `;
    case DesignStyle.MINIMALIST:
      return `
            - Background: Pure white.
            - Typography: Heavy use of whitespace, large headings, black text.
            - Elements: No shadows, thin lines (border border-gray-100).
            - Colors: Monochrome with one accent color.
            `;
    default:
      return `
            - Style: Clean, Professional, Modern SaaS.
            - Colors: Indigo/Blue primary, slate text.
            - Rounding: rounded-xl.
            - Shadows: shadow-lg for cards.
            `;
  }
};

const SCHEMAS_PARTS: any = {
  landing: {
    hero: {
      type: Type.OBJECT,
      properties: {
        headline: {
          type: Type.STRING,
          description: "Мощный, цепляющий заголовок.",
        },
        subheadline: {
          type: Type.STRING,
          description: "Поясняющий подзаголовок.",
        },
        ctaButtonText: { type: Type.STRING, description: "Текст кнопки." },
      },
      required: ["headline", "subheadline", "ctaButtonText"],
    },
    painPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING, description: "Описание проблемы клиента." },
      description: "3 основные проблемы или боли целевой аудитории.",
    },
    solution: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["title", "description"],
    },
    features: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["title", "description"],
      },
      description: "3-5 ключевых преимуществ.",
    },
    howItWorks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.STRING, description: "Номер или название шага" },
          description: {
            type: Type.STRING,
            description: "Что происходит на этом шаге",
          },
        },
        required: ["step", "description"],
      },
      description: "3-4 шага взаимодействия.",
    },
    socialProof: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          quote: { type: Type.STRING },
          author: { type: Type.STRING },
          role: { type: Type.STRING },
        },
        required: ["quote", "author", "role"],
      },
      description: "2-3 отзыва.",
    },
    pricing: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          planName: { type: Type.STRING },
          price: { type: Type.STRING },
          features: { type: Type.ARRAY, items: { type: Type.STRING } },
          buttonText: { type: Type.STRING },
        },
        required: ["planName", "price", "features", "buttonText"],
      },
      description: "Тарифные планы (если уместно, иначе один вариант).",
    },
    author: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        bio: { type: Type.STRING },
      },
      required: ["name", "bio"],
    },
    faq: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["question", "answer"],
      },
      description: "3 частых вопроса и ответа.",
    },
    finalCta: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        buttonText: { type: Type.STRING },
      },
      required: ["headline", "buttonText"],
    },
  },
  leadMagnet: {
    title: {
      type: Type.OBJECT,
      properties: {
        mainTitle: { type: Type.STRING, description: "Название лид-магнита." },
        subtitle: { type: Type.STRING, description: "Ценностное предложение." },
      },
      required: ["mainTitle", "subtitle"],
    },
    introduction: {
      type: Type.STRING,
      description: "Введение, объясняющее, почему это важно.",
    },
    chapters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: {
            type: Type.STRING,
            description: "Подробный контент главы (2-3 абзаца).",
          },
        },
        required: ["title", "content"],
      },
      description: "3-5 основных разделов контента.",
    },
    checklist: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "items"],
      description: "Чек-лист действий.",
    },
    keyTakeaways: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Список из 5 ключевых выводов.",
    },
    author: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        bio: { type: Type.STRING },
      },
      required: ["name", "bio"],
    },
    cta: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Заголовок призыва." },
        buttonText: { type: Type.STRING, description: "Текст кнопки." },
      },
      required: ["title", "buttonText"],
    },
  },
};

export const generateTextContent = async (formData: FormData): Promise<any> => {
  const ai = getAuthenticatedAi();
  const isLandingPage = formData.goal === Goal.LANDING_PAGE;

  let schemaProperties: any = {};
  let requiredFields: string[] = [];

  if (isLandingPage) {
    formData.landingBlocks.forEach((block) => {
      schemaProperties[block] = SCHEMAS_PARTS.landing[block];
      requiredFields.push(block);
    });
  } else {
    formData.leadMagnetBlocks.forEach((block) => {
      schemaProperties[block] = SCHEMAS_PARTS.leadMagnet[block];
      requiredFields.push(block);
    });
  }

  const dynamicSchema = {
    type: Type.OBJECT,
    properties: schemaProperties,
    required: requiredFields,
  };

  const contentPrompt = isLandingPage
    ? `Ты — элитный маркетолог. Создай текст для лендинга по теме: '${formData.ideaDescription}'.
       Целевая аудитория: ${formData.targetAudience || "Широкая аудитория"}.
       Структура: ${formData.landingBlocks.join(", ")}.
       Используй формулу PAS или AIDA. Напиши продающий текст.
       ТОЛЬКО JSON.`
    : `Ты — эксперт. Создай лид-магнит по теме: '${formData.ideaDescription}'.
       Формат: ${formData.leadMagnetType}. Тон: ${formData.writingTone}.
       Структура: ${formData.leadMagnetBlocks.join(", ")}.
       ТОЛЬКО JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: formData.aiModel,
      contents: contentPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dynamicSchema,
      },
    });

    const jsonText = cleanJsonString(response.text);
    return JSON.parse(jsonText);
  } catch (error) {
    throw handleApiError(
      error,
      "Не удалось сгенерировать текстовое содержимое от AI.",
    );
  }
};

export const generateHtmlLayout = async (
  textContent: any,
  formData: FormData,
): Promise<string> => {
  const ai = getAuthenticatedAi();
  const isLandingPage = formData.goal === Goal.LANDING_PAGE;

  const imageReplacements = new Map<string, string>();
  let imageInstruction = "";

  if (formData.includeImages) {
    const validCustomImages = formData.customImages
      ? formData.customImages.filter(
          (img) =>
            (img.type === ImageInputType.URL &&
              img.url &&
              img.url.trim() !== "") ||
            (img.type === ImageInputType.FILE && img.url) ||
            img.type === ImageInputType.PROMPT,
        )
      : [];

    if (validCustomImages.length > 0) {
      const mappedImages = validCustomImages
        .map((img, idx) => {
          if (img.url && img.url.startsWith("data:")) {
            const placeholder = `{{LOCAL_IMG_${img.role.toUpperCase()}_${idx}}}`;
            imageReplacements.set(placeholder, img.url);
            return `- Role: ${img.role}, URL: ${placeholder}`;
          }
          if (img.type === ImageInputType.PROMPT) {
            const promptText = img.prompt || "";
            if (promptText.trim() !== "") {
              const encodedPrompt = encodeURIComponent(promptText);
              const pollUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
              return `- Role: ${img.role}, URL: ${pollUrl}`;
            } else {
              return `- Role: ${img.role}, URL: AUTO_GENERATE_VIA_POLLINATIONS`;
            }
          }
          return `- Role: ${img.role}, URL: ${img.url}`;
        })
        .join("\n");

      imageInstruction = `
            USER PROVIDED IMAGES:
            ${mappedImages}

            If URL is 'AUTO_GENERATE_VIA_POLLINATIONS', generate an English prompt for Pollinations.ai.
            If image missing, use https://picsum.photos/seed/{random}/800/600.
            `;
    } else {
      imageInstruction = `Use https://picsum.photos/seed/{random}/800/600 with different seeds.`;
    }
  } else {
    imageInstruction = `IMAGES DISABLED. Use gradients, patterns, SVG icons (heroicons style inline SVGs), and typography.`;
  }

  const styleRules = getStyleRules(formData.designStyle);

  const designPrompt = `
    Role: World-Class UI Developer (Tailwind CSS Master).
    Task: Convert the provided JSON content into a high-conversion HTML ${isLandingPage ? "Landing Page" : "Lead Magnet"}.

    [DESIGN SYSTEM INSTRUCTIONS]
    Style Name: ${formData.designStyle}
    Apply these specific rules for this style:
    ${styleRules}

    [CONTENT INSTRUCTIONS - CRITICAL]
    1. **NO PLACEHOLDERS:** You must use the EXACT text values from the provided JSON.
       - WRONG: <h1>{hero.headline}</h1>
       - WRONG: {features.map(...)}
       - RIGHT: <h1>Actual Headline From JSON</h1>

    2. **EXPAND ARRAYS:** If the JSON has an array (e.g., 'painPoints', 'features'), you must manually write out the HTML for EACH item. Do NOT use loops or pseudo-code.
       - Example: If 'features' has 3 items, write 3 <div class="card">...</div> blocks.

    3. **LINKS & BUTTONS:** For ALL Call-To-Action (CTA) buttons or links, you MUST use the following format for the 'href' attribute: href="{{Button Text}}".
       - This allows the webmaster to easily find and replace links later.
       - Example: If button text is "Get Access", code: <a href="{{Get Access}}" class="...">Get Access</a>
       - Example: If button text is "Купить сейчас", code: <a href="{{Купить сейчас}}" class="...">Купить сейчас</a>
       - NEVER use '#' or 'javascript:void(0)'. Always use the double curly braces placeholder with the exact button text.

    [INPUT DATA (JSON)]
    ${JSON.stringify(textContent, null, 2)}

    [OUTPUT]
    Return ONLY valid HTML5 code starting with <!DOCTYPE html>.
    Ensure mobile responsiveness (mobile-first).
    `;

  try {
    const response = await ai.models.generateContent({
      model: formData.aiModel,
      contents: designPrompt,
      config: {
        temperature: 0.7,
      },
    });

    let finalHtml = cleanHtmlString(response.text);

    if (imageReplacements.size > 0) {
      imageReplacements.forEach((base64Data, placeholder) => {
        finalHtml = finalHtml.split(placeholder).join(base64Data);
      });
    }

    return finalHtml;
  } catch (error) {
    throw handleApiError(error, "Не удалось сгенерировать HTML-макет от AI.");
  }
};

export const refineHtml = async (
  currentHtml: string,
  userRequest: string,
  formData: FormData,
): Promise<string> => {
  const ai = getAuthenticatedAi();

  const prompt = `
    Role: Senior Frontend Developer.
    Task: Edit the HTML based on the user request.

    User Request: "${userRequest}"

    Current HTML:
    \`\`\`html
    ${currentHtml}
    \`\`\`

    Rules:
    1. Maintain the existing design style.
    2. PRESERVE all href="{{...}}" placeholders exactly as they are. Do not change them to '#'.
    3. Return ONLY valid HTML.
    `;

  try {
    const response = await ai.models.generateContent({
      model: formData.aiModel,
      contents: prompt,
    });
    return cleanHtmlString(response.text);
  } catch (error) {
    throw handleApiError(
      error,
      "Не удалось отредактировать HTML с помощью AI.",
    );
  }
};
