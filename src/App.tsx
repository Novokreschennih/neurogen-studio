import React, { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTheme } from "./hooks/useTheme";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { SettingsModal } from "./components/SettingsModal";
import { LandingCreatorModule } from "./modules/landing/LandingCreatorModule";
import { RedesignModule } from "./modules/redesign/RedesignModule";
import { DeployModule } from "./modules/deploy/DeployModule";
import { AUTH_STORAGE_KEY, API_GATEWAY_URL } from "./constants";
import { LandingPage } from "./components/LandingPage";
import PinValidation from "./components/PinValidation";

type Module = "dashboard" | "landing" | "redesign" | "deploy";
type View = "landing" | "pin" | "app";

// Интеграция с YDB auth.js
const NG_TOKEN_KEY = "ng_token";
const IS_AUTHENTICATED_KEY = "isAuthenticated";

function App() {
  const [authData, setAuthData] = useLocalStorage<any>(AUTH_STORAGE_KEY, null);
  const { theme, toggleTheme } = useTheme();
  const [currentModule, setCurrentModule] = useState<Module>("dashboard");
  const [view, setView] = useState<View>("landing");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCheckingYdbAuth, setIsCheckingYdbAuth] = useState(true);

  // Проверяем YDB auth при загрузке
  useEffect(() => {
    const checkYdbAuth = () => {
      const ngToken = localStorage.getItem(NG_TOKEN_KEY);
      const isAuth = localStorage.getItem(IS_AUTHENTICATED_KEY);

      if (ngToken && isAuth === "true") {
        // YDB auth успешен - создаём совместимый authData
        setAuthData({
          userId: "ydb-user",
          isPro: true,
          token: ngToken,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        setView("app");

        // Переключаем с лендинга на приложение
        const landingContainer = document.getElementById("landing-container");
        const rootContainer = document.getElementById("root");
        if (landingContainer) landingContainer.style.display = "none";
        if (rootContainer) rootContainer.style.display = "block";
      } else if (authData && authData.expiresAt > Date.now()) {
        setView("app");
      } else {
        // Остаёмся на лендинге
        setView("landing");
      }
      setIsCheckingYdbAuth(false);
    };

    // Ждём немного чтобы auth.js успел отработать
    const timer = setTimeout(checkYdbAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isCheckingYdbAuth) {
      if (authData && authData.expiresAt > Date.now()) {
        setView("app");
      } else {
        setView("landing");
      }
    }
  }, [authData, isCheckingYdbAuth]);

  const handlePinSuccess = (data: any) => {
    setAuthData({
      userId: data.userId,
      isPro: data.isPro,
      token: data.token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
  };

  const handleLogout = () => {
    // Очищаем все токены аутентификации
    setAuthData(null);
    localStorage.removeItem(NG_TOKEN_KEY);
    localStorage.removeItem(IS_AUTHENTICATED_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setView("landing");
    setCurrentModule("dashboard");
  };

  if (view === "landing") {
    return <LandingPage onEnter={() => setView("pin")} />;
  }

  if (view === "pin") {
    return (
      <PinValidation onSuccess={handlePinSuccess} appId="neurogen-studio" />
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <Navigation
          currentModule={currentModule}
          onModuleChange={setCurrentModule}
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="pt-16 pb-8 px-4 md:px-8 max-w-7xl mx-auto">
          {currentModule === "dashboard" && (
            <Dashboard onModuleSelect={setCurrentModule} />
          )}
          {currentModule === "landing" && <LandingCreatorModule />}
          {currentModule === "redesign" && <RedesignModule />}
          {currentModule === "deploy" && <DeployModule />}
        </main>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
