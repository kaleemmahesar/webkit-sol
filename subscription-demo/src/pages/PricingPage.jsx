import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectPlan } from '../store/subscriptionSlice';
import { toast } from 'react-toastify';
import { 
  getUserOnboardingStatus, 
  markStepAsCompleted, 
  setCurrentOnboardingStep,
  ONBOARDING_STEPS
} from '../utils/onboarding';
import LoadingSpinner from '../components/LoadingSpinner';

const PricingPage = () => {
  const { productId } = useParams();
  const { products, selectedProduct, loading } = useSelector(state => state.subscriptions);
  const { isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Find the product based on the ID in the URL
  const product = selectedProduct || products.find(p => p.id === parseInt(productId));

  useEffect(() => {
    // Mark onboarding step as completed
    const onboardingStatus = getUserOnboardingStatus();
    if (!onboardingStatus.completedSteps.includes(ONBOARDING_STEPS.SELECT_PLAN)) {
      markStepAsCompleted(ONBOARDING_STEPS.SELECT_PLAN);
      setCurrentOnboardingStep(ONBOARDING_STEPS.CHECKOUT);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" message="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <p className="text-gray-600 mt-2">The requested product could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-[#071846] text-white py-2 px-4 rounded-lg hover:bg-[#0a2263]"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleChoosePlan = (plan) => {
    dispatch(selectPlan(plan));
    
    if (isLoggedIn) {
      navigate('/checkout');
    } else {
      toast.info('Please log in to continue with your purchase', {
        autoClose: 3000,
        hideProgressBar: true,
      });
      navigate('/login');
    }
  };

  // Helper function to format period text
  const formatPeriod = (period) => {
    switch (period) {
      case 'monthly': return 'per month';
      case 'quarterly': return 'per quarter';
      case 'yearly': return 'per year';
      default: return period;
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center text-sm font-medium text-[#071846] hover:text-[#0a2263]"
            >
              Home
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
        <div className="text-gray-600 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {product.plans.map((plan, index) => {
          // Determine card styling based on plan
          let cardStyle = "bg-white border border-gray-200";
          if (index === 1) {
            cardStyle = "bg-gray-50 border-2 border-[#071846] relative";
          }
          
          return (
            <div 
              key={plan.id} 
              className={`${cardStyle} rounded-xl shadow-lg overflow-hidden`}
            >
              {index === 1 && (
                <div className="bg-[#071846] text-white text-xs font-bold px-4 py-1 text-center">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-800">${plan.price}</span>
                  <span className="text-gray-600">/{formatPeriod(plan.period)}</span>
                </div>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleChoosePlan(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                    index === 1 
                      ? "bg-[#071846] text-white hover:bg-[#0a2263]" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPage;