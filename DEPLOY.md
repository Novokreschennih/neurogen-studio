# 🚀 Деплой NeuroGen Studio на GitHub Pages

Пошаговая инструкция по публикации приложения на GitHub Pages.

---

## 📋 Подготовка

### 1. Создайте репозиторий на GitHub

```bash
# Если ещё не создали репозиторий
# Перейдите на https://github.com/new
# Создайте новый публичный или приватный репозиторий
```

**Название репозитория:** например, `neurogen-studio`

---

## 🔧 Настройка проекта

### 2. Обновите `package.json`

Добавьте поле `homepage` и скрипт `deploy`:

```json
{
  "name": "neurogen-studio",
  "homepage": "https://ваш-username.github.io/neurogen-studio",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && npx gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.1.0"
  }
}
```

### 3. Установите зависимости

```bash
cd /home/yaronov/Проекты/проекты/landing-leadmagnet-deploy/neurogen-studio
npm install --save-dev gh-pages
```

---

## 📦 Сборка и деплой

### 4. Инициализируйте Git (если ещё не инициализирован)

```bash
git init
git add .
git commit -m "Initial commit - NeuroGen Studio"
```

### 5. Добавьте удалённый репозиторий

```bash
# Замените YOUR_USERNAME и YOUR_REPO на свои
git remote add origin https://github.com/YOUR_USERNAME/neurogen-studio.git
```

### 6. Задеплойте на GitHub Pages

```bash
# Запуск деплоя
npm run deploy
```

**Что делает эта команда:**
1. Создаёт оптимизированную сборку в папке `dist/`
2. Публикует содержимое `dist/` в ветку `gh-pages`
3. Отправляет ветку `gh-pages` на GitHub

---

## ⚙️ Настройка GitHub Pages

### 7. Включите GitHub Pages

1. Перейдите в репозиторий на GitHub
2. Откройте **Settings** → **Pages**
3. В разделе **Source** выберите:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
4. Нажмите **Save**

### 8. Подождите развёртывания

Через 1-5 минут ваше приложение будет доступно по адресу:
```
https://YOUR_USERNAME.github.io/neurogen-studio/
```

---

## 🔄 Обновление приложения

Для публикации изменений:

```bash
# Внесите изменения в код
git add .
git commit -m "Описание изменений"

# Задеплойте заново
npm run deploy
```

---

## 🎯 Альтернативный способ: Ручной деплой

Если не хотите использовать `gh-pages`:

### 1. Соберите проект

```bash
npm run build
```

### 2. Создайте ветку `gh-pages`

```bash
git checkout --orphan gh-pages
git reset --hard
```

### 3. Скопируйте файлы из `dist/`

```bash
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
```

### 4. Отправьте на GitHub

```bash
git push origin gh-pages --force
```

### 5. Вернитесь в основную ветку

```bash
git checkout main
```

---

## ⚠️ Важные замечания

### 1. Базовый путь (Base Path)

Если приложение открывается не по корню домена, обновите `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/neurogen-studio/', // Добавьте имя репозитория
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 2. Роутинг

GitHub Pages не поддерживает client-side роутинг. Для одностраничного приложения (SPA) добавьте `404.html`:

```bash
# После сборки скопируйте index.html в 404.html
cp dist/index.html dist/404.html
```

Или создайте `.htaccess` для Apache:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /neurogen-studio/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /neurogen-studio/index.html [L]
</IfModule>
```

### 3. API ключи

**Важно:** API ключи хранятся в localStorage пользователя и не передаются с кодом. Каждый пользователь должен настроить свои ключи после первого входа.

### 4. CORS

Если используете кастомный домен, убедитесь, что API провайдеры (Gemini, OpenRouter, RouterAI) разрешают запросы с вашего домена.

---

## 🐛 Решение проблем

### Ошибка: "Permission denied (publickey)"

```bash
# Используйте HTTPS вместо SSH
git remote set-url origin https://github.com/YOUR_USERNAME/neurogen-studio.git
```

### Ошибка: "Deploy failed, rejected by server"

```bash
# Проверьте размер репозитория (лимит 1GB)
# Очистите кэш gh-pages
npx gh-pages-clean
```

### Приложение показывает 404

1. Проверьте, что ветка `gh-pages` существует
2. Убедитесь, что в настройках Pages выбрана ветка `gh-pages`
3. Подождите несколько минут (иногда занимает до 10 минут)

### Белый экран после деплоя

1. Откройте консоль браузера (F12)
2. Проверьте ошибки
3. Убедитесь, что `base` путь в `vite.config.ts` правильный
4. Проверьте, что все файлы загрузились (вкладка Network)

---

## 📊 Структура после деплоя

```
neurogen-studio/
├── main/              # Основная ветка с исходным кодом
├── gh-pages/          # Ветка для деплоя (содержимое dist/)
├── dist/              # Папка сборки (не коммитится в main)
│   ├── index.html
│   ├── auth.js
│   ├── landing.html
│   └── assets/
├── src/
├── public/
└── package.json
```

---

## 🎯 Деплой на кастомный домен

### 1. Купите домен

Например, на Namecheap, GoDaddy, Reg.ru

### 2. Настройте DNS

Добавьте CNAME запись:
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

### 3. Добавьте домен в GitHub

1. Settings → Pages → Custom domain
2. Введите ваш домен
3. Нажмите Save

### 4. Создайте файл `public/CNAME`

```
yourdomain.com
```

### 5. Задеплойте заново

```bash
npm run deploy
```

---

## 📈 CI/CD с GitHub Actions

Для автоматического деплоя при пуше:

### Создайте `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Теперь при каждом пуше в ветку `main` приложение будет автоматически деплоиться!

---

## ✅ Чек-лист перед деплоем

- [ ] Собрал проект (`npm run build`)
- [ ] Проверил сборку локально (`npm run preview`)
- [ ] Обновил `homepage` в `package.json`
- [ ] Добавил `base` путь в `vite.config.ts` (если нужно)
- [ ] Создал репозиторий на GitHub
- [ ] Добавил remote origin
- [ ] Задеплоил через `npm run deploy`
- [ ] Включил GitHub Pages в настройках
- [ ] Проверил работу приложения

---

## 📚 Дополнительные ресурсы

- [Официальная документация GitHub Pages](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [gh-pages npm package](https://www.npmjs.com/package/gh-pages)

---

## 🎉 Готово!

Ваше приложение NeuroGen Studio теперь доступно всему миру! 🚀

**Следующие шаги:**
1. Поделитесь ссылкой с пользователями
2. Настройте Google Analytics для отслеживания
3. Добавьте метатеги для SEO
4. Рассмотрите возможность использования кастомного домена
