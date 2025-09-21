// Onboarding Analytics Tracking Utilities

export interface OnboardingEvent {
  event: string;
  step?: number;
  mode?: 'guest' | 'host';
  data?: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

export interface OnboardingMetrics {
  stepCompletionTimes: Record<number, number>;
  abandonnementPoints: Record<number, number>;
  totalTime: number;
  errorCount: number;
  retryCount: number;
  completionRate: number;
}

class OnboardingAnalytics {
  private sessionId: string;
  private startTime: number;
  private stepStartTimes: Record<number, number> = {};
  private events: OnboardingEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  private generateSessionId(): string {
    return `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track onboarding start
  trackStart(mode: 'guest' | 'host') {
    this.trackEvent('onboarding_started', 1, mode, {
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer
    });
  }

  // Track step progression
  trackStepStart(step: number, mode: 'guest' | 'host') {
    this.stepStartTimes[step] = Date.now();
    this.trackEvent('step_started', step, mode);
  }

  trackStepCompleted(step: number, mode: 'guest' | 'host', data?: Record<string, any>) {
    const stepStartTime = this.stepStartTimes[step];
    const timeSpent = stepStartTime ? Date.now() - stepStartTime : 0;

    this.trackEvent('step_completed', step, mode, {
      timeSpent,
      ...data
    });
  }

  // Track user interactions
  trackModeSelection(mode: 'guest' | 'host') {
    this.trackEvent('mode_selected', 1, mode);
  }

  trackQuestionAnswer(questionId: string, answer: string | string[], step: number, mode: 'guest' | 'host') {
    this.trackEvent('question_answered', step, mode, {
      questionId,
      answer: Array.isArray(answer) ? answer.join(',') : answer,
      answerCount: Array.isArray(answer) ? answer.length : 1
    });
  }

  trackBenefitViewed(benefitId: string, timeSpent: number, mode: 'guest' | 'host') {
    this.trackEvent('benefit_viewed', 2, mode, {
      benefitId,
      timeSpent
    });
  }

  // Track errors and issues
  trackError(error: string, step: number, mode?: 'guest' | 'host') {
    this.trackEvent('error_occurred', step, mode, {
      error,
      errorType: 'user_action'
    });
  }

  trackNetworkError(error: string, step: number, mode?: 'guest' | 'host') {
    this.trackEvent('network_error', step, mode, {
      error,
      errorType: 'network'
    });
  }

  trackRetry(step: number, mode?: 'guest' | 'host') {
    this.trackEvent('retry_attempted', step, mode);
  }

  // Track completion
  trackCompletion(mode: 'guest' | 'host', data?: Record<string, any>) {
    const totalTime = Date.now() - this.startTime;
    this.trackEvent('onboarding_completed', 4, mode, {
      totalTime,
      ...data
    });
  }

  trackAbandonment(step: number, mode?: 'guest' | 'host') {
    const totalTime = Date.now() - this.startTime;
    this.trackEvent('onboarding_abandoned', step, mode, {
      totalTime,
      lastActiveStep: step
    });
  }

  // Track testing mode usage
  trackTestingModeEnabled() {
    this.trackEvent('testing_mode_enabled', 1, undefined, {
      environment: process.env.NODE_ENV
    });
  }

  trackTestingModeSkip(mode: 'guest' | 'host') {
    this.trackEvent('testing_mode_skip', 1, mode);
  }

  // Core tracking method
  private trackEvent(event: string, step?: number, mode?: 'guest' | 'host', data?: Record<string, any>) {
    const eventData: OnboardingEvent = {
      event,
      step,
      mode,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.events.push(eventData);

    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(eventData);

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Onboarding Analytics]', eventData);
    }
  }

  private async sendToAnalytics(event: OnboardingEvent) {
    try {
      // Example implementation - replace with your analytics service
      // await fetch('/api/analytics/onboarding', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });

      // For now, store in localStorage for debugging
      const stored = localStorage.getItem('onboarding_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      localStorage.setItem('onboarding_analytics', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Get session metrics
  getSessionMetrics(): OnboardingMetrics {
    const completedSteps = this.events.filter(e => e.event === 'step_completed');
    const errors = this.events.filter(e => e.event.includes('error'));
    const retries = this.events.filter(e => e.event === 'retry_attempted');
    const completion = this.events.find(e => e.event === 'onboarding_completed');

    const stepCompletionTimes: Record<number, number> = {};
    completedSteps.forEach(event => {
      if (event.step && event.data?.timeSpent) {
        stepCompletionTimes[event.step] = event.data.timeSpent;
      }
    });

    return {
      stepCompletionTimes,
      abandonnementPoints: this.getAbandonmentPoints(),
      totalTime: Date.now() - this.startTime,
      errorCount: errors.length,
      retryCount: retries.length,
      completionRate: completion ? 100 : 0
    };
  }

  private getAbandonmentPoints(): Record<number, number> {
    const abandonmentPoints: Record<number, number> = {};
    const stepStarts = this.events.filter(e => e.event === 'step_started');
    const stepCompletions = this.events.filter(e => e.event === 'step_completed');

    stepStarts.forEach(start => {
      if (start.step) {
        const hasCompletion = stepCompletions.some(completion => completion.step === start.step);
        if (!hasCompletion) {
          abandonmentPoints[start.step] = (abandonmentPoints[start.step] || 0) + 1;
        }
      }
    });

    return abandonmentPoints;
  }

  // Export data for analysis
  exportData() {
    return {
      sessionId: this.sessionId,
      events: this.events,
      metrics: this.getSessionMetrics()
    };
  }
}

// Global analytics instance
export const onboardingAnalytics = new OnboardingAnalytics();

// Utility functions for common tracking scenarios
export const trackOnboardingStep = (step: number, mode: 'guest' | 'host', action: 'start' | 'complete', data?: Record<string, any>) => {
  if (action === 'start') {
    onboardingAnalytics.trackStepStart(step, mode);
  } else {
    onboardingAnalytics.trackStepCompleted(step, mode, data);
  }
};

export const trackUserInput = (inputType: string, value: any, step: number, mode: 'guest' | 'host') => {
  onboardingAnalytics.trackEvent(`user_input_${inputType}`, step, mode, {
    value: typeof value === 'object' ? JSON.stringify(value) : value,
    inputType
  });
};

export const trackPerformance = (metric: string, value: number, step?: number) => {
  onboardingAnalytics.trackEvent('performance_metric', step, undefined, {
    metric,
    value,
    userAgent: navigator.userAgent
  });
};

// Hook for React components
export const useOnboardingAnalytics = () => {
  return {
    trackStart: onboardingAnalytics.trackStart.bind(onboardingAnalytics),
    trackStepStart: onboardingAnalytics.trackStepStart.bind(onboardingAnalytics),
    trackStepCompleted: onboardingAnalytics.trackStepCompleted.bind(onboardingAnalytics),
    trackModeSelection: onboardingAnalytics.trackModeSelection.bind(onboardingAnalytics),
    trackQuestionAnswer: onboardingAnalytics.trackQuestionAnswer.bind(onboardingAnalytics),
    trackError: onboardingAnalytics.trackError.bind(onboardingAnalytics),
    trackCompletion: onboardingAnalytics.trackCompletion.bind(onboardingAnalytics),
    trackAbandonment: onboardingAnalytics.trackAbandonment.bind(onboardingAnalytics),
    getMetrics: onboardingAnalytics.getSessionMetrics.bind(onboardingAnalytics),
    exportData: onboardingAnalytics.exportData.bind(onboardingAnalytics)
  };
};