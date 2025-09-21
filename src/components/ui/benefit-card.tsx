import React from 'react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay?: number;
  className?: string;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  title,
  subtitle,
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
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/20">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white/95 font-medium text-base">{title}</h3>
          <p className="text-white/70 text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default BenefitCard;