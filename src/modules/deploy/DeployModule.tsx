import React, { useState, useCallback, useEffect } from "react";
import type { HtmlFile, SiteFile, ApiProvider } from "./types";
import {
  analyzeHtmlContent,
  optimizeFileName,
  applyAnalysisFixes,
  generateSEO,
} from "./services/aiService";
import { hasApiKey } from "./services/apiKeyService";
import { FileTree } from "./components/FileTree";
import { HtmlFileCard } from "./components/HtmlFileCard";
import JSZip from "jszip";
import saveAs from "file-saver";

export function DeployModule() {
  const [files, setFiles] = useState<SiteFile[]>([]);
  const [htmlFiles, setHtmlFiles] = useState<HtmlFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [provider, setProvider] = useState<ApiProvider>("gemini");
  const [isLoading, setIsLoading] = useState<{
    analyzing: boolean;
    optimizing: boolean;
    fixing: boolean;
  }>({
    analyzing: false,
    optimizing: false,
    fixing: false,
  });
  const [analysisReports, setAnalysisReports] = useState<
    Record<string, string>
  >({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [fullscreenFile, setFullscreenFile] = useState<HtmlFile | null>(null);

  // Generate preview URLs when files change
  useEffect(() => {
    const generatePreviews = async () => {
      const urls: Record<string, string> = {};
      for (const file of htmlFiles) {
        const blob = new Blob([file.content], { type: "text/html" });
        urls[file.id] = URL.createObjectURL(blob);
      }
      setPreviewUrls(urls);
    };
    generatePreviews();

    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [htmlFiles]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFiles = e.target.files;
      if (!uploadedFiles || uploadedFiles.length === 0) return;

      const filePromises: Promise<SiteFile | null>[] = Array.from(
        uploadedFiles,
      ).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result;
            if (content) {
              const newFile: SiteFile = {
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                path: file.name,
                name: file.name,
                content,
                type: file.type || "text/plain",
                history: [content as string],
                historyIndex: 0,
              };
              resolve(newFile);
            } else {
              resolve(null);
            }
          };
          reader.onerror = () => resolve(null);

          if (
            file.type.startsWith("text/") ||
            file.name.endsWith(".html") ||
            file.name.endsWith(".css") ||
            file.name.endsWith(".js")
          ) {
            reader.readAsText(file);
          } else {
            reader.readAsArrayBuffer(file);
          }
        });
      });

      Promise.all(filePromises).then((newFiles) => {
        const validFiles = newFiles.filter((f): f is SiteFile => f !== null);
        setFiles((prev) => [...prev, ...validFiles]);

        const newHtmlFiles: HtmlFile[] = validFiles
          .filter((f) => f.name.endsWith(".html"))
          .map((f) => ({
            ...f,
            content: f.content as string,
            isMain: htmlFiles.length === 0,
            newFileName: f.name,
            placeholders: [],
            placeholderValues: {},
            linkPlaceholders: {},
            history: [f.content as string],
            historyIndex: 0,
          }));

        setHtmlFiles((prev) => [...prev, ...newHtmlFiles]);
      });
    },
    [htmlFiles.length],
  );

  const handleDeleteFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setHtmlFiles((prev) => prev.filter((f) => f.id !== fileId));
      if (selectedFileId === fileId) setSelectedFileId(null);
    },
    [selectedFileId],
  );

  const handleSelectFile = (fileId: string) => {
    setSelectedFileId(fileId);
  };

  const handleSetMain = (fileId: string) => {
    setHtmlFiles((prev) =>
      prev.map((f) => ({
        ...f,
        isMain: f.id === fileId,
        newFileName: f.id === fileId ? "index.html" : f.newFileName,
      })),
    );
  };

  const handleAnalyze = async (fileId: string) => {
    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен`);
      return;
    }

    setIsLoading((prev) => ({ ...prev, analyzing: true }));
    setError(null);

    try {
      const file = htmlFiles.find((f) => f.id === fileId);
      if (!file) return;

      const report = await analyzeHtmlContent(file.content, provider);
      setAnalysisReports((prev) => ({ ...prev, [fileId]: report }));
      setSelectedFileId(fileId);
    } catch (err: any) {
      setError(err.message || "Ошибка анализа");
    } finally {
      setIsLoading((prev) => ({ ...prev, analyzing: false }));
    }
  };

  const handleOptimizeNames = async () => {
    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен`);
      return;
    }

    setIsLoading((prev) => ({ ...prev, optimizing: true }));
    setError(null);

    try {
      const updatedFiles = await Promise.all(
        htmlFiles.map(async (file) => {
          if (file.isMain) return file;
          const newName = await optimizeFileName(file.content, provider);
          return { ...file, newFileName: `${newName}.html` };
        }),
      );
      setHtmlFiles(updatedFiles);
    } catch (err: any) {
      setError(err.message || "Ошибка оптимизации");
    } finally {
      setIsLoading((prev) => ({ ...prev, optimizing: false }));
    }
  };

  const handleApplyFixes = async () => {
    if (!selectedFileId) return;
    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен`);
      return;
    }

    setIsLoading((prev) => ({ ...prev, fixing: true }));
    setError(null);

    try {
      const file = htmlFiles.find((f) => f.id === selectedFileId);
      if (!file) return;

      const fixedHtml = await applyAnalysisFixes(file.content, provider);

      const updatedFiles = htmlFiles.map((f) =>
        f.id === selectedFileId
          ? {
              ...f,
              content: fixedHtml,
              history: [...(f.history || []), fixedHtml],
              historyIndex: (f.historyIndex || 0) + 1,
            }
          : f,
      );
      setHtmlFiles(updatedFiles);
    } catch (err: any) {
      setError(err.message || "Ошибка применения исправлений");
    } finally {
      setIsLoading((prev) => ({ ...prev, fixing: false }));
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();

    htmlFiles.forEach((file) => {
      zip.file(file.newFileName, file.content);
    });

    files
      .filter((f) => !f.name.endsWith(".html"))
      .forEach((file) => {
        zip.file(file.name, file.content);
      });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "website.zip");
  };

  const selectedFile = htmlFiles.find((f) => f.id === selectedFileId);
  const selectedFileReport = selectedFileId
    ? analysisReports[selectedFileId]
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          🚀 Деплой на GitHub Pages
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Загрузите файлы сайта, оптимизируйте и опубликуйте
        </p>
      </div>

      {/* Settings */}
      <div className="flex justify-center gap-4 mb-6">
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as ApiProvider)}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
        >
          <option value="gemini">Google Gemini</option>
          <option value="openrouter">OpenRouter</option>
          <option value="routerai">RouterAI</option>
        </select>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
          Загрузка файлов
        </label>
        <div className="flex flex-wrap gap-4">
          <input
            type="file"
            multiple
            accept=".html,.css,.js,.md,image/*"
            onChange={handleFileUpload}
            className="flex-1 min-w-[200px] p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
          />
          <button
            onClick={handleOptimizeNames}
            disabled={isLoading.optimizing || htmlFiles.length === 0}
            className="px-6 py-3 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isLoading.optimizing ? "⏳..." : "✨ Оптимизировать имена"}
          </button>
          <button
            onClick={handleDownloadZip}
            disabled={htmlFiles.length === 0}
            className="px-6 py-3 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            📦 Скачать ZIP
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Files Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File Tree */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Файлы ({files.length})
              </h3>
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                <FileTree
                  files={files}
                  selectedFileId={selectedFileId}
                  onSelectFile={handleSelectFile}
                  onDeleteFile={handleDeleteFile}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Selected File Card */}
            {selectedFile && (
              <HtmlFileCard
                file={selectedFile}
                previewUrl={previewUrls[selectedFile.id]}
                isSelected={true}
                onSetMain={handleSetMain}
                onSelect={handleSelectFile}
                onDelete={handleDeleteFile}
                onFullscreen={setFullscreenFile}
                onAnalyze={handleAnalyze}
                isAnalyzing={isLoading.analyzing}
              />
            )}

            {/* Analysis Report */}
            {selectedFileReport && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Отчёт анализа
                  </h3>
                  <button
                    onClick={handleApplyFixes}
                    disabled={isLoading.fixing}
                    className="px-6 py-2 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading.fixing ? "⏳..." : "✨ Применить исправления"}
                  </button>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono max-h-[400px] overflow-y-auto">
                    {selectedFileReport}
                  </div>
                </div>
              </div>
            )}

            {/* All HTML Files Grid */}
            {htmlFiles.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {htmlFiles.map((file) => (
                  <HtmlFileCard
                    key={file.id}
                    file={file}
                    previewUrl={previewUrls[file.id]}
                    isSelected={selectedFileId === file.id}
                    onSetMain={handleSetMain}
                    onSelect={handleSelectFile}
                    onDelete={handleDeleteFile}
                    onFullscreen={setFullscreenFile}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={
                      isLoading.analyzing && selectedFileId === file.id
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Нет файлов
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Загрузите HTML, CSS, JS файлы для начала работы
          </p>
        </div>
      )}

      {/* Fullscreen Preview */}
      {fullscreenFile && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {fullscreenFile.newFileName}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setFullscreenFile(null)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
            <iframe
              srcDoc={fullscreenFile.content}
              className="flex-1 w-full h-full rounded-b-2xl bg-white"
              title="Fullscreen Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
