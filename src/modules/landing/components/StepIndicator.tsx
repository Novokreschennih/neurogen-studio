import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
      "Цель",
      "Информация",
      "Стиль",
      "Результат"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4 animate-fade-in">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center text-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 border-2 ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100 dark:shadow-emerald-900/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isCompleted ? '✔' : stepNumber}
                </div>
                <p className={`mt-2 text-xs md:text-sm font-medium transition-colors duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`}>
                    {label}
                </p>
              </div>
              {stepNumber < totalSteps && (
                 <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
