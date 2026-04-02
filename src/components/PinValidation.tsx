import React, { useState } from 'react';
import { PIN_AUTH_SERVICE_URL, API_GATEWAY_URL } from '../constants';

interface PinValidationProps {
  onSuccess: (data: any) => void;
  appId: string;
}

export default function PinValidation({ onSuccess, appId }: PinValidationProps) {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_GATEWAY_URL}/?action=validate-app-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, appId }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        onSuccess(data);
      } else {
        setError(data.message || 'Неверный PIN-код');
      }
    } catch (error) {
      console.error('PIN validation error:', error);
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#05050a] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-50 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05050a_90%)]" />
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Введите PIN-код</h2>
          <p className="text-slate-400 text-sm">
            Для доступа к NeuroGen Studio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            maxLength={4}
            className="w-full p-4 text-center text-2xl tracking-[0.5em] rounded-xl bg-slate-900/50 border border-slate-700 outline-none text-white placeholder-slate-600 focus:border-cyan-500 transition-colors"
          />

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading || pin.length !== 4}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Проверка...' : 'Войти'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}
