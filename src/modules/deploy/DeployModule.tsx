import React, { useState, useCallback } from 'react';
import type { HtmlFile, SiteFile, ApiProvider } from './types';
import { analyzeHtmlContent, optimizeFileName, applyAnalysisFixes, generateSEO } from './services/aiService';
import { hasApiKey } from './services/apiKeyService';
import JSZip from 'jszip';
import saveAs from 'file-saver';

export function DeployModule() {
  const [files, setFiles] = useState<SiteFile[]>([]);
  const [htmlFiles, setHtmlFiles] = useState<HtmlFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [isLoading, setIsLoading] = useState<{ analyzing: boolean; optimizing: boolean; fixing: boolean }>({ 
    analyzing: false, optimizing: false, fixing: false 
  });
  const [analysisReport, setAnalysisReport] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const filePromises: Promise<SiteFile | null>[] = Array.from(uploadedFiles).map(file => {
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
              type: file.type || 'text/plain',
            };
            resolve(newFile);
          } else {
            resolve(null);
          }
        };
        reader.onerror = () => resolve(null);

        if (file.type.startsWith('text/') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js')) {
          reader.readAsText(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      });
    });

    Promise.all(filePromises).then((newFiles) => {
      const validFiles = newFiles.filter((f): f is SiteFile => f !== null);
      setFiles(prev => [...prev, ...validFiles]);

      const newHtmlFiles: HtmlFile[] = validFiles
        .filter(f => f.name.endsWith('.html'))
        .map(f => ({
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

      setHtmlFiles(prev => [...prev, ...newHtmlFiles]);
    });
  }, [htmlFiles.length]);

  const handleDeleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setHtmlFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFileId === fileId) setSelectedFileId(null);
  }, [selectedFileId]);

  const handleSelectFile = (fileId: string) => {
    setSelectedFileId(fileId);
  };

  const handleAnalyze = async () => {
    if (!selectedFileId) return;
    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен`);
      return;
    }

    setIsLoading(prev => ({ ...prev, analyzing: true }));
    setError(null);

    try {
      const file = htmlFiles.find(f => f.id === selectedFileId);
      if (!file) return;

      const report = await analyzeHtmlContent(file.content, provider);
      setAnalysisReport(report);
    } catch (err: any) {
      setError(err.message || 'Ошибка анализа');
    } finally {
      setIsLoading(prev => ({ ...prev, analyzing: false }));
    }
  };

  const handleOptimizeNames = async () => {
    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен`);
      return;
    }

    setIsLoading(prev => ({ ...prev, optimizing: true }));
    setError(null);

    try {
      const updatedFiles = await Promise.all(
        htmlFiles.map(async (file) => {
          if (file.isMain) return file;
          const newName = await optimizeFileName(file.content, provider);
          return { ...file, newFileName: `${newName}.html` };
        })
      );
      setHtmlFiles(updatedFiles);
    } catch (err: any) {
      setError(err.message || 'Ошибка оптимизации');
    } finally {
      setIsLoading(prev => ({ ...prev, optimizing: false }));
    }
  };

  const handleApplyFixes = async () => {
    if (!selectedFileId) return;
    if (!hasApiKey(provider)) {
      setError(`API ключ ${provider} не настроен`);
      return;
    }

    setIsLoading(prev => ({ ...prev, fixing: true }));
    setError(null);

    try {
      const file = htmlFiles.find(f => f.id === selectedFileId);
      if (!file) return;

      const fixedHtml = await applyAnalysisFixes(file.content, provider);
      
      const updatedFiles = htmlFiles.map(f => 
        f.id === selectedFileId 
          ? { ...f, content: fixedHtml, history: [...(f.history || []), fixedHtml], historyIndex: (f.historyIndex || 0) + 1 }
          : f
      );
      setHtmlFiles(updatedFiles);
      setAnalysisReport('');
    } catch (err: any) {
      setError(err.message || 'Ошибка применения исправлений');
    } finally {
      setIsLoading(prev => ({ ...prev, fixing: false }));
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    
    htmlFiles.forEach(file => {
      zip.file(file.newFileName, file.content);
    });
    
    files.filter(f => !f.name.endsWith('.html')).forEach(file => {
      const content = typeof file.content === 'string' ? file.content : file.content;
      zip.file(file.name, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'website.zip');
  };

  const selectedFile = htmlFiles.find(f => f.id === selectedFileId);

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
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
          Загрузка файлов
        </label>
        <div className="flex gap-4">
          <input
            type="file"
            multiple
            accept=".html,.css,.js,.md,image/*"
            onChange={handleFileUpload}
            className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
          />
          <button
            onClick={handleOptimizeNames}
            disabled={isLoading.optimizing || htmlFiles.length === 0}
            className="px-6 py-3 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isLoading.optimizing ? '⏳...' : '✨ Оптимизировать имена'}
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

      {/* Files Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Файлы ({files.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {files.map(file => (
                <div
                  key={file.id}
                  onClick={() => handleSelectFile(file.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    selectedFileId === file.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700'
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {file.name.endsWith('.html') ? '📄' : file.name.endsWith('.css') ? '🎨' : file.name.endsWith('.js') ? '⚡' : '📁'}
                    </span>
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {selectedFile ? (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedFile.newFileName || selectedFile.name}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAnalyze}
                        disabled={isLoading.analyzing}
                        className="px-4 py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        {isLoading.analyzing ? '⏳...' : '🔍 Анализ'}
                      </button>
                      <button
                        onClick={handleApplyFixes}
                        disabled={isLoading.fixing || !analysisReport}
                        className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {isLoading.fixing ? '⏳...' : '✨ Применить исправления'}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <iframe
                    srcDoc={selectedFile.content as string}
                    className="w-full h-[400px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white"
                    title="Preview"
                  />
                </div>

                {analysisReport && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      Отчёт анализа
                    </h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono">
                        {analysisReport}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-6xl mb-4">📂</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Выберите файл для просмотра и редактирования
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Нет файлов
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Загрузите HTML, CSS, JS файлы для начала работы
          </p>
        </div>
      )}
    </div>
  );
}
