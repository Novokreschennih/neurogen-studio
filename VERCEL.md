# 🚀 Деплой NeuroGen Studio на Vercel

## Быстрый старт

### 1. Установите Vercel CLI

```bash
npm install -g vercel
```

### 2. Войдите в Vercel

```bash
vercel login
```

### 3. Задеплойте

```bash
vercel --prod
```

**Готово!** Приложение доступно по адресу: `https://your-project.vercel.app`

---

## 📝 Пошаговая инструкция

### Вариант 1: Через CLI (рекомендуется)

```bash
# 1. Установите CLI
npm install -g vercel

# 2. Войдите в аккаунт
vercel login

# 3. Задеплойте
cd /home/yaronov/Проекты/проекты/landing-leadmagnet-deploy/neurogen-studio
vercel --prod
```

### Вариант 2: Через GitHub + Vercel UI

1. **Запушите код на GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

2. **Подключите репозиторий в Vercel**
   - Откройте https://vercel.com/new
   - Выберите "Import Git Repository"
   - Выберите ваш репозиторий `neurogen-studio`
   - Нажмите "Deploy"

3. **Готово!**
   - Vercel автоматически соберёт и задеплоит приложение
   - При каждом пуше в `master` будет автоматический деплой

---

## ⚙️ Настройки Vercel

### Project Settings

После импорта репозитория:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Development Command** | `npm run dev` |

### Environment Variables

Если нужны (опционально):

```
VITE_API_URL=https://your-api.com
```

---

## 🔄 Обновление приложения

### Автоматически (при пуше в GitHub)

```bash
git add .
git commit -m "Описание изменений"
git push origin master
```

Vercel автоматически задеплоит изменения через 1-2 минуты.

### Вручную (через CLI)

```bash
vercel --prod
```

---

## 🎯 Преимущества Vercel

- ✅ Автоматический HTTPS
- ✅ Глобальная CDN (быстрая загрузка по всему миру)
- ✅ Автоматические деплои при пуше
- ✅ Preview деплои для каждого PR
- ✅ Бесплатный тариф для личных проектов
- ✅ Отличная поддержка Vite/React

---

## 🌐 Кастомный домен

### 1. Купите домен

Например, на Namecheap, Reg.ru, GoDaddy

### 2. Добавьте домен в Vercel

1. Откройте проект в Vercel Dashboard
2. Settings → Domains
3. Добавьте ваш домен

### 3. Настройте DNS

Vercel покажет DNS записи для добавления:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 Тарифы Vercel

### Hobby (Бесплатно)
- ✅ Неограниченные деплои
- ✅ 100GB bandwidth / месяц
- ✅ Автоматический HTTPS
- ✅ CDN

### Pro ($20/месяц)
- Всё из Hobby +
- ✅ 1TB bandwidth / месяц
- ✅ Analytics
- ✅ Приоритетная поддержка

---

## 🐛 Решение проблем

### Ошибка: "Build failed"

Проверьте логи в Vercel Dashboard:
1. Откройте проект
2. Deployments → Выберите деплой → Logs
3. Найдите ошибку сборки

### Ошибка: "404 Not Found"

Убедитесь, что `vercel.json` содержит правильные настройки:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Ошибка: "Rewrite не работает"

Проверьте `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📁 Структура проекта для Vercel

```
neurogen-studio/
├── vercel.json           # Конфигурация Vercel ✅
├── .vercelignore         # Игнор файлы ✅
├── package.json          # Скрипты ✅
├── vite.config.ts        # Vite конфиг ✅
├── src/                  # Исходный код
├── public/               # Статические файлы
└── dist/                 # Сборка (создаётся при build)
```

---

## ✅ Чек-лист перед деплоем

- [ ] Установлен Vercel CLI (`npm install -g vercel`)
- [ ] Выполнен вход (`vercel login`)
- [ ] Есть `vercel.json` в корне проекта
- [ ] Сборка работает локально (`npm run build`)
- [ ] Запушили изменения на GitHub (для авто-деплоя)

---

## 🔗 Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Готово! Ваше приложение на Vercel!** 🎉
