// Utility functions for managing onboarding state

export const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  BROWSE_SOLUTIONS: 'browse_solutions',
  SELECT_PLAN: 'select_plan',
  CHECKOUT: 'checkout',
  DASHBOARD: 'dashboard'
};

export const getUserOnboardingStatus = () => {
  const onboardingStatus = localStorage.getItem('onboarding_status');
  return onboardingStatus ? JSON.parse(onboardingStatus) : {
    completedSteps: [],
    currentStep: ONBOARDING_STEPS.WELCOME,
    hasSeenTour: false
  };
};

export const updateUserOnboardingStatus = (status) => {
  localStorage.setItem('onboarding_status', JSON.stringify(status));
};

export const markStepAsCompleted = (step) => {
  const status = getUserOnboardingStatus();
  if (!status.completedSteps.includes(step)) {
    status.completedSteps.push(step);
  }
  updateUserOnboardingStatus(status);
};

export const setCurrentOnboardingStep = (step) => {
  const status = getUserOnboardingStatus();
  status.currentStep = step;
  updateUserOnboardingStatus(status);
};

export const markTourAsSeen = () => {
  const status = getUserOnboardingStatus();
  status.hasSeenTour = true;
  updateUserOnboardingStatus(status);
};