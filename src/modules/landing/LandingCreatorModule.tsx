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
} from "./types";
import {
  DESIGN_STYLE_GROUPS,
  LEAD_MAGNET_FORMATS,
  LANDING_BLOCKS_OPTIONS,
  LEAD_MAGNET_BLOCKS_OPTIONS,
  LEAD_MAGNET_TYPES,
  CONTENT_LENGTH_OPTIONS,
  WRITING_TONE_OPTIONS,
  TARGET_AUDIENCE_OPTIONS,
  IMAGE_ROLE_OPTIONS,
} from "./constants";
import { generateTextContent, generateHtmlLayout } from "./services/aiService";
import { addHistoryItem } from "./services/historyService";
import {
  saveActiveProvider,
  getActiveProvider,
  hasApiKey,
} from "./services/apiKeyService";
import StepIndicator from "./components/StepIndicator";

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
    <div className="max-w-6xl mx-auto">
      <StepIndicator currentStep={step} totalSteps={4} />

      {/* Step 1: Goal Selection */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Что будем создавать?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => {
                setFormData({ ...formData, goal: Goal.LANDING_PAGE });
                setStep(2);
              }}
              className={`group p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-left ${
                formData.goal === Goal.LANDING_PAGE
                  ? "border-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-indigo-300"
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
                  ? "border-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-indigo-300"
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
            {!TARGET_AUDIENCE_OPTIONS.includes(formData.targetAudience) &&
              formData.targetAudience && (
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  placeholder="Введите описание аудитории..."
                  className="w-full mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-indigo-300 outline-none text-slate-900 dark:text-white"
                />
              )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
              Структура
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {blocksOptions.map((block) => (
                <div
                  key={block.id}
                  onClick={() =>
                    !block.required && toggleBlock(String(block.id))
                  }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DESIGN_STYLE_GROUPS.map((group, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm">
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

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <label className="block text-lg font-bold text-slate-900 dark:text-white">
                  Изображения
                </label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Добавьте логотип, фото автора или продукта
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeImages}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      includeImages: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {formData.includeImages && (
              <div className="space-y-4">
                {formData.customImages.map((img, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-1 space-y-2">
                      <select
                        value={img.role}
                        onChange={(e) =>
                          updateImage(index, "role", e.target.value)
                        }
                        className="w-full text-sm p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                      >
                        {IMAGE_ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={img.type}
                        onChange={(e) =>
                          updateImage(
                            index,
                            "type",
                            e.target.value as ImageInputType,
                          )
                        }
                        className="w-full text-sm p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                      >
                        <option value={ImageInputType.URL}>
                          🔗 Ссылка URL
                        </option>
                        <option value={ImageInputType.FILE}>
                          📁 Загрузить файл
                        </option>
                        <option value={ImageInputType.PROMPT}>
                          🎨 AI Генерация
                        </option>
                      </select>
                    </div>
                    <div className="flex-[2]">
                      {img.type === ImageInputType.URL && (
                        <input
                          type="text"
                          value={img.url}
                          onChange={(e) =>
                            updateImage(index, "url", e.target.value)
                          }
                          placeholder="https://example.com/image.png"
                          className="w-full p-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                        />
                      )}
                      {img.type === ImageInputType.PROMPT && (
                        <input
                          type="text"
                          value={img.prompt || ""}
                          onChange={(e) =>
                            updateImage(index, "prompt", e.target.value)
                          }
                          placeholder="Опишите, что нужно сгенерировать..."
                          className="w-full p-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                        />
                      )}
                      {img.type === ImageInputType.FILE && (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, index)}
                          className="w-full text-sm"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  onClick={addImage}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors font-medium"
                >
                  + Добавить изображение
                </button>
              </div>
            )}
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
                  <span className="animate-spin">⏳</span>
                  <span>{loadingMessage}</span>
                </>
              ) : (
                "✨ Сгенерировать"
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
                  ← Назад к настройкам
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  📥 Скачать HTML
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
    </div>
  );
}
