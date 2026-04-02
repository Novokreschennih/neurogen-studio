import React from 'react';

interface DashboardProps {
  onModuleSelect: (module: 'landing' | 'redesign' | 'deploy') => void;
}

export function Dashboard({ onModuleSelect }: DashboardProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Добро пожаловать в{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600">
            NeuroGen Studio
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Универсальная платформа для создания, редизайна и деплоя сайтов с помощью искусственного интеллекта
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Landing Creator */}
        <ModuleCard
          icon="🧲"
          title="Конструктор лендингов"
          description="Создайте лендинг или лид-магнит с нуля. ИИ сгенерирует структуру, контент и дизайн на основе вашего описания."
          features={[
            'Генерация структуры и контента',
            'Выбор стиля дизайна',
            'Загрузка изображений',
            'Экспорт в HTML/PDF'
          ]}
          gradient="from-cyan-500 to-blue-600"
          onClick={() => onModuleSelect('landing')}
        />

        {/* Redesign */}
        <ModuleCard
          icon="🎨"
          title="Редизайн сайта"
          description="Улучшите существующий сайт. Загрузите HTML и получите современный дизайн с сохранением контента."
          features={[
            'Анализ текущей версии',
            'AI-оптимизация дизайна',
            'Сравнение версий',
            'Применение стилей'
          ]}
          gradient="from-purple-500 to-pink-600"
          onClick={() => onModuleSelect('redesign')}
        />

        {/* Deploy */}
        <ModuleCard
          icon="🚀"
          title="Деплой на GitHub Pages"
          description="Подготовьте и опубликуйте сайт на GitHub Pages. Редактирование, оптимизация и деплой в одном месте."
          features={[
            'Редактор кода',
            'AI-анализ и исправления',
            'ZIP-экспорт',
            'GitHub Pages деплой'
          ]}
          gradient="from-emerald-500 to-teal-600"
          onClick={() => onModuleSelect('deploy')}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
        <StatCard
          number="3"
          label="Модуля в одном"
          description="Все инструменты в одной платформе"
        />
        <StatCard
          number="∞"
          label="Проектов"
          description="Без ограничений на создание"
        />
        <StatCard
          number="24/7"
          label="Доступ"
          description="Работайте в любое время"
        />
      </div>
    </div>
  );
}

interface ModuleCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  onClick: () => void;
}

function ModuleCard({ icon, title, description, features, gradient, onClick }: ModuleCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Arrow */}
      <div className="mt-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Запустить</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </button>
  );
}

interface StatCardProps {
  number: string;
  label: string;
  description: string;
}

function StatCard({ number, label, description }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{number}</div>
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</div>
      <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">{description}</div>
    </div>
  );
}
