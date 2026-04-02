# ⚡ NeuroGen Studio — Быстрый старт для деплоя

## 🚀 Деплой за 5 минут

### 1. Установите зависимости

```bash
cd /home/yaronov/Проекты/проекты/landing-leadmagnet-deploy/neurogen-studio
npm install
```

### 2. Создайте репозиторий на GitHub

```bash
# Инициализация Git
git init
git add .
git commit -m "Initial commit - NeuroGen Studio"

# Добавьте удалённый репозиторий (замените на свой)
git remote add origin https://github.com/YOUR_USERNAME/neurogen-studio.git
```

### 3. Задеплойте

```bash
# Вариант A: Автоматический деплой (рекомендуется)
npm run deploy

# Вариант B: Ручной деплой через GitHub Actions
git push -u origin main
# Затем в репозитории: Settings → Pages → Branch: gh-pages
```

### 4. Включите GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. Выберите **Branch:** `gh-pages`
4. Нажмите **Save**

### 5. Готово!

Приложение доступно по адресу:
```
https://YOUR_USERNAME.github.io/neurogen-studio/
```

---

## 📝 Что нужно изменить перед деплоем

### 1. Обновите `package.json`

Замените `your-username` на ваш GitHub username:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/neurogen-studio"
}
```

### 2. (Опционально) Настройте базовый путь

Если деплоите не в корень, обновите `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/neurogen-studio/', // Имя вашего репозитория
  // ... остальная конфигурация
})
```

---

## 🔄 Обновление после изменений

```bash
# Внесите изменения в код
git add .
git commit -m "Описание изменений"

# Задеплойте заново
npm run deploy
```

Или используйте GitHub Actions (автоматически при пуше в main):

```bash
git push origin main
```

---

## 📦 Структура файлов для деплоя

```
neurogen-studio/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Автоматический деплой
├── public/
│   ├── auth.js             # Auth Guard
│   └── landing.html        # Лендинг
├── src/
│   ├── modules/            # 3 модуля
│   ├── components/
│   └── App.tsx
├── dist/                   # Папка сборки (для деплоя)
├── package.json
└── DEPLOY.md               # Полная инструкция
```

---

## 🎯 Команды для работы

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки |
| `npm run build` | Сборка для продакшена |
| `npm run deploy` | Сборка + деплой на GitHub Pages |
| `npm run preview` | Предпросмотр сборки |

---

## ⚠️ Важно помнить

1. **API ключи** не коммитятся в Git — каждый пользователь настраивает свои
2. **localStorage** используется для хранения токенов и ключей
3. **gh-pages** создаёт отдельную ветку для деплоя
4. **GitHub Actions** автоматически деплоит при пуше в main

---

## 📚 Полная документация

- `DEPLOY.md` — подробная инструкция по деплою
- `API_KEYS.md` — настройка API ключей
- `README.md` — общая информация о проекте
- `LANDING.md` — документация лендинга

---

## 🆘 Если что-то пошло не так

### Ошибка при деплое:
```bash
# Очистите кэш gh-pages
npx gh-pages-clean

# Попробуйте заново
npm run deploy
```

### Белый экран:
1. Откройте консоль (F12)
2. Проверьте ошибки
3. Убедитесь, что `base` путь правильный в `vite.config.ts`

### 404 ошибка:
- Подождите 5-10 минут после деплоя
- Проверьте, что ветка `gh-pages` выбрана в настройках Pages

---

**Готово! Ваше приложение NeuroGen Studio в интернете!** 🎉
