import React, { useState, useEffect, Suspense } from 'react';
import StreamlinedOnboardingFlow from './StreamlinedOnboardingFlow';
import MainHostApp from './MainHostApp';
import MainApp from './MainApp';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PropertyProvider, useProperty } from '../contexts/PropertyContext';
import { AuthProvider } from './contexts/AuthContext';
import AppContainer from './layout/AppContainer';
import TopBar from './features/navigation/TopBar';

// Import simplified fallback components
const ErrorBoundary = ({ children, onError }: { children: React.ReactNode; onError?: (error: Error, errorInfo: React.ErrorInfo) => void }) => {
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      console.error('Error caught:', event.error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="min-h-screen app-background flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4 dark:text-white text-gray-900">
            Something went wrong
          </h2>
          <p className="text-sm mb-6 dark:text-white/70 text-gray-600">
            Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

const LoadingSpinner = ({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${sizeClasses[size]} border-2 border-white/30 border-t-white/80 rounded-full animate-spin`} />
      {text && (
        <p className="text-white/70 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

export default function TravelGuideApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <PropertyProvider>
            <TravelGuideAppContent />
          </PropertyProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function TravelGuideAppContent() {
  // State management with localStorage fallback
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userMode, setUserMode] = useState<'guest' | 'host' | null>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setProperty } = useProperty();

  useEffect(() => {
    // Check if user has completed onboarding (stored in localStorage)
    const onboardingCompleted = localStorage.getItem('onboarding-completed');
    const storedUserMode = localStorage.getItem('user-mode') as 'guest' | 'host' | null;
    const storedOnboardingData = localStorage.getItem('onboarding-data');

    if (onboardingCompleted === 'true' && storedUserMode) {
      setHasCompletedOnboarding(true);
      setUserMode(storedUserMode);

      if (storedOnboardingData) {
        try {
          const parsed = JSON.parse(storedOnboardingData);
          setOnboardingData(parsed);

          if (parsed?.propertyDetails) {
            setProperty(parsed.propertyDetails);
          }
        } catch (e) {
          console.warn('Failed to parse stored onboarding data');
        }
      }
    }

    // Simulate hydration delay for smooth transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (mode: 'guest' | 'host', data: any) => {
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('user-mode', mode);
    localStorage.setItem('onboarding-data', JSON.stringify(data));

    setHasCompletedOnboarding(true);
    setUserMode(mode);
    setOnboardingData(data);

    if (data?.propertyDetails) {
      setProperty(data.propertyDetails);
    }
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('user-mode', 'guest');

    setHasCompletedOnboarding(true);
    setUserMode('guest');
  };

  const handleBackToOnboarding = () => {
    localStorage.removeItem('onboarding-completed');
    localStorage.removeItem('user-mode');
    localStorage.removeItem('onboarding-data');

    setHasCompletedOnboarding(false);
    setUserMode(null);
    setOnboardingData(null);
    setProperty(null);
  };

  // Error logging function
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In production, send to monitoring service
    console.error('StayWise App Error:', error, errorInfo);
    
    // You could send to Sentry, LogRocket, etc.
    // Sentry.captureException(error, { extra: errorInfo });
  };

  return (
    <div className="pt-16">
      <TopBar />
      <AppContainer>
        {(() => {
          if (isLoading) {
            return (
              <div className="min-h-screen app-background flex items-center justify-center">
                <div className="glass-float p-8 text-center space-y-6 max-w-sm mx-4">
                  <LoadingSpinner size="lg" text="Loading your travel guide..." />
                  <div className="space-y-2">
                    <h3 className="text-white/90 font-medium">StayWise</h3>
                    <p className="text-white/60 text-sm">Setting up your experience...</p>
                  </div>
                </div>
              </div>
            );
          }

          if (!hasCompletedOnboarding) {
            return (
              <ErrorBoundary onError={handleError}>
                <StreamlinedOnboardingFlow
                  onComplete={handleOnboardingComplete}
                  onSkip={handleOnboardingSkip}
                />
              </ErrorBoundary>
            );
          }

          return (
            <ErrorBoundary onError={handleError}>
              <Suspense fallback={
                <div className="min-h-screen app-background flex items-center justify-center">
                  <LoadingSpinner size="lg" text="Loading app..." />
                </div>
              }>
                {userMode === 'host' ? (
                  <MainHostApp onboardingData={onboardingData} onBack={handleBackToOnboarding} />
                ) : (
                  <MainApp onboardingData={onboardingData} onBackToOnboarding={handleBackToOnboarding} />
                )}
              </Suspense>
              
              {/* Development Tools - Only in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 z-50">
                  <button
                    onClick={handleBackToOnboarding}
                    className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                    title="Reset App (Dev)"
                  >
                    🔄
                  </button>
                </div>
              )}
            </ErrorBoundary>
          );
        })()}
      </AppContainer>
    </div>
  );
}

// Make sure to close TravelGuideAppContent function properly
