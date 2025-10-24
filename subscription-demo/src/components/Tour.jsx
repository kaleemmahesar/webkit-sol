import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { 
  getUserOnboardingStatus, 
  markTourAsSeen, 
  setCurrentOnboardingStep,
  ONBOARDING_STEPS
} from '../utils/onboarding';

const Tour = ({ children }) => {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  const { isLoggedIn } = useSelector(state => state.auth);
  
  const tourSteps = [
    {
      target: 'body',
      title: 'Welcome to Business Solutions!',
      content: 'Let us guide you through our platform to help you get the most out of our business software solutions.',
      placement: 'center'
    },
    {
      target: '.nav-home',
      title: 'Navigation',
      content: 'Use the navigation bar to move between different sections of our platform.',
      placement: 'bottom'
    },
    {
      target: '.solutions-grid',
      title: 'Browse Solutions',
      content: 'Explore our business software solutions. Each card represents a different tool to help your business.',
      placement: 'bottom'
    },
    {
      target: '.view-pricing-btn',
      title: 'View Pricing',
      content: 'Click on "View Pricing" to see subscription options for each solution.',
      placement: 'bottom'
    }
  ];

  useEffect(() => {
    const onboardingStatus = getUserOnboardingStatus();
    
    // Show tour if user hasn't seen it and is on the home page
    if (!onboardingStatus.hasSeenTour && location.pathname === '/' && isLoggedIn) {
      setTimeout(() => {
        setShowTour(true);
        setCurrentStep(0);
      }, 1000);
    }
  }, [location.pathname, isLoggedIn]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishTour = () => {
    setShowTour(false);
    markTourAsSeen();
  };

  const skipTour = () => {
    setShowTour(false);
    markTourAsSeen();
  };

  if (!showTour) {
    return children;
  }

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {children}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{currentTourStep.title}</h3>
          <p className="text-gray-600 mb-6">{currentTourStep.content}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentStep + 1} of {tourSteps.length}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={skipTour}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Skip
              </button>
              
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800"
                >
                  Back
                </button>
              )}
              
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tour;