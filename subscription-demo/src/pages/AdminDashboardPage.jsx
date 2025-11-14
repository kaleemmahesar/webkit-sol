import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  pauseSubscription, 
  activateSubscription,
  checkSubscriptions 
} from '../store/subscriptionSlice';
import { deactivateUser, deleteUser } from '../store/authSlice';
import { toast } from 'react-toastify';
import { 
  simulateSubscriptionUpdate, 
  broadcastSubscriptionChange,
  listenForSubscriptionUpdates
} from '../utils/syncUtils';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboardPage = () => {
  const { user, isAdmin } = useSelector(state => state.auth);
  const { subscriptions, loading } = useSelector(state => state.subscriptions);
  const { users } = useSelector(state => state.auth); // Get users from auth slice
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Check subscriptions on component mount
  useEffect(() => {
    dispatch(checkSubscriptions());
  }, [dispatch]);

  // Listen for real-time subscription updates
  useEffect(() => {
    const unsubscribe = listenForSubscriptionUpdates((update) => {
      // Show notification about subscription update
      toast.info(`Subscription ${update.subscriptionId} ${update.changeType}`, {
        autoClose: 3000,
        hideProgressBar: true,
      });
      
      // Re-check subscriptions to update UI
      dispatch(checkSubscriptions());
    });
    
    return unsubscribe;
  }, [dispatch]);

  // Filter subscriptions based on search and filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    // Ensure users array exists before accessing it
    const allUsers = users || [];
    const matchesSearch = sub.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allUsers.find(u => u.id === sub.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || sub.status.toLowerCase() === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Handle pause subscription
  const handlePauseSubscription = (subscriptionId, userId) => {
    dispatch(pauseSubscription(subscriptionId));
    
    // Simulate real-time update
    simulateSubscriptionUpdate(subscriptionId, 'pause', (update) => {
      toast.success('Subscription paused successfully', {
        autoClose: 3000,
        hideProgressBar: true,
      });
      
      // Broadcast change to other clients
      broadcastSubscriptionChange(subscriptionId, 'pause', userId);
    });
  };

  // Handle activate subscription
  const handleActivateSubscription = (subscriptionId, userId) => {
    dispatch(activateSubscription(subscriptionId));
    
    // Simulate real-time update
    simulateSubscriptionUpdate(subscriptionId, 'activate', (update) => {
      toast.success('Subscription activated successfully', {
        autoClose: 3000,
        hideProgressBar: true,
      });
      
      // Broadcast change to other clients
      broadcastSubscriptionChange(subscriptionId, 'activate', userId);
    });
  };

  // Handle renew subscription
  const handleRenewSubscription = (subscription) => {
    // In a real implementation, this would extend the subscription
    toast.info(`Subscription for ${subscription.product} renewed for another ${subscription.plan.period}`, {
      autoClose: 3000,
      hideProgressBar: true,
    });
    
    // Broadcast change to other clients
    broadcastSubscriptionChange(subscription.id, 'renew', subscription.userId);
  };

  // Handle deactivate user
  const handleDeactivateUser = (userId) => {
    dispatch(deactivateUser(userId));
    toast.info('User deactivated successfully', {
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
    toast.info('User deleted successfully', {
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  // Get user by ID
  const getUserById = (userId) => {
    // Ensure users array exists before accessing it
    const allUsers = users || [];
    return allUsers.find(u => u.id === userId);
  };

  // Format period for display
  const formatPeriod = (period) => {
    switch (period) {
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return period;
    }
  };

  // Format status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'Paused':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Paused</span>;
      case 'Inactive':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Format user status badge
  const getUserStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Active</span>;
    }
  };

  if (!isAdmin) {
    return null;
  }

  // Ensure users array exists
  const allUsers = users || [];

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-[#071846] rounded-xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-xl">Manage all user subscriptions and accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-[#071846] bg-opacity-10 p-3 rounded-lg mr-4">
              <span className="text-[#071846] text-xl">👥</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{allUsers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-[#DD3E32] bg-opacity-10 p-3 rounded-lg mr-4">
              <span className="text-[#DD3E32] text-xl">📋</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Subscriptions</p>
              <p className="text-2xl font-bold">{subscriptions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <span className="text-yellow-600 text-xl">⏸️</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Paused Subscriptions</p>
              <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'Paused').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Subscriptions
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product, plan, or user..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
            />
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="w-full bg-[#071846] text-white py-2 px-4 rounded-md hover:bg-[#0a2263]"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">All User Subscriptions</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" message="Loading subscriptions..." />
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📋</span>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No subscriptions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
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
                {filteredSubscriptions.map((subscription) => {
                  const user = getUserById(subscription.userId);
                  const nextBilling = new Date(subscription.nextBillingDate);
                  
                  return (
                    <tr key={subscription.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#071846] bg-opacity-10 rounded-lg flex items-center justify-center">
                            <span className="text-[#071846]">
                              {user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{subscription.product}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subscription.plan.name}</div>
                        <div className="text-sm text-gray-500">{formatPeriod(subscription.plan.period)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nextBilling.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscription.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {subscription.status === "Active" ? (
                          <>
                            <button
                              onClick={() => handlePauseSubscription(subscription.id, subscription.userId)}
                              className="text-yellow-600 hover:text-yellow-900 mr-3"
                            >
                              Pause
                            </button>
                            <button
                              onClick={() => handleRenewSubscription(subscription)}
                              className="text-[#071846] hover:text-[#0a2263]"
                            >
                              Renew
                            </button>
                          </>
                        ) : subscription.status === "Paused" ? (
                          <button
                            onClick={() => handleActivateSubscription(subscription.id, subscription.userId)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateSubscription(subscription.id, subscription.userId)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Management Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriptions
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
              {allUsers.map((user) => {
                const userSubscriptions = subscriptions.filter(sub => sub.userId === user.id);
                const activeSubscriptions = userSubscriptions.filter(sub => sub.status === 'Active').length;
                
                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#071846] bg-opacity-10 rounded-lg flex items-center justify-center">
                          <span className="text-[#071846]">{user.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userSubscriptions.length} ({activeSubscriptions} active)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getUserStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeactivateUser(user.id)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                      >
                        Deactivate
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;