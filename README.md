# NeuroGen Studio

Универсальная платформа для создания, редизайна и деплоя сайтов с помощью искусственного интеллекта.

## 🚀 Возможности

### 1. Конструктор лендингов (🧲)

- Создание лендингов и лид-магнитов с нуля
- ИИ-генерация структуры и контента
- Выбор стиля дизайна (25+ вариантов)
- Загрузка и генерация изображений
- Экспорт в HTML

**Функции:**

- ✨ Генерация текста через AI (Gemini/OpenRouter/RouterAI)
- 🎨 25+ стилей дизайна (Glassmorphism, Cyberpunk, Minimalist и др.)
- 📸 Поддержка изображений (URL, загрузка файлов, AI-генерация)
- 📑 Гибкая структура блоков
- 💾 История проектов

### 2. Редизайн сайта (🎨)

- Анализ и улучшение существующих сайтов
- AI-оптимизация дизайна
- Применение стиля с референса
- Улучшение по инструкциям

**Функции:**

- 🔄 Редизайн HTML/текста
- 📋 Применение стиля с другого сайта
- ✏️ Улучшение по текстовым инструкциям
- 🎭 25+ предустановленных стилей

### 3. Деплой на GitHub Pages (🚀)

- Загрузка HTML/CSS/JS файлов
- AI-анализ SEO и доступности
- Оптимизация имён файлов
- Экспорт в ZIP

**Функции:**

- 📁 Загрузка нескольких файлов
- 🔍 AI-анализ кода
- ✨ Автоматические исправления
- 📦 ZIP-экспорт проекта

## 🛠️ Технологии

- **React 19** + TypeScript
- **Vite** для сборки
- **Tailwind CSS** для стилей
- **Google Gemini** / **OpenRouter** / **RouterAI** для ИИ
- **JSZip** для архивации
- **FileSaver** для скачивания файлов

## 📦 Установка

```bash
cd neurogen-studio
npm install
```

## 🏃 Запуск

```bash
# Режим разработки
npm run dev

# Сборка
npm run build

# Предпросмотр сборки
npm run preview
```

## ⚙️ Настройка API ключей

Приложение поддерживает три провайдера ИИ:

### Google Gemini

1. Получите ключ на [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Откройте настройки (⚙️) в приложении
3. Введите ключ в разделе "Google Gemini"

### OpenRouter

1. Получите ключ на [openrouter.ai](https://openrouter.ai)
2. Откройте настройки (⚙️) в приложении
3. Введите ключ в разделе "OpenRouter"
4. Укажите модель (например: `anthropic/claude-3.5-sonnet`)

### RouterAI

1. Получите ключ на [routerai.ai](https://routerai.ai)
2. Откройте настройки (⚙️) в приложении
3. Введите ключ в разделе "RouterAI"
4. Укажите модель (например: `openai/gpt-4o`)

## 📁 Структура проекта

```
neurogen-studio/
├── src/
│   ├── components/           # Общие UI компоненты
│   │   ├── Navigation.tsx    # Навигация
│   │   ├── Dashboard.tsx     # Главная страница
│   │   ├── SettingsModal.tsx # Настройки API
│   │   ├── LandingPage.tsx   # Страница входа
│   │   └── PinValidation.tsx # PIN-аутентификация
│   ├── modules/              # Основные модули
│   │   ├── landing/          # Конструктор лендингов
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── LandingCreatorModule.tsx
│   │   ├── redesign/         # Редизайн
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── RedesignModule.tsx
│   │   └── deploy/           # Деплой
│   │       ├── services/
│   │       ├── types.ts
│   │       ├── constants.ts
│   │       └── DeployModule.tsx
│   ├── hooks/                # React хуки
│   │   ├── useLocalStorage.ts
│   │   └── useTheme.ts
│   ├── constants.ts          # Глобальные константы
│   └── App.tsx               # Главный компонент
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔐 Аутентификация

### Yandex Database (YDB) Auth

Приложение интегрировано с YDB Authentication Guard через скрипт `public/auth.js`.

**Как это работает:**

1. При загрузке страницы `auth.js` проверяет наличие токена в URL (`?token=xxx`)
2. Если токен есть — сохраняет в `localStorage` и валидирует через API
3. Если токена нет — показывает экран входа (PIN-код)
4. После успешной аутентификации приложение разблокируется

**Настройки YDB:**

- **API URL:** `https://d5dsbah1d4ju0glmp9d0.3zvepvee.apigw.yandexcloud.net`
- **APP ID:** `bot-scenarios`

**Хранение токенов:**

- `ng_token` — JWT токен доступа
- `isAuthenticated` — флаг аутентификации

### PIN-аутентификация

Для входа через PIN-код:

1. Введите Telegram ID (цифры)
2. Введите PIN-код (формат: `NG-XXXXXX`)
3. Нажмите "ВОЙТИ В СИСТЕМУ"

Токен сохраняется в localStorage и действует 24 часа.

## 🎨 Стилевые темы

Приложение поддерживает светлую и тёмную тему.
Переключение темы доступно в верхней панели.

## 📝 Лицензия

MIT
