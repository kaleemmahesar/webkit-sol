import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkSubscriptions } from '../store/subscriptionSlice';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import UpgradeModal from '../components/UpgradeModal';

const DashboardPage = () => {
  const { subscriptions, products, loading } = useSelector(state => state.subscriptions);
  const { user, isLoggedIn, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Wait for user data to be available before filtering subscriptions
  const userSubscriptions = isLoggedIn && user?.id && user.id !== 'undefined' && user.id !== 'null' && user.id.trim() !== '' ? 
    subscriptions.filter(sub => {
      const subscriptionUserId = String(sub.userId || sub.user_id || '');
      const currentUserId = String(user.id);
      
      // Ensure proper comparison by trimming whitespace and handling different formats
      return subscriptionUserId.trim() === currentUserId.trim();
    }) : [];

  // Check subscriptions on component mount
  useEffect(() => {
    dispatch(checkSubscriptions());
    
    // Check for upcoming expirations
    userSubscriptions.forEach(subscription => {
      if (subscription.status === "Active") {
        const nextBilling = new Date(subscription.nextBillingDate);
        const today = new Date();
        const timeDiff = nextBilling.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff <= 10 && daysDiff >= 0) {
          toast.warn(`Your ${subscription.product || subscription.plan?.name || 'subscription'} subscription expires in ${daysDiff} days!`, {
            autoClose: 5000,
            hideProgressBar: false,
          });
        }
      }
    });
  }, [dispatch, userSubscriptions]);

  // Format period for display
  const formatPeriod = (period) => {
    switch (period) {
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return period;
    }
  };

  // Handle upgrade plan
  const handleUpgrade = (subscription) => {
    // Find the product associated with this subscription
    const product = products.find(p => p.name === subscription.product);
    
    if (!product) {
      toast.error('Product not found');
      return;
    }
    
    // Navigate to the pricing page for this product
    navigate(`/pricing/${product.id}`);
  };

  // Show upgrade modal
  const showUpgradeModalFor = (subscription) => {
    setSelectedSubscription(subscription);
    setShowUpgradeModal(true);
  };

  // Toggle billing history visibility
  const toggleBillingHistory = () => {
    setShowBillingHistory(!showBillingHistory);
  };

  // Show loading state while waiting for user data
  if (!isLoggedIn || !user) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div>
      {/* Upgrade Modal */}
      {showUpgradeModal && selectedSubscription && (
        <UpgradeModal 
          subscription={selectedSubscription} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      )}
      
      {/* Welcome Section */}
      <div className="bg-[#071846] rounded-xl p-8 text-white mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-xl">Manage your subscriptions and billing information</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-white text-[#071846] px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-[#071846] bg-opacity-10 p-3 rounded-lg mr-4">
              <span className="text-[#071846] text-xl">📋</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold">
                {userSubscriptions.filter(s => s.status === "Active").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-[#DD3E32] bg-opacity-10 p-3 rounded-lg mr-4">
              <span className="text-[#DD3E32] text-xl">💰</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="text-2xl font-bold">
                ${userSubscriptions.reduce((sum, sub) => sum + (sub.plan?.price || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gray-200 p-3 rounded-lg mr-4">
              <span className="text-gray-600 text-xl">📅</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Next Billing</p>
              <p className="text-2xl font-bold">
                {userSubscriptions.length > 0 
                  ? new Date(userSubscriptions[0].nextBillingDate).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Your Subscriptions</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" message="Loading your subscriptions..." />
          </div>
        ) : userSubscriptions.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No subscriptions yet</h3>
            <p className="text-gray-500 mb-6">Get started by exploring our business solutions</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#071846] text-white py-2 px-4 rounded-lg hover:bg-[#0a2263]"
            >
              Browse Solutions
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solution
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userSubscriptions.map((subscription) => {
                  const nextBilling = new Date(subscription.nextBillingDate);
                  const today = new Date();
                  const timeDiff = nextBilling.getTime() - today.getTime();
                  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  
                  // Determine if subscription is expiring soon
                  const isExpiringSoon = subscription.status === "Active" && daysDiff <= 10 && daysDiff >= 0;
                  
                  return (
                    <tr key={subscription.id} className={isExpiringSoon ? "bg-yellow-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#071846] bg-opacity-10 rounded-lg flex items-center justify-center">
                            <span className="text-[#071846]">📦</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{subscription.product || subscription.plan?.name || 'Unknown Product'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subscription.plan?.name || 'Unknown Plan'}</div>
                        <div className="text-sm text-gray-500">{subscription.plan?.period ? formatPeriod(subscription.plan.period) : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nextBilling.toLocaleDateString()}
                        {isExpiringSoon && (
                          <div className="text-xs text-orange-500 mt-1 animate-pulse">
                            ({daysDiff} days left)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscription.status === "Active" 
                            ? "bg-green-100 text-green-800" 
                            : subscription.status === "Paused"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => showUpgradeModalFor(subscription)}
                          className="text-[#071846] hover:text-[#0a2263]"
                        >
                          Upgrade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Billing History Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Billing History</h2>
          <button 
            onClick={toggleBillingHistory}
            className="text-[#071846] hover:text-[#0a2263] font-medium"
          >
            {showBillingHistory ? 'Hide' : 'View All'} →
          </button>
        </div>
        
        {showBillingHistory ? (
          <div className="overflow-x-auto">
            <div className="text-center py-8">
              <p className="text-gray-500">No billing history found</p>
            </div>
          </div>
        ) : (
          <div className="px-6 py-4">
            <p className="text-gray-600">
              You have 0 billing records. 
              <button 
                onClick={toggleBillingHistory}
                className="text-[#071846] hover:text-[#0a2263] ml-2 font-medium"
              >
                View all
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is ready to assist you with any questions about your subscriptions.
          </p>
          <button className="text-[#071846] font-medium hover:text-[#0a2263]">
            Contact Support →
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Billing History</h3>
          <p className="text-gray-600 mb-4">
            View and download invoices for your past transactions.
          </p>
          <button 
            onClick={toggleBillingHistory}
            className="text-[#071846] font-medium hover:text-[#0a2263]"
          >
            {showBillingHistory ? 'Hide Billing History' : 'View Invoices'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;