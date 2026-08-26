import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingStepper({ currentStep, totalSteps = 6 }) {
  const steps = [
    'Event',
    'Date',
    'Time',
    'Guests',
    'Requests',
    'Review'
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] rounded-full z-0 transition-all duration-300"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  isActive ? 'bg-[var(--color-primary)] text-white shadow-md ring-4 ring-[var(--color-primary)]/20' : 
                  isCompleted ? 'bg-[var(--color-primary)] text-white' : 
                  'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : stepNumber}
              </div>
              <span className={`absolute top-12 text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                isActive ? 'text-[var(--color-primary)]' : 
                isCompleted ? 'text-gray-800' : 
                'text-gray-400'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
