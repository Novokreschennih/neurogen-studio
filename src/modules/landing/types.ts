// === Цели ===
export enum Goal {
  LANDING_PAGE = 'landing_page',
  LEAD_MAGNET = 'lead_magnet',
}

// === Форматы лид-магнита ===
export enum LeadMagnetFormat {
  PDF = 'PDF-документ',
  HTML = 'HTML-страница',
  CANVA = 'Шаблон для Canva',
}

// === Типы лид-магнита ===
export enum LeadMagnetType {
    GUIDE = 'Guide / How-to (Руководство)',
    CHECKLIST = 'Checklist (Чек-лист)',
    CHEAT_SHEET = 'Cheat Sheet (Шпаргалка)',
    CASE_STUDY = 'Case Study (Разбор кейса)',
    TEMPLATE = 'Template / Workbook (Шаблон/Рабочая тетрадь)',
    LISTICLE = 'Resource List (Список ресурсов/инструментов)',
    MISTAKES = 'Common Mistakes (Разбор ошибок)',
}

// === Длина контента ===
export enum ContentLength {
    SHORT = 'Short (Краткая выжимка)',
    MEDIUM = 'Medium (Стандартный - 3-5 страниц)',
    LONG = 'Long (Подробный - E-book style)',
}

// === Тон письма ===
export enum WritingTone {
    PROFESSIONAL = 'Professional (Экспертный, сдержанный)',
    CONVERSATIONAL = 'Conversational (Дружеский, разговорный)',
    PERSUASIVE = 'Persuasive (Продающий, мотивирующий)',
    URGENT = 'Urgent (Динамичный, призывающий к действию)',
    EMPATHETIC = 'Empathetic (Заботливый, понимающий)',
    WITTY = 'Witty/Humorous (С юмором)',
}

// === Стили дизайна ===
export enum DesignStyle {
  AUTO = 'AI Choice (Auto)',
  WINDOWS_11 = 'Windows 11 (Fluent Design)',
  MACOS = 'macOS (Apple Big Sur/Ventura)',
  MATERIAL_DESIGN_3 = 'Material Design 3 (Google)',
  BENTO_GRID = 'Bento Grid (Apple Style)',
  GLASSMORPHISM = 'Glassmorphism',
  CLAYMORPHISM = 'Claymorphism 3D',
  NEUMORPHISM = 'Neumorphism (Soft UI)',
  AURORA = 'Aurora Gradients',
  RETRO_WAVE = 'Retro Wave / Synthwave 80s',
  CYBERPUNK = 'Cyberpunk',
  BAUHAUS = 'Bauhaus Geometric',
  SWISS_STYLE = 'Swiss Style (International)',
  Y2K = 'Y2K Aesthetic (Late 90s)',
  POP_ART = 'Pop Art',
  HAND_DRAWN = 'Hand-drawn Sketch',
  MINIMALIST = 'Minimalist',
  BRUTALISM = 'Brutalism',
  CORPORATE = 'Corporate Clean',
  PLAYFUL = 'Playful & Bouncy',
  LUXURY = 'Luxury Serif',
  MONOCHROMATIC = 'Monochromatic',
  FUTURISTIC = 'Futuristic Sci-Fi',
  ISOMETRIC_3D = 'Isometric 3D',
}

// === AI Модели ===
export enum AIModel {
  GEMINI_FLASH = 'gemini-2.5-flash',
  GEMINI_PRO = 'gemini-3-pro-preview',
}

// === Типы изображений ===
export enum ImageInputType {
    URL = 'url',
    FILE = 'file',
    PROMPT = 'prompt'
}

// === Провайдеры API ===
export type ApiProvider = 'gemini' | 'openrouter' | 'routerai';

// === Модели OpenRouter/RouterAI ===
export interface OpenRouterModel {
  id: string;
  name: string;
}

// === Блоки лендинга и лид-магнита ===
export type LandingBlock = 'hero' | 'painPoints' | 'solution' | 'features' | 'howItWorks' | 'socialProof' | 'faq' | 'pricing' | 'author' | 'finalCta';
export type LeadMagnetBlock = 'title' | 'introduction' | 'chapters' | 'checklist' | 'keyTakeaways' | 'author' | 'cta';

// === Роли изображений ===
export type ImageRole = 'hero' | 'author' | 'feature' | 'logo' | 'general';

// === Пользовательское изображение ===
export interface CustomImage {
    url: string;
    role: ImageRole;
    type: ImageInputType;
    prompt?: string;
}

// === Форма данных ===
export interface FormData {
  goal: Goal | null;
  ideaDescription: string;
  targetAudience: string;
  leadMagnetType: LeadMagnetType;
  contentLength: ContentLength;
  writingTone: WritingTone;
  includeImages: boolean;
  customImages: CustomImage[];
  leadMagnetFormat: LeadMagnetFormat | null;
  designStyle: DesignStyle | null;
  provider: ApiProvider;
  aiModel: AIModel;
  openRouterModelId?: string;
  routerAiModelId?: string;
  landingBlocks: LandingBlock[];
  leadMagnetBlocks: LeadMagnetBlock[];
}

// === Элемент истории ===
export interface HistoryItem {
  id: string;
  timestamp: number;
  formData: FormData;
  generatedContent: string;
  chatHistory: { role: 'user' | 'ai', text: string }[];
}
