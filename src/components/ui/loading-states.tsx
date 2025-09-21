import React from 'react';
import { Loader2, Compass } from 'lucide-react';

// Generic loading spinner
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    />
  );
};

// Onboarding-specific loading state with compass
export const OnboardingLoader: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = 'Loading...', className = '' }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <div className="relative mb-4">
      <Compass
        className="w-8 h-8 text-blue-400 animate-spin"
        style={{ animationDuration: '2s' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          animation: 'pulse 2s infinite'
        }}
      />
    </div>
    <p className="text-white/80 text-sm font-medium" aria-live="polite">
      {message}
    </p>
  </div>
);

// Button loading state
export const LoadingButton: React.FC<{
  isLoading: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  loadingText?: string;
  'aria-label'?: string;
}> = ({
  isLoading,
  disabled = false,
  children,
  onClick,
  className = '',
  loadingText = 'Loading...',
  'aria-label': ariaLabel
}) => (
  <button
    onClick={onClick}
    disabled={isLoading || disabled}
    aria-label={isLoading ? loadingText : ariaLabel}
    className={`
      relative w-full py-4 px-6 rounded-2xl font-semibold text-white
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${isLoading || disabled
        ? 'opacity-75 cursor-not-allowed bg-gray-600'
        : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
      }
      ${className}
    `}
  >
    {isLoading && (
      <span className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" className="mr-2" />
        {loadingText}
      </span>
    )}
    <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
      {children}
    </span>
  </button>
);

// Skeleton loading for content
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }, (_, index) => (
      <div
        key={index}
        className="h-4 bg-white/20 rounded mb-3 last:mb-0"
        style={{
          width: index === lines - 1 ? '75%' : '100%'
        }}
      />
    ))}
  </div>
);

// Card skeleton for benefit cards
export const BenefitCardSkeleton: React.FC<{ className?: string }> = ({
  className = ''
}) => (
  <div className={`animate-pulse bg-white/10 rounded-2xl p-6 ${className}`}>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex-shrink-0" />
      <div className="flex-1">
        <div className="h-5 bg-white/20 rounded mb-2" />
        <div className="h-4 bg-white/15 rounded w-3/4" />
      </div>
    </div>
  </div>
);

// Progress loading state
export const ProgressLoader: React.FC<{
  progress: number;
  message?: string;
  className?: string;
}> = ({ progress, message, className = '' }) => (
  <div className={`text-center ${className}`}>
    <div className="relative w-full h-2 bg-white/20 rounded-full mb-4 overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
    {message && (
      <p className="text-white/80 text-sm" aria-live="polite">
        {message}
      </p>
    )}
  </div>
);

// Error state component
export const ErrorState: React.FC<{
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ message, onRetry, className = '' }) => (
  <div className={`text-center ${className}`}>
    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-red-400 text-xl">⚠️</span>
    </div>
    <p className="text-white/90 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="
          px-4 py-2 bg-blue-600 text-white rounded-lg
          hover:bg-blue-700 transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        "
      >
        Try Again
      </button>
    )}
  </div>
);

// Success state component
export const SuccessState: React.FC<{
  message: string;
  className?: string;
}> = ({ message, className = '' }) => (
  <div className={`text-center ${className}`}>
    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-green-400 text-xl">✓</span>
    </div>
    <p className="text-white/90">{message}</p>
  </div>
);