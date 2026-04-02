import React, { useState } from 'react';
import { PrivacyPolicyContent, TermsOfUseContent } from './LegalContent';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-white/10 w-full max-w-3xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Правовая информация</h2>
            <div className="mt-4">
              <nav className="flex space-x-4 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl inline-flex">
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`whitespace-nowrap py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'privacy'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Политика конфиденциальности
                </button>
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`whitespace-nowrap py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'terms'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Условия использования
                </button>
              </nav>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors">&times;</button>
        </div>

        <div className="overflow-y-auto pr-4 flex-grow text-slate-600 dark:text-slate-300">
            {activeTab === 'privacy' ? <PrivacyPolicyContent /> : <TermsOfUseContent />}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
