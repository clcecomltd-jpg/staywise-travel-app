import React from 'react';

interface OnboardingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = "w-full h-12 rounded-2xl font-medium text-base transition-all duration-300 transform";
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-500 to-blue-500 text-white
      hover:from-purple-600 hover:to-blue-600 hover:-translate-y-1
      active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
      shadow-lg hover:shadow-xl
      ${!disabled ? 'shadow-[0_0_20px_rgba(147,51,234,0.3)]' : ''}
    `,
    secondary: `
      glass-button text-white/90 hover:text-white
      hover:-translate-y-1 active:scale-95 
      disabled:opacity-50 disabled:cursor-not-allowed
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default OnboardingButton;