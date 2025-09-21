import React from 'react';
import { Apple, Chrome } from 'lucide-react';

interface SocialLoginButtonProps {
  provider: 'apple' | 'google';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
  disabled = false,
  className = '',
  isDarkMode = true
}) => {
  const baseClasses = `
    w-full h-12 rounded-2xl font-medium text-base transition-all duration-300 
    transform hover:-translate-y-1 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    flex items-center justify-center gap-3
  `;

  const providerConfig = {
    apple: {
      icon: <Apple className="w-5 h-5" />,
      text: 'Continue with Apple',
      classes: `
        ${isDarkMode 
          ? 'bg-black text-white hover:bg-gray-900 border border-gray-700' 
          : 'bg-black text-white hover:bg-gray-900 border border-gray-300'
        }
        shadow-lg hover:shadow-xl
      `
    },
    google: {
      icon: <Chrome className="w-5 h-5" />,
      text: 'Continue with Google',
      classes: `
        ${isDarkMode 
          ? 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300' 
          : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
        }
        shadow-lg hover:shadow-xl
      `
    }
  };

  const config = providerConfig[provider];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${config.classes} ${className}`}
      aria-label={`Sign in with ${provider === 'apple' ? 'Apple' : 'Google'}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </button>
  );
};

interface SocialLoginButtonsProps {
  onAppleLogin?: () => void;
  onGoogleLogin?: () => void;
  disabled?: boolean;
  className?: string;
  isDarkMode?: boolean;
  showDivider?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onAppleLogin,
  onGoogleLogin,
  disabled = false,
  className = '',
  isDarkMode = true,
  showDivider = true
}) => {
  const handleAppleLogin = () => {
    // TODO: Implement Apple login logic
    console.log('Apple login clicked');
    onAppleLogin?.();
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login logic
    console.log('Google login clicked');
    onGoogleLogin?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <SocialLoginButton
        provider="apple"
        onClick={handleAppleLogin}
        disabled={disabled}
        isDarkMode={isDarkMode}
      />
      
      <SocialLoginButton
        provider="google"
        onClick={handleGoogleLogin}
        disabled={disabled}
        isDarkMode={isDarkMode}
      />

      {showDivider && (
        <div className="relative flex items-center justify-center my-6">
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
          <span className={`px-4 text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
            or
          </span>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
        </div>
      )}
    </div>
  );
};

export default SocialLoginButtons;
