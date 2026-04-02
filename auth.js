/**
 * NeuroGen - Universal Auth Guard
 * Этот скрипт защищает frontend-приложение от несанкционированного доступа.
 * Интеграция с Yandex Database API Gateway
 */

(function () {
  // === НАСТРОЙКИ ===
  const API_URL = "https://d5dsbah1d4ju0glmp9d0.3zvepvee.apigw.yandexcloud.net";
  const APP_ID = "neurogen-studio";

  // Поддерживаемые AI провайдеры
  const SUPPORTED_PROVIDERS = ["gemini", "openrouter", "routerai"];

  const loader = null;

  // Ждём готовности DOM
  const initLoader = () => {
    if (document.body) {
      if (loader) document.body.appendChild(loader);
      runAuth();
    } else {
      requestAnimationFrame(initLoader);
    }
  };

  initLoader();

  // === ЗАПУСК АВТОРИЗАЦИИ ===
  async function runAuth() {
    // 1. Проверяем URL на наличие токена
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get("token");

    if (token) {
      localStorage.setItem("ng_token", token);
      localStorage.setItem("isAuthenticated", "true");

      // Сохраняем данные пользователя
      try {
        const response = await fetch(`${API_URL}/?action=validate-app-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (data.success && data.user) {
          localStorage.setItem("ng_user", JSON.stringify(data.user));
        }
      } catch (e) {
        console.error("Failed to fetch user data:", e);
      }

      window.history.replaceState({}, document.title, window.location.pathname);
      unlockApp();
      return;
    }

    // 2. Проверяем сохранённый токен
    token = localStorage.getItem("ng_token");
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (token && isAuthenticated === "true") {
      const isValid = await verifyToken(token);
      if (isValid) {
        unlockApp();
        return;
      } else {
        // Токен невалиден - очищаем
        localStorage.removeItem("ng_token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("ng_user");
      }
    }

    // 3. Проверяем, есть ли API ключи (для локального использования без авторизации)
    const hasGeminiKey = localStorage.getItem("neurogen-gemini-key");
    const hasOpenRouterKey = localStorage.getItem("neurogen-openrouter-key");
    const hasRouterAiKey = localStorage.getItem("neurogen-routerai-key");

    if (hasGeminiKey || hasOpenRouterKey || hasRouterAiKey) {
      console.log("[NeuroGen Auth] Local API keys detected, allowing access");
      localStorage.setItem("isAuthenticated", "true");
      unlockApp();
      return;
    }

    // 4. Если ничего нет — показываем экран входа
    showLoginScreen();
  }

  // === ФУНКЦИИ ВАЛИДАЦИИ ===

  async function verifyToken(jwtToken) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(`${API_URL}/?action=validate-app-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: jwtToken }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (data.success && data.user) {
        localStorage.setItem("ng_user", JSON.stringify(data.user));

        // Проверяем доступ к приложению
        if (data.user.apps && data.user.apps.includes(APP_ID)) {
          return true;
        }

        // Если есть PRO статус - тоже даём доступ
        if (data.user.isPro) {
          return true;
        }
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.error("Token validation error:", e);
    }
    return false;
  }

  async function verifyPin(userId, pin) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(`${API_URL}/?action=validate-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem("ng_token", data.token);
        localStorage.setItem("isAuthenticated", "true");

        // Сохраняем данные пользователя
        if (data.user) {
          localStorage.setItem("ng_user", JSON.stringify(data.user));
        }
      }

      return data.success;
    } catch (e) {
      clearTimeout(timeoutId);
      console.error("PIN validation error:", e);
      return false;
    }
  }

  // === УПРАВЛЕНИЕ API КЛЮЧАМИ ===

  function showApiKeySetup() {
    if (typeof window.ng_showLogin === "function") {
      window.ng_showLogin();
    } else {
      showLoginScreen();
    }
  }

  // === UI ФУНКЦИИ ===

  function unlockApp() {
    if (loader && loader.parentNode) {
      loader.remove();
    }
    console.log(`[NeuroGen Auth] Access Granted to ${APP_ID}`);

    // Переключаем с лендинга на приложение
    const landingContainer = document.getElementById("landing-container");
    const rootContainer = document.getElementById("root");

    if (landingContainer) landingContainer.style.display = "none";
    if (rootContainer) rootContainer.style.display = "block";

    // Сообщаем React приложению об успешной авторизации
    window.dispatchEvent(new CustomEvent("neurogen-auth-success"));
  }

  function showLoginScreen() {
    // Удаляем лоадер если есть
    if (loader && loader.parentNode) {
      loader.remove();
    }

    const overlay = document.createElement("div");
    overlay.innerHTML = `
      <div style="position: fixed; inset: 0; background: #050505; display: flex; align-items: center; justify-content: center; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); padding: 40px; border-radius: 24px; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <div style="font-size: 40px; margin-bottom: 20px;">🔐</div>
          <h2 style="color: #fff; font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">Доступ к NeuroGen Studio</h2>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 30px; line-height: 1.5;">Войдите с помощью PIN-кода или настройте API ключи для локального использования</p>

          <!-- Вкладки -->
          <div style="display: flex; gap: 8px; margin-bottom: 24px;">
            <button id="ng-tab-pin" style="flex: 1; padding: 10px; background: linear-gradient(to right, #A855F7, #06B6D4); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer;">PIN-код</button>
            <button id="ng-tab-api" style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #9ca3af; font-weight: 600; cursor: pointer;">API ключи</button>
          </div>

          <!-- Форма PIN -->
          <div id="ng-pin-form">
            <input type="text" id="ng-userid" placeholder="Telegram ID (цифры)" style="width: 100%; padding: 14px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; margin-bottom: 15px; outline: none; box-sizing: border-box; font-size: 16px;">

            <input type="password" id="ng-pin" placeholder="PIN-код (Например: NG-XXXXXX)" style="width: 100%; padding: 14px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; margin-bottom: 25px; outline: none; box-sizing: border-box; font-size: 16px;">

            <button id="ng-login-btn" style="width: 100%; padding: 16px; background: linear-gradient(to right, #A855F7, #06B6D4); border: none; border-radius: 12px; color: #fff; font-weight: bold; font-size: 16px; cursor: pointer; transition: opacity 0.2s;">
              ВОЙТИ В СИСТЕМУ
            </button>
          </div>

          <!-- Форма API ключей -->
          <div id="ng-api-form" style="display: none;">
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 15px; text-align: left;">Настройте хотя бы один API ключ для работы с AI моделями:</p>
            
            <input type="password" id="ng-gemini-key" placeholder="Google Gemini API Key" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; margin-bottom: 10px; outline: none; box-sizing: border-box; font-size: 14px;">

            <input type="password" id="ng-openrouter-key" placeholder="OpenRouter API Key" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; margin-bottom: 10px; outline: none; box-sizing: border-box; font-size: 14px;">

            <input type="password" id="ng-routerai-key" placeholder="RouterAI API Key" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; margin-bottom: 20px; outline: none; box-sizing: border-box; font-size: 14px;">

            <button id="ng-save-api-btn" style="width: 100%; padding: 16px; background: linear-gradient(to right, #10B981, #06B6D4); border: none; border-radius: 12px; color: #fff; font-weight: bold; font-size: 16px; cursor: pointer; transition: opacity 0.2s;">
              СОХРАНИТЬ И ПРОДОЛЖИТЬ
            </button>
          </div>

          <p id="ng-error-msg" style="color: #ef4444; font-size: 13px; margin-top: 15px; display: none;">Неверный ID или PIN-код</p>
          
          <p style="color: #6b7280; font-size: 11px; margin-top: 20px;">
            Получите Gemini ключ на <a href="https://aistudio.google.com/apikey" target="_blank" style="color: #A855F7;">aistudio.google.com</a> • 
            OpenRouter на <a href="https://openrouter.ai" target="_blank" style="color: #A855F7;">openrouter.ai</a> • 
            RouterAI на <a href="https://routerai.ai" target="_blank" style="color: #A855F7;">routerai.ai</a>
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    window.ng_login_overlay = overlay;

    // Переключение вкладок
    const tabPin = document.getElementById("ng-tab-pin");
    const tabApi = document.getElementById("ng-tab-api");
    const pinForm = document.getElementById("ng-pin-form");
    const apiForm = document.getElementById("ng-api-form");

    tabPin.addEventListener("click", () => {
      tabPin.style.background = "linear-gradient(to right, #A855F7, #06B6D4)";
      tabPin.style.color = "#fff";
      tabApi.style.background = "rgba(255,255,255,0.1)";
      tabApi.style.color = "#9ca3af";
      pinForm.style.display = "block";
      apiForm.style.display = "none";
    });

    tabApi.addEventListener("click", () => {
      tabApi.style.background = "linear-gradient(to right, #10B981, #06B6D4)";
      tabApi.style.color = "#fff";
      tabPin.style.background = "rgba(255,255,255,0.1)";
      tabPin.style.color = "#9ca3af";
      pinForm.style.display = "none";
      apiForm.style.display = "block";
    });

    // Кнопка входа по PIN
    const btn = document.getElementById("ng-login-btn");
    const errorMsg = document.getElementById("ng-error-msg");

    btn.addEventListener("click", async () => {
      const userId = document.getElementById("ng-userid").value.trim();
      const pin = document.getElementById("ng-pin").value.trim();

      if (!userId || !pin) {
        errorMsg.style.display = "block";
        errorMsg.innerText = "Заполни все поля";
        return;
      }

      btn.innerText = "ПРОВЕРКА...";
      btn.style.opacity = "0.7";

      const isPinValid = await verifyPin(userId, pin);

      if (isPinValid) {
        overlay.remove();
        unlockApp();
      } else {
        btn.innerText = "ВОЙТИ В СИСТЕМУ";
        btn.style.opacity = "1";
        errorMsg.style.display = "block";
        errorMsg.innerText = "❌ Ошибка доступа. Проверь ID и PIN.";
      }
    });

    // Кнопка сохранения API ключей
    const saveApiBtn = document.getElementById("ng-save-api-btn");

    saveApiBtn.addEventListener("click", () => {
      const geminiKey = document.getElementById("ng-gemini-key").value.trim();
      const openRouterKey = document
        .getElementById("ng-openrouter-key")
        .value.trim();
      const routerAiKey = document
        .getElementById("ng-routerai-key")
        .value.trim();

      if (!geminiKey && !openRouterKey && !routerAiKey) {
        errorMsg.style.display = "block";
        errorMsg.innerText = "Введите хотя бы один API ключ";
        return;
      }

      // Сохраняем ключи в localStorage
      if (geminiKey) {
        localStorage.setItem("neurogen-gemini-key", geminiKey);
      }
      if (openRouterKey) {
        localStorage.setItem("neurogen-openrouter-key", openRouterKey);
      }
      if (routerAiKey) {
        localStorage.setItem("neurogen-routerai-key", routerAiKey);
      }

      overlay.remove();
      unlockApp();
    });
  }

  // Экспортируем функции для React
  window.ng_showLogin = showLoginScreen;
  window.ng_unlockApp = unlockApp;
  window.ng_showApiKeySetup = showApiKeySetup;
})();
