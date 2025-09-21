import React from 'react';

// Screen reader only content
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">
    {children}
  </span>
);

// Accessible button with proper focus and aria attributes
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescription?: string;
  isSelected?: boolean;
  className?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  ariaLabel,
  ariaDescription,
  isSelected,
  className = '',
  ...props
}) => (
  <button
    {...props}
    aria-label={ariaLabel}
    aria-describedby={ariaDescription}
    aria-pressed={isSelected}
    className={`
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      transition-all duration-200
      ${className}
    `}
  >
    {children}
    {isSelected && <ScreenReaderOnly>Selected</ScreenReaderOnly>}
  </button>
);

// Accessible card for selection options
interface AccessibleOptionCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const AccessibleOptionCard: React.FC<AccessibleOptionCardProps> = ({
  id,
  title,
  description,
  icon,
  selected,
  onClick,
  className = '',
  children
}) => (
  <button
    onClick={onClick}
    role="radio"
    aria-checked={selected}
    aria-labelledby={`${id}-title`}
    aria-describedby={description ? `${id}-desc` : undefined}
    className={`
      w-full text-left transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${selected ? 'ring-2 ring-blue-500' : ''}
      ${className}
    `}
  >
    <div className="flex items-center gap-4">
      {icon && (
        <div className="flex-shrink-0" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 id={`${id}-title`} className="font-semibold">
          {title}
        </h3>
        {description && (
          <p id={`${id}-desc`} className="text-sm opacity-75">
            {description}
          </p>
        )}
      </div>
    </div>
    {children}
    <ScreenReaderOnly>
      {selected ? 'Currently selected' : 'Not selected'}
    </ScreenReaderOnly>
  </button>
);

// Progress indicator with proper ARIA attributes
interface AccessibleProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  className?: string;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabel,
  className = ''
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}: ${stepLabel}`}
        className="sr-only"
      />
      <div className="flex items-center justify-center mb-3">
        <div className="relative w-32 h-1 rounded-full bg-white/20">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercentage}%`,
              background: 'linear-gradient(to right, #007AFF, #5856D6)',
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)'
            }}
          />
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index + 1}
              className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                index + 1 <= currentStep
                  ? 'bg-blue-500 scale-125'
                  : 'bg-white/30 scale-100'
              }`}
              style={{
                left: `${(index / (totalSteps - 1)) * 100}%`,
                transform: 'translateX(-50%) translateY(-50%)',
                ...(index + 1 <= currentStep ? {
                  boxShadow: '0 0 6px rgba(59, 130, 246, 0.6)'
                } : {})
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <span className="text-white/70 font-medium text-sm">
          {stepLabel}
        </span>
      </div>
    </div>
  );
};

// Skip link for keyboard users
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children
}) => (
  <a
    href={href}
    className="
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
      bg-blue-600 text-white px-4 py-2 rounded-md z-50
      focus:outline-none focus:ring-2 focus:ring-white
    "
  >
    {children}
  </a>
);

// Live region for dynamic content announcements
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
}> = ({ children, priority = 'polite' }) => (
  <div
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {children}
  </div>
);