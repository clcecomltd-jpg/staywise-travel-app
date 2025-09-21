import React from 'react';
import { Info } from 'lucide-react';

interface OfflineInfoProps {
  className?: string;
  text?: string;
}

const OfflineInfo: React.FC<OfflineInfoProps> = ({ 
  className = '', 
  text = "This info is saved on your device for offline use."
}) => {
  return (
    <div 
      className={`
        flex items-center gap-2 px-3 py-2 mb-4
        bg-blue-50/50 dark:bg-blue-900/10
        border border-blue-100 dark:border-blue-800/20
        rounded-lg
        ${className}
      `}
      role="status"
      aria-label="Offline availability notice"
    >
      <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
      <p className="text-xs text-blue-700 dark:text-blue-300 italic font-medium">
        {text}
      </p>
    </div>
  );
};

export default OfflineInfo;