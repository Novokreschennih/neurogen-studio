import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-between relative overflow-hidden py-8 px-4 selection:bg-cyan-500/30 bg-[#05050a]">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-50 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05050a_90%)]" />
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="mt-4 animate-fade-in">
        <div className="px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center gap-2 shadow-lg shadow-black/50">
          <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
            NeuroGen Studio V1.0
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full max-w-5xl z-10 flex-grow">
        <div className="text-center mb-12 relative">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-2 drop-shadow-xl">
            NeuroGen
          </h1>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-x pb-4">
            Studio
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-6 leading-relaxed font-light tracking-wide">
            Ваш персональный <span className="text-slate-200 font-medium">Маркетинговый Архитектор</span>. 
            Три инструмента в одном: создание лендингов, редизайн и деплой сайтов.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full animate-fade-in animation-delay-300">
          <div className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-800/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🧲</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Конструктор</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Создание лендингов и лид-магнитов с нуля при помощи ИИ
            </p>
          </div>
          <div className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-800/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Редизайн</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Улучшение существующих сайтов с сохранением контента
            </p>
          </div>
          <div className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-800/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Деплой</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Публикация на GitHub Pages с AI-оптимизацией
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 animate-fade-in animation-delay-500">
          <button
            onClick={onEnter}
            className="group relative px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-white rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-3"
          >
            <span className="font-semibold tracking-wide">Запустить Систему</span>
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col items-center gap-2 mb-4 animate-fade-in animation-delay-700">
        <div className="text-[10px] font-mono text-slate-600 tracking-[0.2em] uppercase">
          Press Start to Initialize
        </div>
        <div className="flex items-center gap-6 text-[10px] font-mono text-slate-700">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full border border-slate-600" />
            SECURE ENVIRONMENT
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
            REAL-TIME GENERATION
          </span>
        </div>
      </div>
    </div>
  );
}
