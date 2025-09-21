import React, { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface OnboardingCompletionProps {
  selectedMode: 'guest' | 'host';
  isDarkMode: boolean;
  onComplete: () => void;
  onBack: () => void;
}

// Simple Confetti Component
const ConfettiParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  return (
    <div
      className="confetti-particle absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: '-20px',
        width: '8px',
        height: '8px',
        backgroundColor: color,
        borderRadius: '50%',
        animationDelay: `${delay}ms`,
        pointerEvents: 'none'
      }}
    />
  );
};

const OnboardingCompletion: React.FC<OnboardingCompletionProps> = ({
  selectedMode,
  isDarkMode,
  onComplete,
  onBack
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Start confetti animation after component mounts
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const confettiColors = [
    ONBOARDING_CONFIG.COLORS.PRIMARY,
    ONBOARDING_CONFIG.COLORS.SECONDARY,
    '#FFD700',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1'
  ];

  return (
    <div className="flex-1 flex flex-col justify-center text-center relative" style={{ minHeight: '440px' }}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, index) => (
            <ConfettiParticle
              key={index}
              delay={index * 150}
              color={confettiColors[index % confettiColors.length]}
            />
          ))}
        </div>
      )}

      {/* Success Icon */}
      <div className="w-24 h-24 rounded-full glass-card mx-auto mb-8 flex items-center justify-center animate-completion-zoom">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-green-400" />
        </div>
      </div>

      {/* Completion Text */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center justify-center space-x-2">
          <h1 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: '28px' }}>
            You're all set!
          </h1>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        
        <p className={`font-medium ${isDarkMode ? 'text-white/90' : 'text-gray-800'}`} style={{ fontSize: '18px' }}>
          We've personalized your guide for this trip.
        </p>
      </div>

      {/* Enter App Button */}
      <button
        onClick={onComplete}
        className={`w-full font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
          isDarkMode ? 'text-white' : 'text-white'
        }`}
        style={{
          padding: '16px 24px',
          borderRadius: '16px',
          background: '#007AFF',
          fontSize: '16px',
          marginBottom: '16px'
        }}
      >
        Enter App
      </button>
    </div>
  );
};

export default OnboardingCompletion;