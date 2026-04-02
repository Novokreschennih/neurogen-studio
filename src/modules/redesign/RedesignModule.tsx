import React, { useState } from "react";
import { DESIGN_STYLE_CONFIG } from "../constants";
import {
  generateDesign,
  applyDesign,
  refineDesign,
} from "./services/aiService";
import { getActiveProvider, hasApiKey } from "./services/apiKeyService";
import { PreviewCard } from "./components/PreviewCard";
import { StyleSelector } from "./components/StyleSelector";
import { ModelSelector } from "./components/ModelSelector";
import { CodeInput } from "./components/CodeInput";
import type { ApiProvider, DesignVariant } from "./types";

export function RedesignModule() {
  const [mode, setMode] = useState<"redesign" | "apply">("redesign");
  const [inputHtml, setInputHtml] = useState("");
  const [referenceHtml, setReferenceHtml] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("aiChoice");
  const [provider, setProvider] = useState<ApiProvider>("gemini");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [generatedDesigns, setGeneratedDesigns] = useState<DesignVariant[]>([]);
  const [appliedResult, setAppliedResult] = useState<DesignVariant | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [fullScreenVariant, setFullScreenVariant] =
    useState<DesignVariant | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleGenerate = async () => {
    if (!inputHtml.trim()) {
      setError("Пожалуйста, введите HTML или текст для редизайна");
      return;
    }

    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен. Добавьте его в настройках.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateDesign(
        provider,
        inputHtml,
        selectedStyle,
        model,
      );
      setGeneratedDesigns([result]);
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при генерации дизайна");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!referenceHtml.trim() || !inputHtml.trim()) {
      setError("Пожалуйста, введите оба HTML документа");
      return;
    }

    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await applyDesign(
        provider,
        referenceHtml,
        inputHtml,
        model,
      );
      setAppliedResult(result);
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при применении дизайна");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!generatedDesigns[0] || !refineInstruction.trim()) {
      setError("Введите инструкцию для улучшения");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await refineDesign(
        provider,
        generatedDesigns[0].html,
        refineInstruction,
        model,
      );
      setGeneratedDesigns([result, ...generatedDesigns]);
      setRefineInstruction("");
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при улучшении");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (variant: DesignVariant) => {
    const blob = new Blob([variant.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${variant.name.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUseAsReference = (variant: DesignVariant) => {
    setReferenceHtml(variant.html);
    setMode("apply");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          🎨 Редизайн сайта
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Загрузите HTML и получите современный дизайн с сохранением контента
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div
          className={`lg:col-span-1 ${sidebarCollapsed ? "lg:col-span-0" : ""}`}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Настройки
              </h3>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Mode Selection */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode("redesign")}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                  mode === "redesign"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                Редизайн
              </button>
              <button
                onClick={() => setMode("apply")}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                  mode === "apply"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                Применить
              </button>
            </div>

            {/* Provider & Model */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Провайдер
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as ApiProvider)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="routerai">RouterAI</option>
                </select>
              </div>

              <ModelSelector
                provider={provider}
                model={model}
                onChange={setModel}
              />
              <StyleSelector
                value={selectedStyle}
                onChange={setSelectedStyle}
              />
            </div>

            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Input Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            {mode === "redesign" ? (
              <CodeInput
                value={inputHtml}
                onChange={setInputHtml}
                label="Введите HTML или текст для редизайна"
                placeholder="<html>...</html> или просто текст..."
                height="h-64"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CodeInput
                  value={referenceHtml}
                  onChange={setReferenceHtml}
                  label="Референс (дизайн)"
                  placeholder="<html>...</html>"
                  height="h-64"
                />
                <CodeInput
                  value={inputHtml}
                  onChange={setInputHtml}
                  label="Цель (контент)"
                  placeholder="<html>...</html>"
                  height="h-64"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={mode === "redesign" ? handleGenerate : handleApply}
                disabled={isLoading}
                className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Генерация...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>
                      {mode === "redesign" ? "Сгенерировать" : "Применить"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {generatedDesigns.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Результаты ({generatedDesigns.length})
                </h3>

                {/* Refine Input */}
                <div className="flex gap-2 flex-1 max-w-xl ml-8">
                  <input
                    type="text"
                    value={refineInstruction}
                    onChange={(e) => setRefineInstruction(e.target.value)}
                    placeholder="Например: сделай кнопки больше, измени цвет фона..."
                    className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                  <button
                    onClick={handleRefine}
                    disabled={isLoading || !refineInstruction.trim()}
                    className="px-6 py-3 rounded-xl font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    Улучшить
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {generatedDesigns.map((variant, idx) => (
                  <PreviewCard
                    key={variant.id || idx}
                    variant={variant}
                    onViewFullScreen={setFullScreenVariant}
                    onUseAsReference={handleUseAsReference}
                    originalHtml={inputHtml}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Applied Result */}
          {appliedResult && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Применённый дизайн
                </h3>
                <button
                  onClick={() => handleDownload(appliedResult)}
                  className="px-6 py-3 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  📥 Скачать
                </button>
              </div>
              <PreviewCard
                variant={appliedResult}
                onViewFullScreen={setFullScreenVariant}
                onUseAsReference={handleUseAsReference}
                originalHtml={inputHtml}
              />
            </div>
          )}

          {/* Empty State */}
          {generatedDesigns.length === 0 && !appliedResult && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Начните редизайн
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Введите HTML код и выберите стиль дизайна
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Preview */}
      {fullScreenVariant && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {fullScreenVariant.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(fullScreenVariant)}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Скачать
                </button>
                <button
                  onClick={() => setFullScreenVariant(null)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
            <iframe
              srcDoc={fullScreenVariant.html}
              className="flex-1 w-full h-full rounded-b-2xl bg-white"
              title="Full Screen Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
