import React from 'react';

interface ProgressBarProps {
  step: number; // 1-4
  totalSteps?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  step, 
  totalSteps = 4,
  className = '' 
}) => {
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Step Dots */}
      <div className="flex justify-center items-center space-x-3 mb-4">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${index + 1 <= step 
                ? 'bg-gradient-to-r from-blue-400 to-indigo-500 scale-110' 
                : 'bg-white/20 scale-100'
              }
            `} />
            {index < totalSteps - 1 && (
              <div className={`
                w-8 h-0.5 mx-1 transition-all duration-300
                ${index + 1 < step 
                  ? 'bg-gradient-to-r from-blue-400 to-indigo-500' 
                  : 'bg-white/20'
                }
              `} />
            )}
          </div>
        ))}
      </div>
      
      {/* Step Label */}
      <div className="text-center">
        <span className="text-xs text-white/60 font-medium">
          Step {step} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;