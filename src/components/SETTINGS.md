# ⚙️ NeuroGen Studio — Глобальные настройки

## 📍 Расположение

Настройки доступны через кнопку ⚙️ в верхней панели приложения.

---

## 🗂️ Вкладки настроек

### 1. AI Провайдеры 🤖

**Активный провайдер:**
- Выбор основного AI провайдера для всех модулей
- Быстрое переключение между Gemini, OpenRouter, RouterAI

**Google Gemini:**
- API Key
- Выбор модели (Gemini 2.5 Flash / Gemini 3.0 Pro)
- Ссылка на получение ключа

**OpenRouter:**
- API Key
- Выбор модели (Claude 3.5, GPT-4o, Gemini, DeepSeek)
- Ссылка на получение ключа

**RouterAI:**
- API Key
- Выбор модели (GPT-4o, GPT-4o mini, Claude 3.5)
- Ссылка на получение ключа

---

### 2. Внешний вид 🎨

**Тёмная тема:**
- Переключатель светлый/тёмный режим
- Применяется ко всему приложению
- Сохраняется в localStorage

**Язык интерфейса:**
- Русский 🇷🇺
- English 🇬🇧
- Планируется поддержка дополнительных языков

---

### 3. Правовая информация 📄

**Политика конфиденциальности:**
- Сбор информации
- Использование информации
- Хранение данных
- Безопасность
- Права пользователя
- Контакты

**Условия использования:**
- Принятие условий
- Описание сервиса
- Правила использования
- Интеллектуальная собственность
- Отказ от ответственности
- Изменения условий
- Контакты

---

## 💾 Хранение настроек

Все настройки сохраняются в **localStorage** браузера:

| Настройка | Ключ localStorage |
|-----------|------------------|
| Gemini API Key | `neurogen-gemini-key` |
| OpenRouter API Key | `neurogen-openrouter-key` |
| RouterAI API Key | `neurogen-routerai-key` |
| Gemini Model | `neurogen-gemini-model` |
| OpenRouter Model | `neurogen-openrouter-model` |
| RouterAI Model | `neurogen-routerai-model` |
| Active Provider | `neurogen-active-provider` |
| Dark Mode | `neurogen-dark-mode` |
| Language | `neurogen-language` |

---

## 🔌 Использование в модулях

### Хук useGlobalSettings

```typescript
import { useGlobalSettings } from './hooks/useGlobalSettings';

function MyComponent() {
  const {
    settings,
    isLoaded,
    loadSettings,
    saveSetting,
    getCurrentApiKey,
    getCurrentModel,
    hasApiKey,
    toggleDarkMode,
  } = useGlobalSettings();

  // Пример: проверка API ключа
  if (!hasApiKey()) {
    return <div>Настройте API ключ в настройках</div>;
  }

  // Пример: получение текущего API ключа
  const apiKey = getCurrentApiKey();
  const model = getCurrentModel();

  // ...
}
```

### Интерфейс NeuroGenSettings

```typescript
interface NeuroGenSettings {
  geminiKey: string;
  openRouterKey: string;
  routerAiKey: string;
  geminiModel: string;
  openRouterModel: string;
  routerAiModel: string;
  activeProvider: 'gemini' | 'openrouter' | 'routerai';
  darkMode: boolean;
  language: 'ru' | 'en';
}
```

---

## 🎯 Преимущества глобальных настроек

### ✅ Централизация
- Все настройки в одном месте
- Не нужно настраивать каждый модуль отдельно

### ✅ Согласованность
- Все модули используют одни и те же API ключи
- Единый активный провайдер для всего приложения

### ✅ Удобство
- Быстрое переключение между провайдерами
- Мгновенное применение изменений

### ✅ Экономия
- Не нужно вводить ключи несколько раз
- Общие настройки для всех модулей

---

## 🔄 Синхронизация настроек

Настройки автоматически синхронизируются между:

1. **Главным компонентом App.tsx**
2. **Модулем Конструктор лендингов**
3. **Модулем Редизайн**
4. **Модулем Деплой**

---

## 🛠️ Компоненты настроек

| Компонент | Расположение | Назначение |
|-----------|-------------|------------|
| `GlobalSettingsModal` | `src/components/` | Основное модальное окно настроек |
| `useGlobalSettings` | `src/hooks/` | Хук для доступа к настройкам |
| `Navigation` | `src/components/` | Кнопка открытия настроек |

---

## 📝 Примеры использования

### Проверка API ключа перед генерацией

```typescript
const { hasApiKey } = useGlobalSettings();

const handleGenerate = async () => {
  if (!hasApiKey()) {
    setError('Настройте API ключ в настройках');
    return;
  }
  // ... генерация
};
```

### Получение текущего провайдера и модели

```typescript
const { settings, getCurrentApiKey, getCurrentModel } = useGlobalSettings();

console.log(`Provider: ${settings.activeProvider}`);
console.log(`Model: ${getCurrentModel()}`);
console.log(`API Key: ${getCurrentApiKey()}`);
```

### Переключение тёмной темы

```typescript
const { settings, toggleDarkMode } = useGlobalSettings();

<button onClick={toggleDarkMode}>
  {settings.darkMode ? '☀️' : '🌙'}
</button>
```

---

## 🎨 Стилизация

Компонент настроек использует:

- **Tailwind CSS** для всех стилей
- **Тёмная тема** через класс `.dark`
- **Анимации** через кастомные классы
- **Градиенты** для акцентов

---

## 🔐 Безопасность

- ✅ API ключи хранятся только в localStorage
- ✅ Ключи не передаются на серверы NeuroGen
- ✅ Используются только для запросов к AI провайдерам
- ✅ Можно очистить в любой момент через браузер

---

## 📚 Дополнительная документация

- `API_KEYS.md` — Подробная настройка API ключей
- `README.md` — Общая информация о проекте
- `VERCEL.md` — Деплой на Vercel
