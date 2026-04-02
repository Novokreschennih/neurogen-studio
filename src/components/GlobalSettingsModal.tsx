import React, { useState, useEffect } from 'react';

interface GlobalSettings {
  // AI Providers
  geminiKey: string;
  openRouterKey: string;
  routerAiKey: string;
  
  // Models
  geminiModel: string;
  openRouterModel: string;
  routerAiModel: string;
  
  // Active Provider
  activeProvider: 'gemini' | 'openrouter' | 'routerai';
  
  // Theme
  darkMode: boolean;
  
  // Language
  language: 'ru' | 'en';
}

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: GlobalSettings) => void;
}

const DEFAULT_SETTINGS: GlobalSettings = {
  geminiKey: '',
  openRouterKey: '',
  routerAiKey: '',
  geminiModel: 'gemini-2.5-flash',
  openRouterModel: 'google/gemini-2.0-flash-001',
  routerAiModel: 'openai/gpt-4o',
  activeProvider: 'gemini',
  darkMode: false,
  language: 'ru',
};

export const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'appearance' | 'legal'>('ai');
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  // Load settings from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const loaded: GlobalSettings = {
        geminiKey: localStorage.getItem('neurogen-gemini-key') || '',
        openRouterKey: localStorage.getItem('neurogen-openrouter-key') || '',
        routerAiKey: localStorage.getItem('neurogen-routerai-key') || '',
        geminiModel: localStorage.getItem('neurogen-gemini-model') || 'gemini-2.5-flash',
        openRouterModel: localStorage.getItem('neurogen-openrouter-model') || 'google/gemini-2.0-flash-001',
        routerAiModel: localStorage.getItem('neurogen-routerai-model') || 'openai/gpt-4o',
        activeProvider: (localStorage.getItem('neurogen-active-provider') as any) || 'gemini',
        darkMode: localStorage.getItem('neurogen-dark-mode') === 'true',
        language: (localStorage.getItem('neurogen-language') as any) || 'ru',
      };
      setSettings(loaded);
    }
  }, [isOpen]);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('neurogen-gemini-key', settings.geminiKey);
    localStorage.setItem('neurogen-openrouter-key', settings.openRouterKey);
    localStorage.setItem('neurogen-routerai-key', settings.routerAiKey);
    localStorage.setItem('neurogen-gemini-model', settings.geminiModel);
    localStorage.setItem('neurogen-openrouter-model', settings.openRouterModel);
    localStorage.setItem('neurogen-routerai-model', settings.routerAiModel);
    localStorage.setItem('neurogen-active-provider', settings.activeProvider);
    localStorage.setItem('neurogen-dark-mode', String(settings.darkMode));
    localStorage.setItem('neurogen-language', settings.language);

    onSave?.(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col m-4">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚙️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Настройки</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">NeuroGen Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-6 border-b border-slate-200 dark:border-slate-700">
          <TabButton
            active={activeTab === 'ai'}
            onClick={() => setActiveTab('ai')}
            icon="🤖"
            label="AI Провайдеры"
          />
          <TabButton
            active={activeTab === 'appearance'}
            onClick={() => setActiveTab('appearance')}
            icon="🎨"
            label="Внешний вид"
          />
          <TabButton
            active={activeTab === 'legal'}
            onClick={() => setActiveTab('legal')}
            icon="📄"
            label="Правовая информация"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* AI Providers Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              {/* Active Provider */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Активный AI провайдер
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <ProviderCard
                    icon="💎"
                    name="Google Gemini"
                    active={settings.activeProvider === 'gemini'}
                    onClick={() => setSettings({ ...settings, activeProvider: 'gemini' })}
                  />
                  <ProviderCard
                    icon="🌐"
                    name="OpenRouter"
                    active={settings.activeProvider === 'openrouter'}
                    onClick={() => setSettings({ ...settings, activeProvider: 'openrouter' })}
                  />
                  <ProviderCard
                    icon="🔄"
                    name="RouterAI"
                    active={settings.activeProvider === 'routerai'}
                    onClick={() => setSettings({ ...settings, activeProvider: 'routerai' })}
                  />
                </div>
              </div>

              {/* Gemini Settings */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>💎</span> Google Gemini
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={settings.geminiKey}
                      onChange={(e) => setSettings({ ...settings, geminiKey: e.target.value })}
                      placeholder="Введите ваш API ключ"
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Модель
                    </label>
                    <select
                      value={settings.geminiModel}
                      onChange={(e) => setSettings({ ...settings, geminiModel: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Быстрый)</option>
                      <option value="gemini-3-pro-preview">Gemini 3.0 Pro (Продвинутый)</option>
                    </select>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Получите ключ на{' '}
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      aistudio.google.com/apikey
                    </a>
                  </p>
                </div>
              </div>

              {/* OpenRouter Settings */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🌐</span> OpenRouter
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={settings.openRouterKey}
                      onChange={(e) => setSettings({ ...settings, openRouterKey: e.target.value })}
                      placeholder="Введите ваш API ключ"
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Модель
                    </label>
                    <select
                      value={settings.openRouterModel}
                      onChange={(e) => setSettings({ ...settings, openRouterModel: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                      <option value="google/gemini-2.0-flash-001">Gemini 2.0 Flash</option>
                      <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                      <option value="openai/gpt-4o">GPT-4o</option>
                      <option value="deepseek/deepseek-chat">DeepSeek V3</option>
                    </select>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Получите ключ на{' '}
                    <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      openrouter.ai
                    </a>
                  </p>
                </div>
              </div>

              {/* RouterAI Settings */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🔄</span> RouterAI
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={settings.routerAiKey}
                      onChange={(e) => setSettings({ ...settings, routerAiKey: e.target.value })}
                      placeholder="Введите ваш API ключ"
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Модель
                    </label>
                    <select
                      value={settings.routerAiModel}
                      onChange={(e) => setSettings({ ...settings, routerAiModel: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                      <option value="openai/gpt-4o">GPT-4o</option>
                      <option value="openai/gpt-4o-mini">GPT-4o mini</option>
                      <option value="anthropic/claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
                    </select>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Получите ключ на{' '}
                    <a href="https://routerai.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      routerai.ai
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">🌙</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Тёмная тема</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Переключить светлый/тёмный режим</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.darkMode ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* Language */}
              <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">🌍</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Язык интерфейса</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Выберите язык приложения</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSettings({ ...settings, language: 'ru' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      settings.language === 'ru'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🇷🇺 Русский
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, language: 'en' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      settings.language === 'en'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Legal Tab */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              {/* Legal Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLegalTab('privacy')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    legalTab === 'privacy'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Политика конфиденциальности
                </button>
                <button
                  onClick={() => setLegalTab('terms')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    legalTab === 'terms'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Условия использования
                </button>
              </div>

              {/* Content */}
              <div className="prose dark:prose-invert max-w-none p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-[400px] overflow-y-auto">
                {legalTab === 'privacy' ? (
                  <PrivacyPolicyContent />
                ) : (
                  <TermsOfUseContent />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-components

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
      active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

interface ProviderCardProps {
  icon: string;
  name: string;
  active: boolean;
  onClick: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ icon, name, active, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl border-2 transition-all ${
      active
        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
    }`}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-medium text-sm text-slate-900 dark:text-white">{name}</div>
  </button>
);

const PrivacyPolicyContent: React.FC = () => (
  <div className="space-y-4 text-sm">
    <h4 className="font-bold text-lg">1. Сбор информации</h4>
    <p>Мы собираем информацию, которую вы предоставляете при использовании NeuroGen Studio, включая API ключи, которые хранятся локально в вашем браузере.</p>
    
    <h4 className="font-bold text-lg mt-4">2. Использование информации</h4>
    <p>Собранные данные используются исключительно для функционирования приложения: генерация контента через AI провайдеров, сохранение истории проектов локально, аутентификация пользователя.</p>
    
    <h4 className="font-bold text-lg mt-4">3. Хранение данных</h4>
    <p>Все данные хранятся локально в браузере пользователя (localStorage). Мы не передаём и не храним ваши данные на внешних серверах, за исключением запросов к AI провайдерам.</p>
    
    <h4 className="font-bold text-lg mt-4">4. Безопасность</h4>
    <p>Мы принимаем разумные меры для защиты вашей информации, но помните, что ни один метод передачи данных через интернет не является полностью безопасным.</p>
    
    <h4 className="font-bold text-lg mt-4">5. Права пользователя</h4>
    <p>Вы имеете право: доступа к вашим данным, исправления неточных данных, удаления ваших данных, экспорта ваших данных.</p>
    
    <h4 className="font-bold text-lg mt-4">6. Контакты</h4>
    <p>По вопросам конфиденциальности обращайтесь: support@neurogen.studio</p>
  </div>
);

const TermsOfUseContent: React.FC = () => (
  <div className="space-y-4 text-sm">
    <h4 className="font-bold text-lg">1. Принятие условий</h4>
    <p>Используя NeuroGen Studio, вы соглашаетесь с настоящими Условиями использования. Если вы не согласны, пожалуйста, не используйте приложение.</p>
    
    <h4 className="font-bold text-lg mt-4">2. Описание сервиса</h4>
    <p>NeuroGen Studio предоставляет инструменты для создания, редизайна и деплоя веб-сайтов с использованием искусственного интеллекта.</p>
    
    <h4 className="font-bold text-lg mt-4">3. Правила использования</h4>
    <p>Вы соглашаетесь не использовать сервис для: генерации незаконного или вредоносного контента, нарушения прав интеллектуальной собственности, спама или мошенничества, обхода ограничений сервиса.</p>
    
    <h4 className="font-bold text-lg mt-4">4. Интеллектуальная собственность</h4>
    <p>Все права на приложение принадлежат NeuroGen. Контент, созданный пользователями, принадлежит самим пользователям.</p>
    
    <h4 className="font-bold text-lg mt-4">5. Отказ от ответственности</h4>
    <p>Сервис предоставляется "как есть". Мы не гарантируем бесперебойную работу и не несём ответственности за убытки, связанные с использованием приложения.</p>
    
    <h4 className="font-bold text-lg mt-4">6. Изменения условий</h4>
    <p>Мы оставляем за собой право изменять данные условия в любое время. Продолжение использования сервиса означает принятие новых условий.</p>
    
    <h4 className="font-bold text-lg mt-4">7. Контакты</h4>
    <p>По вопросам условий использования: legal@neurogen.studio</p>
  </div>
);
