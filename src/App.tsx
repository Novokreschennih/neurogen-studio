import React, { useState, useEffect } from "react";
import { useGlobalSettings } from "./hooks/useGlobalSettings";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { GlobalSettingsModal } from "./components/GlobalSettingsModal";
import { LandingCreatorModule } from "./modules/landing/LandingCreatorModule";
import { RedesignModule } from "./modules/redesign/RedesignModule";
import { DeployModule } from "./modules/deploy/DeployModule";
import { AUTH_STORAGE_KEY, API_GATEWAY_URL } from "./constants";
import { LandingPage } from "./components/LandingPage";
import PinValidation from "./components/PinValidation";

type Module = "dashboard" | "landing" | "redesign" | "deploy";
type View = "landing" | "pin" | "app";

function App() {
  const [authData, setAuthData] = React.useLocalStorage<any>(
    AUTH_STORAGE_KEY,
    null,
  );
  const { settings, loadSettings } = useGlobalSettings();

  const [currentModule, setCurrentModule] = useState<Module>("dashboard");
  const [view, setView] = useState<View>("landing");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCheckingYdbAuth, setIsCheckingYdbAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Проверяем YDB auth при загрузке
  useEffect(() => {
    const checkYdbAuth = () => {
      const ngToken = localStorage.getItem("ng_token");
      const isAuth = localStorage.getItem("isAuthenticated");

      if (ngToken && isAuth === "true") {
        setAuthData({
          userId: "ydb-user",
          isPro: true,
          token: ngToken,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        setView("app");
      } else if (authData && authData.expiresAt > Date.now()) {
        setView("app");
      } else {
        // Остаёмся на лендинге (он в index.html)
        setView("landing");
      }
      setIsCheckingYdbAuth(false);
    };

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

  // Применяем тему
  useEffect(() => {
    const isDark =
      settings.darkMode ||
      localStorage.getItem("neurogen-dark-mode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const handleToggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("neurogen-dark-mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("neurogen-dark-mode", "false");
    }
  };

  const handlePinSuccess = (data: any) => {
    setAuthData({
      userId: data.userId,
      isPro: data.isPro,
      token: data.token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
  };

  const handleLogout = () => {
    setAuthData(null);
    localStorage.removeItem("ng_token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setView("landing");
    setCurrentModule("dashboard");
  };

  const handleSettingsSave = () => {
    loadSettings();
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
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <Navigation
          currentModule={currentModule}
          onModuleChange={setCurrentModule}
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          theme={darkMode ? "dark" : "light"}
          onToggleTheme={handleToggleTheme}
        />

        <main className="pt-16 pb-8 px-4 md:px-8 max-w-7xl mx-auto">
          {currentModule === "dashboard" && (
            <Dashboard onModuleSelect={setCurrentModule} />
          )}
          {currentModule === "landing" && <LandingCreatorModule />}
          {currentModule === "redesign" && <RedesignModule />}
          {currentModule === "deploy" && <DeployModule />}
        </main>

        <GlobalSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSettingsSave}
        />
      </div>
    </div>
  );
}

export default App;
