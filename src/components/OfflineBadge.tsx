import React from 'react';
import { Cloud, Check } from 'lucide-react';
import { Badge } from './ui/badge';

interface OfflineBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'subtle' | 'visible';
}

const OfflineBadge: React.FC<OfflineBadgeProps> = ({ 
  className = '', 
  size = 'sm',
  variant = 'subtle'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  const variantClasses = {
    subtle: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30',
    visible: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50'
  };

  return (
    <Badge 
      variant="outline" 
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        font-medium
        inline-flex items-center gap-1
        transition-colors duration-200
        ${className}
      `}
      title="This information is available offline"
      aria-label="Available offline"
    >
      <span className="flex items-center gap-1">
        <Cloud className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} aria-hidden="true" />
        <Check className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} aria-hidden="true" />
        <span>Offline Available</span>
      </span>
    </Badge>
  );
};

export default OfflineBadge;
