import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { getHistory, deleteHistoryItem } from '../services/historyService';
import { TrashIcon, HistoryIcon } from './icons';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (item: HistoryItem) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onRestore }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    if(window.confirm("Вы уверены, что хотите удалить эту запись из истории?")) {
        const updatedHistory = deleteHistoryItem(id);
        setHistory(updatedHistory);
    }
  }

  const generateTitle = (item: HistoryItem) => {
    const goal = item.formData.goal === 'landing_page' ? 'Лендинг' : 'Лид-магнит';
    const description = item.formData.ideaDescription.substring(0, 40);
    return `${goal}: ${description}${item.formData.ideaDescription.length > 40 ? '...' : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-white/10 w-full max-w-2xl flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <HistoryIcon className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">История Генераций</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors">&times;</button>
        </div>
        <div className="overflow-y-auto pr-2 space-y-3 flex-grow">
            {history.length > 0 ? (
                history.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex justify-between items-center transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 group">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{generateTitle(item)}</p>
                            <p className="text-sm text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => onRestore(item)} className="bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold py-2 px-4 rounded-xl text-sm transition-colors">
                                Восстановить
                            </button>
                             <button onClick={() => handleDelete(item.id)} title="Удалить" className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <HistoryIcon className="w-12 h-12 mb-3 opacity-50" />
                    <p>История пуста. Создайте что-нибудь!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
