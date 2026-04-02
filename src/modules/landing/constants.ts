import {
  DesignStyle,
  LeadMagnetFormat,
  AIModel,
  OpenRouterModel,
  LandingBlock,
  LeadMagnetBlock,
  LeadMagnetType,
  ContentLength,
  WritingTone,
  ImageRole,
} from "./types";

export const DESIGN_STYLE_GROUPS = [
  {
    label: "🤖 Автоматический выбор",
    options: [
      {
        value: DesignStyle.AUTO,
        label: "На усмотрение ИИ (AI Choice)",
        description:
          "ИИ сам анализирует контент и подбирает наиболее подходящий стиль, цветовую палитру и шрифты.",
      },
    ],
  },
  {
    label: "💻 Системные и UI тренды",
    options: [
      {
        value: DesignStyle.WINDOWS_11,
        label: "Windows 11 (Fluent Design)",
        description:
          "Акриловые полупрозрачные текстуры, скругленные углы, шрифт Segoe UI, эффект 'Mica'.",
      },
      {
        value: DesignStyle.MACOS,
        label: "macOS (Apple)",
        description:
          "Стиль Big Sur/Ventura. Полупрозрачность, яркое размытие, шрифт SF Pro, скругленные прямоугольники.",
      },
      {
        value: DesignStyle.MATERIAL_DESIGN_3,
        label: "Material Design 3",
        description:
          "Стиль Google (Material You). Динамические цвета, овальные кнопки (pills), большие радиусы скругления.",
      },
      {
        value: DesignStyle.BENTO_GRID,
        label: "Бенто-сетка (Bento Grid)",
        description:
          "Модульная сетка в стиле Apple, карточная структура, четкая иерархия блоков.",
      },
    ],
  },
  {
    label: "✨ Эффекты и Материалы",
    options: [
      {
        value: DesignStyle.GLASSMORPHISM,
        label: "Глассморфизм (Glassmorphism)",
        description:
          "Эффект матового стекла, размытие фона, тонкие светлые границы, воздушность.",
      },
      {
        value: DesignStyle.CLAYMORPHISM,
        label: "Клейморфизм (Claymorphism)",
        description:
          "Объемные 'надутые' мягкие формы, внутренние тени, пастельные тона (3D эффект).",
      },
      {
        value: DesignStyle.NEUMORPHISM,
        label: "Неоморфизм (Neumorphism)",
        description:
          "Мягкий 'выдавленный' пластик, игра света и тени, низкий контраст.",
      },
      {
        value: DesignStyle.AURORA,
        label: "Аврора (Aurora)",
        description:
          "Мягкие, переливающиеся градиентные пятна на фоне, напоминающие северное сияние.",
      },
    ],
  },
  {
    label: "🎨 Художественные и Исторические",
    options: [
      {
        value: DesignStyle.RETRO_WAVE,
        label: "Ретро-вейв (Synthwave)",
        description:
          "Неон 80-х, темные фоны, сетки, градиенты заката (фиолетовый/розовый).",
      },
      {
        value: DesignStyle.CYBERPUNK,
        label: "Киберпанк (Cyberpunk)",
        description:
          "Высокий контраст, неоновые цвета (кислотно-зеленый, розовый), глитч-эффекты, футуризм.",
      },
      {
        value: DesignStyle.BAUHAUS,
        label: "Баухаус (Bauhaus)",
        description:
          "Геометрические формы, основные цвета (красный, синий, желтый), функционализм, гротескные шрифты.",
      },
      {
        value: DesignStyle.SWISS_STYLE,
        label: "Швейцарский стиль (Swiss)",
        description:
          "Строгие модульные сетки, асимметрия, шрифт Helvetica, акцент на типографике и читаемости.",
      },
      {
        value: DesignStyle.Y2K,
        label: "Эстетика Y2K",
        description:
          "Стиль конца 90-х/начала 2000-х. Хром, металлик, яркие розовые и голубые цвета.",
      },
      {
        value: DesignStyle.POP_ART,
        label: "Поп-арт (Pop Art)",
        description:
          "Комиксная стилистика, жирные черные обводки, паттерны из точек (halftone), яркие контрасты.",
      },
      {
        value: DesignStyle.HAND_DRAWN,
        label: "Набросок (Hand-drawn)",
        description:
          "Эффект нарисованного от руки интерфейса, неровные линии, бумажные текстуры.",
      },
    ],
  },
  {
    label: "📐 Настроение и Композиция",
    options: [
      {
        value: DesignStyle.MINIMALIST,
        label: "Минималистичный (Minimalist)",
        description:
          "Много воздуха (whitespace), чистые линии, сдержанная типографика.",
      },
      {
        value: DesignStyle.BRUTALISM,
        label: "Брутализм (Brutalism)",
        description:
          "Грубый, необработанный вид, стандартные шрифты, яркие 'безопасные' цвета, отсутствие скруглений.",
      },
      {
        value: DesignStyle.CORPORATE,
        label: "Корпоративный (Corporate)",
        description:
          "Надежный, профессиональный, сдержанный, часто синие оттенки, строгая структура.",
      },
      {
        value: DesignStyle.PLAYFUL,
        label: "Игривый (Playful)",
        description:
          "Яркие цвета, округлые формы, необычная типографика, дружелюбная атмосфера.",
      },
      {
        value: DesignStyle.LUXURY,
        label: "Люкс / Элегантный (Luxury)",
        description:
          "Шрифты с засечками (Serif), палитра золото/черный/белый, утонченность.",
      },
      {
        value: DesignStyle.MONOCHROMATIC,
        label: "Монохромный (Monochromatic)",
        description:
          "Использование оттенков одного цвета для всего интерфейса.",
      },
      {
        value: DesignStyle.FUTURISTIC,
        label: "Футуристичный (Futuristic)",
        description: "Технологичный вид, sci-fi элементы, темные темы.",
      },
      {
        value: DesignStyle.ISOMETRIC_3D,
        label: "Изометрия (Isometric 3D)",
        description:
          "Псевдо-трехмерные элементы, парящие карточки, геометрическая точность под углом.",
      },
    ],
  },
];

export const LEAD_MAGNET_FORMATS: LeadMagnetFormat[] = [
  LeadMagnetFormat.PDF,
  LeadMagnetFormat.HTML,
  LeadMagnetFormat.CANVA,
];

export const LEAD_MAGNET_TYPES: { value: LeadMagnetType; label: string }[] = [
  { value: LeadMagnetType.GUIDE, label: "📖 Руководство / Гайд" },
  { value: LeadMagnetType.CHECKLIST, label: "✅ Чек-лист" },
  { value: LeadMagnetType.CHEAT_SHEET, label: "📑 Шпаргалка" },
  { value: LeadMagnetType.CASE_STUDY, label: "💼 Разбор кейса" },
  { value: LeadMagnetType.TEMPLATE, label: "📝 Шаблон / Воркбук" },
  { value: LeadMagnetType.MISTAKES, label: "❌ Разбор ошибок" },
  { value: LeadMagnetType.LISTICLE, label: "📋 Список ресурсов" },
];

export const CONTENT_LENGTH_OPTIONS: { value: ContentLength; label: string }[] =
  [
    { value: ContentLength.SHORT, label: "⚡ Кратко (1-2 страницы)" },
    { value: ContentLength.MEDIUM, label: "📄 Стандарт (3-5 страниц)" },
    { value: ContentLength.LONG, label: "📚 Подробно (E-book)" },
  ];

export const WRITING_TONE_OPTIONS: { value: WritingTone; label: string }[] = [
  { value: WritingTone.PROFESSIONAL, label: "👔 Экспертный / Деловой" },
  { value: WritingTone.CONVERSATIONAL, label: "☕ Дружеский / Разговорный" },
  { value: WritingTone.PERSUASIVE, label: "🔥 Продающий / Мотивирующий" },
  { value: WritingTone.URGENT, label: "🚀 Динамичный / Действуй сейчас" },
  { value: WritingTone.EMPATHETIC, label: "❤️ Заботливый / Понимающий" },
  { value: WritingTone.WITTY, label: "😄 С юмором" },
];

export const TARGET_AUDIENCE_OPTIONS: string[] = [
  "Арбитражники трафика (Affiliate/CPA)",
  "Фитнес, ЗОЖ, Похудение (Nutra)",
  "Крипто-энтузиасты и Трейдеры (Crypto/Forex)",
  "Гемблинг и Беттинг аудитория",
  "Дейтинг и Знакомства (Adult/Mainstream)",
  "Предприниматели и Владельцы бизнеса",
  "Мамы в декрете / Родители",
  "Фрилансеры и Удаленные работники",
  "IT-специалисты и Веб-мастера",
  "Психологи, Коучи, Инфобизнес",
  "Бьюти-индустрия и Салоны красоты",
  "Агенты недвижимости и Риелторы",
  "Студенты и Молодежь",
  "Геймеры и Киберспортсмены",
  "Владельцы домашних животных",
];

export const AI_MODELS_OPTIONS: { value: AIModel; label: string }[] = [
  { value: AIModel.GEMINI_FLASH, label: "Gemini 2.5 Flash (Быстрый)" },
  { value: AIModel.GEMINI_PRO, label: "Gemini 3.0 Pro (Продвинутый)" },
];

export const FALLBACK_OPENROUTER_MODELS: OpenRouterModel[] = [
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "google/gemini-flash-1.5", name: "Gemini Flash 1.5 (via OR)" },
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek V3" },
];

export const FALLBACK_ROUTERAI_MODELS: OpenRouterModel[] = [
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o mini" },
  { id: "anthropic/claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet" },
  { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5" },
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
];

export const LOADING_MESSAGES: string[] = [
  "Подбираем лучшие слова...",
  "Рисуем дизайн...",
  "AI творит магию...",
  "Собираем пиксели в шедевр...",
  "Обучаем нейросеть хорошим манерам...",
  "Генерируем креативные идеи...",
];

export const LANDING_BLOCKS_OPTIONS: {
  id: LandingBlock;
  label: string;
  required?: boolean;
}[] = [
  { id: "hero", label: "Главный экран (Hero)", required: true },
  { id: "painPoints", label: "Проблемы/Боли" },
  { id: "solution", label: "Решение" },
  { id: "features", label: "Преимущества/Функции" },
  { id: "howItWorks", label: "Как это работает" },
  { id: "socialProof", label: "Отзывы (Social Proof)" },
  { id: "author", label: "Об авторе/команде" },
  { id: "pricing", label: "Цены/Тарифы" },
  { id: "faq", label: "Вопросы и ответы (FAQ)" },
  { id: "finalCta", label: "Финальный призыв", required: true },
];

export const LEAD_MAGNET_BLOCKS_OPTIONS: {
  id: LeadMagnetBlock;
  label: string;
  required?: boolean;
}[] = [
  { id: "title", label: "Обложка и Заголовок", required: true },
  { id: "introduction", label: "Введение" },
  { id: "chapters", label: "Главы (Основной контент)" },
  { id: "checklist", label: "Чек-лист" },
  { id: "keyTakeaways", label: "Ключевые выводы" },
  { id: "author", label: "Об авторе" },
  { id: "cta", label: "Призыв к действию (CTA)", required: true },
];

export const IMAGE_ROLE_OPTIONS: { value: ImageRole; label: string }[] = [
  { value: "hero", label: "Главный экран (Hero)" },
  { value: "author", label: "Фото автора" },
  { value: "logo", label: "Логотип" },
  { value: "feature", label: "Иллюстрация к разделу" },
  { value: "general", label: "Общее/Другое" },
];
