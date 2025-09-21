import React, { useReducer, useEffect } from 'react';
import {
  Home,
  Sun,
  Moon,
  Luggage,
  KeyRound,
  MapPin,
  Heart,
  Compass,
  HelpCircle,
  User,
  BarChart3,
  Share2,
  Settings,
  Smile,
  TrendingUp,
  Building2,
  Utensils,
  Palmtree,
  Music4,
  Landmark,
  Users,
  Wallet,
  Coffee,
  Gem,
  Star,
  UtensilsCrossed,
  Camera,
  Hotel,
  FilePlus,
  DollarSign,
  Clock,
  BarChart,
  Check,
  Sparkles
} from 'lucide-react';
import { StandardizedCompass, StandardizedTitle, StandardizedBackground } from './ui/standardized-compass';

// Import the images and styles
const cityBackground = '/city.png';
const goldenCompassImage = '/golden-compass.png';
import '../styles/onboarding-animations.css';
import { importPropertyFromSupabase, type ImportedProperty } from '../lib/propertyImport';

// Add Apple and Google SVG icons as components
const AppleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

interface StreamlinedOnboardingFlowProps {
  onComplete: (mode: 'guest' | 'host', data: OnboardingData) => void;
  onSkip: () => void;
}

interface OnboardingData {
  mode: 'guest' | 'host';
  tripPurpose?: string[];
  preferences?: string[];
  propertyProvider?: string;
  hostGoals?: string[];
  propertyDetails?: ImportedProperty | null;
}

type OnboardingStep = 'splash' | 'auth' | 'mode-selection' | 'quick-setup' | 'personalization' | 'completion';

interface OnboardingState {
  currentStep: OnboardingStep;
  mode: 'guest' | 'host' | null;
  tripPurpose: string[];
  preferences: string[];
  propertyProvider: string | null;
  propertyUrl: string;
  propertyDetails: ImportedProperty | null;
  propertyImportStatus: 'idle' | 'loading' | 'success' | 'error';
  propertyImportError: string | null;
  manualPropertyName: string;
  manualPropertyLocation: string;
  manualPropertyHeadline: string;
  manualPropertyDescription: string;
  hostGoals: string[];
  isDarkMode: boolean;
  testingMode: boolean;
  isLoading: boolean;
}

type OnboardingAction =
  | { type: 'SET_STEP'; step: OnboardingStep }
  | { type: 'SET_MODE'; mode: 'guest' | 'host' }
  | { type: 'TOGGLE_TRIP_PURPOSE'; purpose: string }
  | { type: 'TOGGLE_PREFERENCE'; preference: string }
  | { type: 'SET_PROPERTY_PROVIDER'; provider: string }
  | { type: 'SET_PROPERTY_URL'; url: string }
  | { type: 'SET_PROPERTY_DETAILS'; details: ImportedProperty | null }
  | { type: 'SET_PROPERTY_IMPORT_STATUS'; status: OnboardingState['propertyImportStatus']; error?: string | null }
  | { type: 'SET_MANUAL_PROPERTY_FIELD'; field: 'name' | 'location' | 'headline' | 'description'; value: string }
  | { type: 'TOGGLE_HOST_GOAL'; goal: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_TESTING_MODE' }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'RESET' };

const initialState: OnboardingState = {
  currentStep: 'splash',
  mode: null,
  tripPurpose: [],
  preferences: [],
  propertyProvider: null,
  propertyUrl: '',
  propertyDetails: null,
  propertyImportStatus: 'idle',
  propertyImportError: null,
  manualPropertyName: '',
  manualPropertyLocation: '',
  manualPropertyHeadline: '',
  manualPropertyDescription: '',
  hostGoals: [],
  isDarkMode: true,
  testingMode: false,
  isLoading: false,
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'TOGGLE_TRIP_PURPOSE':
      return {
        ...state,
        tripPurpose: state.tripPurpose.includes(action.purpose)
          ? state.tripPurpose.filter(p => p !== action.purpose)
          : [...state.tripPurpose, action.purpose]
      };
    case 'TOGGLE_PREFERENCE':
      return {
        ...state,
        preferences: state.preferences.includes(action.preference)
          ? state.preferences.filter(p => p !== action.preference)
          : [...state.preferences, action.preference]
      };
    case 'SET_PROPERTY_PROVIDER':
      return {
        ...state,
        propertyProvider: action.provider,
        propertyImportStatus: 'idle',
        propertyImportError: null,
        propertyUrl: '',
        manualPropertyName: '',
        manualPropertyLocation: '',
        manualPropertyHeadline: '',
        manualPropertyDescription: '',
        propertyDetails: null,
      };
    case 'SET_PROPERTY_URL':
      return { ...state, propertyUrl: action.url };
    case 'SET_PROPERTY_DETAILS':
      return { ...state, propertyDetails: action.details };
    case 'SET_PROPERTY_IMPORT_STATUS':
      return {
        ...state,
        propertyImportStatus: action.status,
        propertyImportError: action.error ?? null,
      };
    case 'SET_MANUAL_PROPERTY_FIELD':
      if (action.field === 'name') {
        return { ...state, manualPropertyName: action.value };
      }
      if (action.field === 'location') {
        return { ...state, manualPropertyLocation: action.value };
      }
      if (action.field === 'headline') {
        return { ...state, manualPropertyHeadline: action.value };
      }
      if (action.field === 'description') {
        return { ...state, manualPropertyDescription: action.value };
      }
      return state;
    case 'TOGGLE_HOST_GOAL':
      return {
        ...state,
        hostGoals: state.hostGoals.includes(action.goal)
          ? state.hostGoals.filter(g => g !== action.goal)
          : [...state.hostGoals, action.goal]
      };
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'TOGGLE_TESTING_MODE':
      return { ...state, testingMode: !state.testingMode };
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    case 'RESET':
      return { ...initialState, isDarkMode: state.isDarkMode };
    default:
      return state;
  }
}

// Shared Components
const TopNavigation: React.FC<{
  onHome?: () => void;
  onToggleDark: () => void;
  onToggleTesting: () => void;
  isDarkMode: boolean;
  testingMode: boolean;
  showHome?: boolean;
}> = ({ onHome, onToggleDark, onToggleTesting, isDarkMode, testingMode, showHome = true }) => (
  <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between max-w-[430px] mx-auto top-nav-minimal px-4">
    {/* Left: Home button */}
    {showHome && onHome ? (
      <button
        onClick={onHome}
        className={`top-nav-button ${
          isDarkMode ? 'text-white/70 hover:text-white/90' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Home className="w-5 h-5" />
      </button>
    ) : (
      <div className="w-9 h-9" />
    )}

    {/* Right: Controls */}
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleDark}
        className={`top-nav-button ${
          isDarkMode ? 'text-white/70 hover:text-white/90' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <button
        onClick={onToggleTesting}
        className={`top-nav-test-button font-medium ${testingMode ? 'active' : ''}`}
      >
        Test
      </button>
    </div>
  </div>
);

const ProgressStepper: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex flex-col items-center mb-4">
    {/* Progress Bar Track */}
    <div className="relative w-full h-1 mb-3">
      {/* Background Track */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Progress Fill */}
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${(currentStep / totalSteps) * 100}%`,
          background: 'linear-gradient(90deg, #007AFF 0%, #5856D6 50%, #007AFF 100%)',
          boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)',
        }}
      />
    </div>
  </div>
);

const ContinueButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled = false, isLoading = false, children }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`w-full py-4 text-white font-semibold transition-all duration-200 ${
      disabled || isLoading
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:scale-[1.02] active:scale-[0.98]'
    }`}
    style={{
      background: disabled ? '#4A5568' : '#007AFF',
      borderRadius: '16px',
      fontSize: '16px'
    }}
  >
    {isLoading ? 'Loading...' : children}
  </button>
);

const BackgroundImage: React.FC = () => (
  <div className="absolute inset-0">
    <img
      src={cityBackground}
      alt="City background"
      className="w-full h-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1697092432680-30fffe23ba51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0JTIwZGFyayUyMHVyYmFufGVufDF8fHx8MTc1ODQ0NzQxOXww&ixlib=rb-4.1.0&q=80&w=1080";
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.6) 0%, rgba(0, 0, 0, 0.75) 100%)',
      }}
    />
  </div>
);

const StreamlinedOnboardingFlow: React.FC<StreamlinedOnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Auto-advance from splash after 2 seconds
  useEffect(() => {
    if (state.currentStep === 'splash') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_STEP', step: 'auth' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.currentStep]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (state.isDarkMode) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
    }
  }, [state.isDarkMode]);

  const handleAuthProvider = async (provider: 'apple' | 'google') => {
    dispatch({ type: 'SET_LOADING', loading: true });
    
    try {
      // Here you would integrate with your authentication service
      // For example: await signInWithProvider(provider);
      console.log(`Signing in with ${provider}`);
      
      // Simulate auth delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful auth, proceed to mode selection
      dispatch({ type: 'SET_STEP', step: 'mode-selection' });
    } catch (error) {
      console.error(`Authentication with ${provider} failed:`, error);
      // Handle auth error - you might want to show an error message
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const handleSkipAuth = () => {
    dispatch({ type: 'SET_STEP', step: 'mode-selection' });
  };

  const handleContinue = async () => {
    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      if (state.currentStep === 'mode-selection' && state.mode) {
        if (state.testingMode) {
          await onComplete(state.mode, {
            mode: state.mode,
            tripPurpose: state.tripPurpose,
            preferences: state.preferences,
            propertyProvider: state.propertyProvider,
            hostGoals: state.hostGoals,
            propertyDetails: state.propertyDetails,
          });
        } else {
          dispatch({ type: 'SET_STEP', step: 'quick-setup' });
        }
      } else if (state.currentStep === 'quick-setup') {
        if (state.mode === 'guest' && state.tripPurpose.length > 0) {
          dispatch({ type: 'SET_STEP', step: 'personalization' });
        } else if (state.mode === 'host' && state.propertyProvider) {
          if (state.propertyProvider === 'manual') {
            if (!state.manualPropertyName.trim() || !state.manualPropertyLocation.trim()) {
              throw new Error('Please add a property name and location.');
            }

            const manualProperty = await importPropertyFromSupabase({
              provider: 'manual',
              manualPayload: {
                name: state.manualPropertyName,
                location: state.manualPropertyLocation,
                headline: state.manualPropertyHeadline || undefined,
                description: state.manualPropertyDescription || undefined,
              },
            });

            dispatch({ type: 'SET_PROPERTY_DETAILS', details: manualProperty });
            dispatch({ type: 'SET_PROPERTY_IMPORT_STATUS', status: 'success', error: null });
            dispatch({ type: 'SET_STEP', step: 'personalization' });
          } else if (state.propertyUrl) {
            dispatch({ type: 'SET_PROPERTY_IMPORT_STATUS', status: 'loading' });

            const importedProperty = await importPropertyFromSupabase({
              provider: state.propertyProvider,
              url: state.propertyUrl,
            });

            dispatch({ type: 'SET_PROPERTY_DETAILS', details: importedProperty });
            dispatch({ type: 'SET_PROPERTY_IMPORT_STATUS', status: 'success' });
            dispatch({ type: 'SET_STEP', step: 'personalization' });
          } else {
            throw new Error('Please provide the listing URL.');
          }
        }
      } else if (state.currentStep === 'personalization') {
        if (state.mode === 'guest' && state.preferences.length > 0) {
          dispatch({ type: 'SET_STEP', step: 'completion' });
        } else if (state.mode === 'host' && state.hostGoals.length > 0) {
          dispatch({ type: 'SET_STEP', step: 'completion' });
        }
      } else if (state.currentStep === 'completion' && state.mode) {
        await onComplete(state.mode, {
          mode: state.mode,
          tripPurpose: state.tripPurpose,
          preferences: state.preferences,
          propertyProvider: state.propertyProvider,
          hostGoals: state.hostGoals,
          propertyDetails: state.propertyDetails,
        });
      }
    } catch (error) {
      console.error('Error in onboarding flow:', error);
      if (state.mode === 'host' && state.currentStep === 'quick-setup') {
        dispatch({
          type: 'SET_PROPERTY_IMPORT_STATUS',
          status: 'error',
          error: error instanceof Error ? error.message : 'Something went wrong',
        });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const handleHome = () => {
    dispatch({ type: 'RESET' });
  };

  const canContinue = () => {
    switch (state.currentStep) {
      case 'mode-selection':
        return state.mode !== null;
      case 'quick-setup':
        if (state.mode === 'guest') {
          return state.tripPurpose.length > 0;
        }

        if (!state.propertyProvider) {
          return false;
        }

        if (state.propertyProvider === 'manual') {
          return (
            state.manualPropertyName.trim().length > 0 &&
            state.manualPropertyLocation.trim().length > 0
          );
        }

        return state.propertyUrl.trim().length > 0;
      case 'personalization':
        return state.mode === 'guest'
          ? state.preferences.length > 0
          : state.hostGoals.length > 0;
      default:
        return true;
    }
  };

  // STEP 1: Splash Screen
  if (state.currentStep === 'splash') {
    return (
      <div
        className="min-h-screen w-full max-w-[430px] mx-auto relative overflow-hidden cursor-pointer"
        onClick={() => dispatch({ type: 'SET_STEP', step: 'auth' })}
      >
        <BackgroundImage />

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5">
          {/* App Logo with Glow Effect */}
          <div className="relative mb-12">
            <div
              className="w-48 h-48 flex items-center justify-center animate-fade-in logo-glow-animation"
              style={{
                transform: 'perspective(1000px) rotateX(5deg)',
              }}
            >
              <img
                src={goldenCompassImage}
                alt="Golden Compass"
                className="w-full h-full object-contain"
                style={{
                  filter: 'brightness(1.1) saturate(1.1)',
                }}
              />
            </div>
          </div>

          {/* Brand Title */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
            <h1
              className="font-bold mb-3"
              style={{
                fontSize: '36px',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Stay<span style={{ color: '#3b82f6' }}>Wise</span>
            </h1>
            <p
              className="text-white/80 font-medium"
              style={{
                fontSize: '16px',
                lineHeight: '1.4',
                letterSpacing: '0.5px'
              }}
            >
              Your Personal Travel Guide
            </p>
          </div>

          {/* Subtle tap instruction */}
          <div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-fade-in"
            style={{ animationDelay: '1000ms' }}
          >
            <p className="text-white/50 text-sm text-center">
              Tap anywhere to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AUTH STEP: Authentication
  if (state.currentStep === 'auth') {
    return (
      <StandardizedBackground backgroundImage="figma:asset/fa848992fc2984a3be0e5aa31c3d3c024ea936c0.png">
        {/* Content */}
        <div className="flex flex-col" style={{ paddingTop: '88px', paddingBottom: '24px' }}>
          {/* Standardized Compass */}
          <div className="flex justify-center mb-8">
            <StandardizedCompass size="large" showGlow={true} />
          </div>

          {/* Standardized Title */}
          <div className="mb-12 px-5">
            <StandardizedTitle
              title="Welcome to StayWise"
              subtitle="Sign in to get started with your personalized travel experience"
              variant="hero"
            />
          </div>

          {/* Auth buttons */}
          <div className="flex-1 flex flex-col justify-center px-5">
            <div className="space-y-4 mb-8">
              {/* Sign in with Apple */}
              <button
                onClick={() => handleAuthProvider('apple')}
                disabled={state.loading}
                className="w-full glass-card rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <AppleIcon className="w-6 h-6 text-white" />
                  <span className="font-semibold text-white text-lg">
                    Continue with Apple
                  </span>
                </div>
              </button>

              {/* Sign in with Google */}
              <button
                onClick={() => handleAuthProvider('google')}
                disabled={state.loading}
                className="w-full glass-card rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.95)'
                }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <GoogleIcon className="w-6 h-6" />
                  <span className="font-semibold text-gray-900 text-lg">
                    Continue with Google
                  </span>
                </div>
              </button>
            </div>

            {/* Skip option */}
            <div className="text-center">
              <button
                onClick={handleSkipAuth}
                disabled={state.loading}
                className="text-white/70 hover:text-white/90 transition-colors duration-200 disabled:opacity-50"
                style={{ fontSize: '14px' }}
              >
                Continue without signing in
              </button>
            </div>
          </div>

          {/* Loading indicator */}
          {state.loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </StandardizedBackground>
    );
  }

  // STEP 2: Mode Selection
  if (state.currentStep === 'mode-selection') {
    return (
      <div className="min-h-screen w-full max-w-[430px] mx-auto relative overflow-hidden">
        <BackgroundImage />

        <TopNavigation
          onHome={handleHome}
          onToggleDark={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          onToggleTesting={() => dispatch({ type: 'TOGGLE_TESTING_MODE' })}
          isDarkMode={state.isDarkMode}
          testingMode={state.testingMode}
        />

        <div className="relative z-10 min-h-screen flex flex-col" style={{ paddingTop: '72px', paddingBottom: '24px' }}>
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Smaller Logo */}
            <div className="relative mb-8">
              <div
                className="w-20 h-20 flex items-center justify-center"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255, 149, 0, 0.4))',
                  transform: 'perspective(1000px) rotateX(3deg)',
                }}
              >
                <img
                  src={goldenCompassImage}
                  alt="Golden Compass"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h1
                className="font-bold mb-2"
                style={{
                  fontSize: '28px',
                  lineHeight: '1.2',
                  background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Stay<span style={{ color: '#3b82f6' }}>Wise</span>
              </h1>
              <p className="text-white/70 font-medium" style={{ fontSize: '15px', lineHeight: '1.5' }}>
                Your Personal Travel Guide
              </p>
            </div>

            {/* Mode Cards */}
            <div className="w-full space-y-4 px-5">
              <button
                onClick={() => dispatch({ type: 'SET_MODE', mode: 'guest' })}
                className={`w-full glass-card rounded-2xl p-5 transition-all duration-300 ${
                  state.mode === 'guest' ? 'mode-picker-selected scale-105' : ''
                }`}
                style={{
                  border: state.mode === 'guest'
                    ? '2px solid rgba(59, 130, 246, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(59, 130, 246, 0.2)', backdropFilter: 'blur(8px)' }}
                  >
                    <Luggage className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-white text-lg mb-1">Guest Mode</h3>
                    <p className="text-white/70 text-sm">Discover your stay, guides & local tips.</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => dispatch({ type: 'SET_MODE', mode: 'host' })}
                className={`w-full glass-card rounded-2xl p-5 transition-all duration-300 ${
                  state.mode === 'host' ? 'mode-picker-selected scale-105' : ''
                }`}
                style={{
                  border: state.mode === 'host'
                    ? '2px solid rgba(255, 149, 0, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255, 149, 0, 0.2)', backdropFilter: 'blur(8px)' }}
                  >
                    <KeyRound className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-white text-lg mb-1">Host Mode</h3>
                    <p className="text-white/70 text-sm">Manage your property & guests.</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {state.mode && (
            <div className="px-5 mt-8">
              <ContinueButton
                onClick={handleContinue}
                isLoading={state.isLoading}
              >
                {state.testingMode ? 'Skip to App' : 'Continue'}
              </ContinueButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP 3: Quick Setup
  if (state.currentStep === 'quick-setup') {
    const isGuest = state.mode === 'guest';

    if (isGuest) {
      const tripOptions = [
        { id: 'city-break', icon: <Building2 className="w-5 h-5" />, text: 'City Break' },
        { id: 'foodie', icon: <Utensils className="w-5 h-5" />, text: 'Foodie Adventure' },
        { id: 'relax', icon: <Palmtree className="w-5 h-5" />, text: 'Relax & Escape' },
        { id: 'culture', icon: <Landmark className="w-5 h-5" />, text: 'Culture & History' },
        { id: 'nightlife', icon: <Music4 className="w-5 h-5" />, text: 'Nightlife' },
        { id: 'group', icon: <Users className="w-5 h-5" />, text: 'Group Travel' }
      ];

      return (
        <div className="min-h-screen w-full max-w-[430px] mx-auto relative overflow-hidden">
          <BackgroundImage />

          <TopNavigation
            onHome={handleHome}
            onToggleDark={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            onToggleTesting={() => dispatch({ type: 'TOGGLE_TESTING_MODE' })}
            isDarkMode={state.isDarkMode}
            testingMode={state.testingMode}
          />

          <div className="relative z-10 min-h-screen flex flex-col" style={{ paddingTop: '72px' }}>
            <div className="text-center px-5 py-8">
              <h1 className="font-bold text-white mb-2" style={{ fontSize: '28px', lineHeight: '1.2' }}>
                What brings you here?
              </h1>
              <p className="text-white/70" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                Select all that apply to personalize your guide
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center px-5">
              <div className="grid grid-cols-2 gap-4">
                {tripOptions.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => dispatch({ type: 'TOGGLE_TRIP_PURPOSE', purpose: option.id })}
                    className={`glass-card rounded-2xl p-4 transition-all duration-300 animate-rise-in opacity-0 ${
                      state.tripPurpose.includes(option.id)
                        ? 'bg-blue-500/20 border-blue-400/50 scale-105'
                        : ''
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards',
                      minHeight: '100px'
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                      <div className="text-blue-400">
                        {option.icon}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 pb-6">
              <ProgressStepper currentStep={2} totalSteps={4} />
              <ContinueButton
                onClick={handleContinue}
                disabled={!canContinue()}
                isLoading={state.isLoading}
              >
                Continue
              </ContinueButton>
            </div>
          </div>
        </div>
      );
    } else {
      // Host Property Import
      const providers = [
        { id: 'airbnb', name: 'Airbnb', icon: <Home className="w-6 h-6" />, subtitle: 'Import from Airbnb' },
        { id: 'vrbo', name: 'Vrbo', icon: <Building2 className="w-6 h-6" />, subtitle: 'Import from Vrbo' },
        { id: 'booking', name: 'Booking.com', icon: <Hotel className="w-6 h-6" />, subtitle: 'Import from Booking.com' },
        { id: 'manual', name: 'Manual Entry', icon: <FilePlus className="w-6 h-6" />, subtitle: 'Enter details manually' }
      ];

      return (
        <div className="min-h-screen w-full max-w-[430px] mx-auto relative overflow-hidden">
          <BackgroundImage />

          <TopNavigation
            onHome={handleHome}
            onToggleDark={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            onToggleTesting={() => dispatch({ type: 'TOGGLE_TESTING_MODE' })}
            isDarkMode={state.isDarkMode}
            testingMode={state.testingMode}
          />

          <div className="relative z-10 min-h-screen flex flex-col" style={{ paddingTop: '72px' }}>
            <div className="text-center px-5 py-8">
              <h1 className="font-bold text-white mb-2" style={{ fontSize: '28px', lineHeight: '1.2' }}>
                Import your property
              </h1>
              <p className="text-white/70" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                Choose where to import your listing from
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center px-5">
              <div className="space-y-4">
                {providers.map((provider, index) => (
                  <button
                    key={provider.id}
                    onClick={() => dispatch({ type: 'SET_PROPERTY_PROVIDER', provider: provider.id })}
                    className={`glass-card rounded-2xl p-5 transition-all duration-300 animate-rise-in opacity-0 ${
                      state.propertyProvider === provider.id ? 'scale-105 border-2 border-white/30' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                        style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)' }}
                      >
                        {provider.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white text-lg mb-1">{provider.name}</h3>
                        <p className="text-white/70 text-sm">{provider.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {state.propertyProvider && state.propertyProvider !== 'manual' && (
                <div className="mt-6 glass-card rounded-2xl p-5 animate-rise-in" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Paste your {providers.find(p => p.id === state.propertyProvider)?.name ?? 'listing'} link
                  </label>
                  <input
                    type="url"
                    value={state.propertyUrl}
                    onChange={(event) => dispatch({ type: 'SET_PROPERTY_URL', url: event.target.value })}
                    placeholder="https://"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                  />
                  <p className="text-xs text-white/60 mt-3">
                    We securely fetch your public listing details via Supabase Edge Functions. Nothing is stored until you confirm.
                  </p>

                  {state.propertyImportStatus === 'loading' && (
                    <p className="text-xs text-blue-200 mt-3">Importing property details...</p>
                  )}

                  {state.propertyImportStatus === 'error' && state.propertyImportError && (
                    <p className="text-xs text-red-300 mt-3">
                      {state.propertyImportError}
                    </p>
                  )}
                </div>
              )}

              {state.propertyProvider === 'manual' && (
                <div className="mt-6 space-y-4 animate-rise-in" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                  <div className="glass-card rounded-2xl p-5">
                    <label className="block text-sm font-medium text-white/80 mb-2">Property name</label>
                    <input
                      type="text"
                      value={state.manualPropertyName}
                      onChange={(event) =>
                        dispatch({ type: 'SET_MANUAL_PROPERTY_FIELD', field: 'name', value: event.target.value })
                      }
                      placeholder="e.g. Skyline Loft Bangkok"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                    />
                  </div>

                  <div className="glass-card rounded-2xl p-5">
                    <label className="block text-sm font-medium text-white/80 mb-2">City or location</label>
                    <input
                      type="text"
                      value={state.manualPropertyLocation}
                      onChange={(event) =>
                        dispatch({ type: 'SET_MANUAL_PROPERTY_FIELD', field: 'location', value: event.target.value })
                      }
                      placeholder="e.g. Sukhumvit, Bangkok"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                    />
                  </div>

                  <div className="glass-card rounded-2xl p-5">
                    <label className="block text-sm font-medium text-white/80 mb-2">Headline (optional)</label>
                    <input
                      type="text"
                      value={state.manualPropertyHeadline}
                      onChange={(event) =>
                        dispatch({ type: 'SET_MANUAL_PROPERTY_FIELD', field: 'headline', value: event.target.value })
                      }
                      placeholder="Highlight the experience"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                    />
                  </div>

                  <div className="glass-card rounded-2xl p-5">
                    <label className="block text-sm font-medium text-white/80 mb-2">Description (optional)</label>
                    <textarea
                      value={state.manualPropertyDescription}
                      onChange={(event) =>
                        dispatch({ type: 'SET_MANUAL_PROPERTY_FIELD', field: 'description', value: event.target.value })
                      }
                      placeholder="Share a short intro for your guests"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 pb-6">
              <ProgressStepper currentStep={2} totalSteps={4} />
              <ContinueButton
                onClick={handleContinue}
                disabled={!canContinue()}
                isLoading={state.isLoading}
              >
                Continue
              </ContinueButton>
            </div>
          </div>
        </div>
      );
    }
  }

  // STEP 4: Personalization
  if (state.currentStep === 'personalization') {
    const isGuest = state.mode === 'guest';

    if (isGuest) {
      const preferenceOptions = [
        { id: 'save-money', icon: <Wallet className="w-5 h-5" />, text: 'Save money' },
        { id: 'premium', icon: <Star className="w-5 h-5" />, text: 'Premium comfort' },
        { id: 'authentic-food', icon: <UtensilsCrossed className="w-5 h-5" />, text: 'Authentic food' },
        { id: 'instagram', icon: <Camera className="w-5 h-5" />, text: 'Instagram moments' },
        { id: 'family', icon: <Users className="w-5 h-5" />, text: 'Family friendly' },
        { id: 'local-culture', icon: <Landmark className="w-5 h-5" />, text: 'Local culture' }
      ];

      return (
        <div className="min-h-screen w-full max-w-[430px] mx-auto relative overflow-hidden">
          <BackgroundImage />

          <TopNavigation
            onHome={handleHome}
            onToggleDark={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            onToggleTesting={() => dispatch({ type: 'TOGGLE_TESTING_MODE' })}
            isDarkMode={state.isDarkMode}
            testingMode={state.testingMode}
          />

          <div className="relative z-10 min-h-screen flex flex-col" style={{ paddingTop: '72px' }}>
            <div className="text-center px-5 py-8">
              <h1 className="font-bold text-white mb-2" style={{ fontSize: '28px', lineHeight: '1.2' }}>
                Personalize your guide
              </h1>
              <p className="text-white/70" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                What matters most during your stay?
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center px-5">
              <div className="grid grid-cols-2 gap-4">
                {preferenceOptions.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => dispatch({ type: 'TOGGLE_PREFERENCE', preference: option.id })}
                    className={`glass-card rounded-2xl p-4 transition-all duration-300 animate-rise-in opacity-0 ${
                      state.preferences.includes(option.id)
                        ? 'bg-blue-500/20 border-blue-400/50 scale-105'
                        : ''
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards',
                      minHeight: '100px'
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                      <div className="text-blue-400" style={{ opacity: 1 }}>
                        {option.icon}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 pb-6">
              <ProgressStepper currentStep={3} totalSteps={4} />
              <ContinueButton
                onClick={handleContinue}
                disabled={!canContinue()}
                isLoading={state.isLoading}
              >
                Complete Setup
              </ContinueButton>
            </div>
          </div>
        </div>
      );
    } else {
      // Host Goals
      const goalOptions = [
        { id: 'revenue', icon: <DollarSign className="w-6 h-6" />, title: 'Increase revenue' },
        { id: 'delight', icon: <Star className="w-6 h-6" />, title: 'Delight guests' },
        { id: 'time', icon: <Clock className="w-6 h-6" />, title: 'Save time' },
        { id: 'insights', icon: <BarChart className="w-6 h-6" />, title: 'Gain insights' }
      ];

      return (
        <div className="min-h-screen w-full max-w-[430px] mx-auto relative overflow-hidden">
          <BackgroundImage />

          <TopNavigation
            onHome={handleHome}
            onToggleDark={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            onToggleTesting={() => dispatch({ type: 'TOGGLE_TESTING_MODE' })}
            isDarkMode={state.isDarkMode}
            testingMode={state.testingMode}
          />

          <div className="relative z-10 min-h-screen flex flex-col" style={{ paddingTop: '72px' }}>
            <div className="text-center px-5 py-8">
              <h1 className="font-bold text-white mb-2" style={{ fontSize: '28px', lineHeight: '1.2' }}>
                What's your priority?
              </h1>
              <p className="text-white/70" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                Choose your main hosting goals
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center px-5">
              <div className="grid grid-cols-2 gap-4">
                {goalOptions.map((goal, index) => (
                  <button
                    key={goal.id}
                    onClick={() => dispatch({ type: 'TOGGLE_HOST_GOAL', goal: goal.id })}
                    className={`glass-card rounded-2xl p-5 transition-all duration-300 animate-rise-in opacity-0 ${
                      state.hostGoals.includes(goal.id)
                        ? 'bg-orange-500/20 border-orange-400/50 scale-105'
                        : ''
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards',
                      minHeight: '120px'
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                      <div className="text-orange-400">
                        {goal.icon}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {goal.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 pb-6">
              <ProgressStepper currentStep={3} totalSteps={4} />
              <ContinueButton
                onClick={handleContinue}
                disabled={!canContinue()}
                isLoading={state.isLoading}
              >
                Complete Setup
              </ContinueButton>
            </div>
          </div>
        </div>
      );
    }
  }

  // STEP 5: Completion
  if (state.currentStep === 'completion') {
    const isGuest = state.mode === 'guest';

    return (
      <div className="min-h-screen w-full max-w-[430px] mx-auto relative overflow-hidden">
        <BackgroundImage />

        <TopNavigation
          onToggleDark={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          onToggleTesting={() => dispatch({ type: 'TOGGLE_TESTING_MODE' })}
          isDarkMode={state.isDarkMode}
          testingMode={state.testingMode}
          showHome={false}
        />

        <div className="relative z-10 min-h-screen flex flex-col" style={{ paddingTop: '72px' }}>
          <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
            {/* Logo */}
            <div className="relative mb-12">
              <div
                className="w-24 h-24 flex items-center justify-center"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
                  transform: 'perspective(1000px) rotateX(3deg)',
                }}
              >
                <img
                  src={goldenCompassImage}
                  alt="Golden Compass"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h1
              className="font-bold mb-3"
              style={{
                fontSize: '32px',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {isGuest ? "Ready to explore" : "Dashboard ready"}
            </h1>

            <p className="text-white/70 mb-12 max-w-sm" style={{ fontSize: '16px', lineHeight: '1.5' }}>
              {isGuest
                ? "Your personalized travel guide awaits. Discover local recommendations tailored just for you."
                : "Start managing your properties and creating exceptional guest experiences."
              }
            </p>
          </div>

          <div className="px-5 pb-6">
            <ProgressStepper currentStep={4} totalSteps={4} />
            <ContinueButton
              onClick={handleContinue}
              isLoading={state.isLoading}
            >
              {isGuest ? 'Explore Guide' : 'Open Dashboard'}
            </ContinueButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StreamlinedOnboardingFlow;
