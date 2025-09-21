import React from 'react';

interface QuestionCardProps {
  title: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  delay?: number;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  delay = 0,
  className = ''
}) => {
  return (
    <div 
      className={`glass-card rounded-2xl p-4 animate-fade-in hover:-translate-y-1 transition-all duration-300 ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        minHeight: '88px'
      }}
    >
      <h3 className="text-white/95 font-medium text-base mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250 ${
              selectedValue === option
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                : 'glass-button text-white/80 hover:text-white/95 hover:scale-105'
            }`}
          >
            {option}
            {selectedValue === option && (
              <span className="ml-2 animate-fade-in">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;