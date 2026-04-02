import React from 'react';

interface NavigationProps {
  currentModule: 'dashboard' | 'landing' | 'redesign' | 'deploy';
  onModuleChange: (module: 'dashboard' | 'landing' | 'redesign' | 'deploy') => void;
  onSettingsOpen: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Navigation({
  currentModule,
  onModuleChange,
  onSettingsOpen,
  onLogout,
  theme,
  onToggleTheme
}: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NG</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600">
              NeuroGen Studio
            </span>
          </div>

          {/* Module Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavButton
              active={currentModule === 'dashboard'}
              onClick={() => onModuleChange('dashboard')}
              icon="🏠"
              label="Главная"
            />
            <NavButton
              active={currentModule === 'landing'}
              onClick={() => onModuleChange('landing')}
              icon="🧲"
              label="Конструктор"
            />
            <NavButton
              active={currentModule === 'redesign'}
              onClick={() => onModuleChange('redesign')}
              icon="🎨"
              label="Редизайн"
            />
            <NavButton
              active={currentModule === 'deploy'}
              onClick={() => onModuleChange('deploy')}
              icon="🚀"
              label="Деплой"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Переключить тему"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={onSettingsOpen}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Настройки"
            >
              ⚙️
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          <NavButton
            active={currentModule === 'dashboard'}
            onClick={() => onModuleChange('dashboard')}
            icon="🏠"
            label="Главная"
            compact
          />
          <NavButton
            active={currentModule === 'landing'}
            onClick={() => onModuleChange('landing')}
            icon="🧲"
            label="Конструктор"
            compact
          />
          <NavButton
            active={currentModule === 'redesign'}
            onClick={() => onModuleChange('redesign')}
            icon="🎨"
            label="Редизайн"
            compact
          />
          <NavButton
            active={currentModule === 'deploy'}
            onClick={() => onModuleChange('deploy')}
            icon="🚀"
            label="Деплой"
            compact
          />
        </div>
      </div>
    </nav>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  compact?: boolean;
}

function NavButton({ active, onClick, icon, label, compact = false }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all
        ${compact ? 'text-sm' : 'px-4'}
        ${active
          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }
      `}
    >
      <span>{icon}</span>
      {!compact && <span>{label}</span>}
    </button>
  );
}
