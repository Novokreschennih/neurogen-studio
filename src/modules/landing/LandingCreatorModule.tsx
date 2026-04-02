import React, { useState } from "react";
import {
  Goal,
  FormData as LandingFormData,
  LeadMagnetType,
  ContentLength,
  WritingTone,
  CustomImage,
  ImageInputType,
  ImageRole,
  AIModel,
  ApiProvider,
  HistoryItem,
} from "./types";
import {
  DESIGN_STYLE_GROUPS,
  LANDING_BLOCKS_OPTIONS,
  LEAD_MAGNET_BLOCKS_OPTIONS,
  TARGET_AUDIENCE_OPTIONS,
  IMAGE_ROLE_OPTIONS,
} from "./constants";
import { generateTextContent, generateHtmlLayout } from "./services/aiService";
import { addHistoryItem, getHistory } from "./services/historyService";
import StepIndicator from "./components/StepIndicator";
import HistoryModal from "./components/HistoryModal";
import LegalModal from "./components/LegalModal";
import { SettingsModal } from "./components/SettingsModal";
import {
  HistoryIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  DownloadIcon,
  BotIcon,
  LoadingSpinner,
} from "./components/icons";

const DEFAULT_FORM_DATA: LandingFormData = {
  goal: null,
  ideaDescription: "",
  targetAudience: "",
  leadMagnetType: LeadMagnetType.GUIDE,
  contentLength: ContentLength.MEDIUM,
  writingTone: WritingTone.PROFESSIONAL,
  includeImages: false,
  customImages: [],
  leadMagnetFormat: null,
  designStyle: null,
  provider: "gemini",
  aiModel: AIModel.GEMINI_FLASH,
  landingBlocks: ["hero", "painPoints", "solution", "features", "finalCta"],
  leadMagnetBlocks: [
    "title",
    "introduction",
    "chapters",
    "keyTakeaways",
    "cta",
  ],
};

export function LandingCreatorModule() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LandingFormData>(DEFAULT_FORM_DATA);
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const isLanding = formData.goal === Goal.LANDING_PAGE;
  const blocksOptions = isLanding
    ? LANDING_BLOCKS_OPTIONS
    : LEAD_MAGNET_BLOCKS_OPTIONS;
  const currentBlocks = isLanding
    ? formData.landingBlocks
    : formData.leadMagnetBlocks;

  const toggleBlock = (blockId: string) => {
    let newBlocks = [...currentBlocks];
    if (newBlocks.includes(blockId as any)) {
      newBlocks = newBlocks.filter((b) => b !== blockId);
    } else {
      newBlocks.push(blockId as any);
    }
    setFormData({
      ...formData,
      [isLanding ? "landingBlocks" : "leadMagnetBlocks"]: newBlocks,
    });
  };

  const handleGenerate = async () => {
    if (!formData.ideaDescription.trim()) {
      setError("Пожалуйста, опишите вашу идею");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingMessage("Генерируем контент...");

    try {
      const textContent = await generateTextContent(formData);
      setLoadingMessage("Создаём дизайн...");
      const html = await generateHtmlLayout(textContent, formData);
      setGeneratedHtml(html);

      addHistoryItem({
        formData,
        generatedContent: html,
        chatHistory: [],
      });

      setStep(4);
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при генерации");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (item: HistoryItem) => {
    setFormData(item.formData);
    setGeneratedHtml(item.generatedContent);
    setIsHistoryOpen(false);
    setStep(4);
  };

  const addImage = () => {
    const newImage: CustomImage = {
      url: "",
      role: "general",
      type: ImageInputType.URL,
    };
    setFormData({
      ...formData,
      customImages: [...formData.customImages, newImage],
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      customImages: formData.customImages.filter((_, i) => i !== index),
    });
  };

  const updateImage = (index: number, field: keyof CustomImage, value: any) => {
    const newImages = [...formData.customImages];
    newImages[index] = { ...newImages[index], [field]: value };
    if (field === "type") {
      newImages[index].url = "";
      newImages[index].prompt = "";
    }
    setFormData({ ...formData, customImages: newImages });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateImage(index, "url", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <BotIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Конструктор лендингов
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              AI-powered landing page builder
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="История"
          >
            <HistoryIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Настройки"
          >
            <SettingsIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Тема"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <MoonIcon className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <button
            onClick={() => setIsLegalOpen(true)}
            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Правовая информация
          </button>
        </div>
      </div>

      <StepIndicator currentStep={step} totalSteps={4} />

      {/* Step 1: Goal Selection */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Что будем создавать?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
              onClick={() => {
                setFormData({ ...formData, goal: Goal.LANDING_PAGE });
                setStep(2);
              }}
              className={`group p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-left ${
                formData.goal === Goal.LANDING_PAGE
                  ? "border-cyan-500 ring-4 ring-cyan-100 dark:ring-cyan-900/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-cyan-300"
              } bg-white dark:bg-slate-800`}
            >
              <div className="text-6xl mb-6">🌐</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Лендинг пейдж
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Продающая страница для товара или услуги
              </p>
            </button>

            <button
              onClick={() => {
                setFormData({ ...formData, goal: Goal.LEAD_MAGNET });
                setStep(2);
              }}
              className={`group p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-left ${
                formData.goal === Goal.LEAD_MAGNET
                  ? "border-purple-500 ring-4 ring-purple-100 dark:ring-purple-900/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-purple-300"
              } bg-white dark:bg-slate-800`}
            >
              <div className="text-6xl mb-6">🧲</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Лид-магнит
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Полезный материал (PDF, чек-лист) за подписку
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Info & Structure */}
      {step === 2 && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
              Опишите вашу идею или продукт
            </label>
            <textarea
              value={formData.ideaDescription}
              onChange={(e) =>
                setFormData({ ...formData, ideaDescription: e.target.value })
              }
              placeholder="Например: Курс по йоге для начинающих. Основные боли - нет времени, боли в спине. Решение - 15 минут в день..."
              className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white transition-all resize-none"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
              Целевая аудитория
            </label>
            <select
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData({ ...formData, targetAudience: e.target.value })
              }
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
            >
              <option value="">Выберите или введите вручную</option>
              {TARGET_AUDIENCE_OPTIONS.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
              Структура
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {blocksOptions.map((block) => (
                <div
                  key={block.id}
                  onClick={() => !block.required && toggleBlock(block.id)}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border select-none ${
                    currentBlocks.includes(block.id as any)
                      ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700"
                      : "bg-slate-50 dark:bg-slate-900 border-transparent opacity-60 hover:opacity-100"
                  } ${block.required ? "cursor-not-allowed" : ""}`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 transition-colors ${
                      currentBlocks.includes(block.id as any)
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {currentBlocks.includes(block.id as any) && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {block.label}
                  </span>
                  {block.required && (
                    <span className="ml-auto text-xs text-slate-500">
                      обяз.
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Назад
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.ideaDescription.trim()}
              className="px-10 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all"
            >
              Далее
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Style & Generate */}
      {step === 3 && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
              Стиль дизайна
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {DESIGN_STYLE_GROUPS.map((group, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm sticky top-0 bg-white dark:bg-slate-800 py-2">
                    {group.label}
                  </h4>
                  <div className="space-y-2">
                    {group.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setFormData({ ...formData, designStyle: opt.value })
                        }
                        className={`w-full p-3 rounded-lg text-left transition-all border ${
                          formData.designStyle === opt.value
                            ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                        }`}
                      >
                        <div className="font-medium text-slate-900 dark:text-white text-sm">
                          {opt.label}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {opt.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Назад
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !formData.designStyle}
              className="px-10 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="w-5 h-5" />
                  <span>{loadingMessage}</span>
                </>
              ) : (
                <>
                  <BotIcon className="w-5 h-5" />
                  <span>Сгенерировать</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 4 && generatedHtml && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Готово!
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  ← Назад
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Скачать HTML
                </button>
              </div>
            </div>
            <iframe
              srcDoc={generatedHtml}
              className="w-full h-[600px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white"
              title="Preview"
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onRestore={handleRestore}
      />
      <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
