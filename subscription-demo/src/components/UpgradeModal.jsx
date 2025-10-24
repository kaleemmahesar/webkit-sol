import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPlan } from '../store/subscriptionSlice';
import { toast } from 'react-toastify';

const UpgradeModal = ({ subscription, onClose }) => {
  const { products } = useSelector(state => state.subscriptions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Find the product associated with this subscription
  const product = products.find(p => p.name === subscription.product);
  
  if (!product) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Error</h3>
          <p className="text-gray-600 mb-6">Product not found</p>
          <button
            onClick={onClose}
            className="bg-[#071846] text-white px-4 py-2 rounded-lg hover:bg-[#0a2263]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Filter out the current plan
  const upgradePlans = product.plans.filter(plan => plan.id !== subscription.plan.id);

  // Calculate upgrade cost difference
  const calculateUpgradeInfo = (currentPlan, newPlan) => {
    // Calculate annualized costs for comparison
    let currentAnnualCost, newAnnualCost;
    
    switch (currentPlan.period) {
      case 'monthly':
        currentAnnualCost = currentPlan.price * 12;
        break;
      case 'quarterly':
        currentAnnualCost = currentPlan.price * 4;
        break;
      case 'yearly':
        currentAnnualCost = currentPlan.price;
        break;
      default:
        currentAnnualCost = currentPlan.price * 12;
    }
    
    switch (newPlan.period) {
      case 'monthly':
        newAnnualCost = newPlan.price * 12;
        break;
      case 'quarterly':
        newAnnualCost = newPlan.price * 4;
        break;
      case 'yearly':
        newAnnualCost = newPlan.price;
        break;
      default:
        newAnnualCost = newPlan.price * 12;
    }
    
    // Return the difference (savings if negative)
    const costDifference = newAnnualCost - currentAnnualCost;
    
    return {
      costDifference,
      savings: costDifference < 0 ? Math.abs(costDifference) : 0,
      additionalCost: costDifference > 0 ? costDifference : 0,
      currentAnnualCost,
      newAnnualCost
    };
  };

  // Handle plan selection for upgrade
  const handleSelectPlan = (plan) => {
    dispatch(selectPlan(plan));
    navigate(`/checkout`);
    onClose();
    toast.info(`Upgrading to ${plan.name} plan`, {
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  // Format period for display
  const formatPeriod = (period) => {
    switch (period) {
      case 'monthly': return 'per month';
      case 'quarterly': return 'per quarter';
      case 'yearly': return 'per year';
      default: return period;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upgrade {subscription.product}</h2>
            <p className="text-gray-600">Current plan: {subscription.plan.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {upgradePlans.map((plan) => {
            const upgradeInfo = calculateUpgradeInfo(subscription.plan, plan);
            
            return (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#071846] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-2xl font-bold text-[#071846]">${plan.price}<span className="text-sm font-normal text-gray-600">/{formatPeriod(plan.period)}</span></p>
                  </div>
                  {upgradeInfo.savings > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      Save ${upgradeInfo.savings.toFixed(2)}/yr
                    </span>
                  )}
                </div>
                
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Annual comparison:</div>
                  <div className="flex justify-between text-sm">
                    <span>Current ({subscription.plan.name}):</span>
                    <span>${upgradeInfo.currentAnnualCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>{plan.name}:</span>
                    <span>${upgradeInfo.newAnnualCost.toFixed(2)}</span>
                  </div>
                  {upgradeInfo.savings > 0 ? (
                    <div className="flex justify-between text-sm text-green-600 mt-1">
                      <span>You save:</span>
                      <span>${upgradeInfo.savings.toFixed(2)}/year</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm text-red-600 mt-1">
                      <span>Additional cost:</span>
                      <span>${upgradeInfo.additionalCost.toFixed(2)}/year</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full bg-[#071846] text-white py-2 rounded-lg hover:bg-[#0a2263] transition-colors"
                >
                  Upgrade to {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex">
            <span className="text-blue-500 mr-2">ℹ️</span>
            <p className="text-sm text-blue-700">
              When upgrading, you'll be charged a prorated amount based on the remaining time in your current billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;