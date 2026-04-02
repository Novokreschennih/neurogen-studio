import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<
    "gemini" | "openrouter" | "routerai"
  >("gemini");

  // Используем те же ключи что и в auth.js
  const [geminiKey, setGeminiKey] = useState(
    () => localStorage.getItem("neurogen-gemini-key") || "",
  );
  const [openRouterKey, setOpenRouterKey] = useState(
    () => localStorage.getItem("neurogen-openrouter-key") || "",
  );
  const [routerAiKey, setRouterAiKey] = useState(
    () => localStorage.getItem("neurogen-routerai-key") || "",
  );
  const [provider, setProvider] = useLocalStorage(
    "neurogen-provider",
    "gemini",
  );
  const [openRouterModel, setOpenRouterModel] = useLocalStorage(
    "neurogen-openrouter-model",
    "google/gemini-2.0-flash-001",
  );
  const [routerAiModel, setRouterAiModel] = useLocalStorage(
    "neurogen-routerai-model",
    "openai/gpt-4o",
  );

  const handleSave = () => {
    // Сохраняем в localStorage (совместимо с auth.js)
    if (geminiKey) localStorage.setItem("neurogen-gemini-key", geminiKey);
    if (openRouterKey)
      localStorage.setItem("neurogen-openrouter-key", openRouterKey);
    if (routerAiKey) localStorage.setItem("neurogen-routerai-key", routerAiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Настройки API
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <TabButton
            active={activeTab === "gemini"}
            onClick={() => setActiveTab("gemini")}
            label="Google Gemini"
            icon="💎"
          />
          <TabButton
            active={activeTab === "openrouter"}
            onClick={() => setActiveTab("openrouter")}
            label="OpenRouter"
            icon="🌐"
          />
          <TabButton
            active={activeTab === "routerai"}
            onClick={() => setActiveTab("routerai")}
            label="RouterAI"
            icon="🔄"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Provider Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Активный провайдер
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openrouter">OpenRouter</option>
              <option value="routerai">RouterAI</option>
            </select>
          </div>

          {/* Gemini Settings */}
          {activeTab === "gemini" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  API ключ Google Gemini
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Введите ваш API ключ"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Получите ключ в{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          )}

          {/* OpenRouter Settings */}
          {activeTab === "openrouter" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  API ключ OpenRouter
                </label>
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="Введите ваш API ключ"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Модель
                </label>
                <input
                  type="text"
                  value={openRouterModel}
                  onChange={(e) => setOpenRouterModel(e.target.value)}
                  placeholder="например: google/gemini-2.0-flash-001"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Получите ключ на{" "}
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  openrouter.ai
                </a>
              </p>
            </div>
          )}

          {/* RouterAI Settings */}
          {activeTab === "routerai" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  API ключ RouterAI
                </label>
                <input
                  type="password"
                  value={routerAiKey}
                  onChange={(e) => setRouterAiKey(e.target.value)}
                  placeholder="Введите ваш API ключ"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Модель
                </label>
                <input
                  type="text"
                  value={routerAiModel}
                  onChange={(e) => setRouterAiModel(e.target.value)}
                  placeholder="например: openai/gpt-4o"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Получите ключ на{" "}
                <a
                  href="https://routerai.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  routerai.ai
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

function TabButton({ active, onClick, label, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 font-medium transition-colors
        ${
          active
            ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
