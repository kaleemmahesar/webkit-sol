// Utility functions for real-time synchronization

// Simulate real-time sync by periodically checking for updates
export const startRealTimeSync = (dispatch, checkSubscriptions) => {
  // Check for subscription updates every 30 seconds
  const interval = setInterval(() => {
    dispatch(checkSubscriptions());
  }, 30000);
  
  return () => clearInterval(interval);
};

// Simulate WebSocket-like behavior for subscription updates
export const simulateSubscriptionUpdate = (subscriptionId, updateType, callback) => {
  // Simulate network delay
  setTimeout(() => {
    const timestamp = new Date().toISOString();
    const update = {
      subscriptionId,
      updateType,
      timestamp,
      status: updateType === 'pause' ? 'Paused' : 
              updateType === 'activate' ? 'Active' : 
              updateType === 'renew' ? 'Active' : 'Unknown'
    };
    
    callback(update);
  }, Math.random() * 1000 + 500); // Random delay between 500ms and 1500ms
};

// Broadcast subscription changes to all connected clients (simulated)
export const broadcastSubscriptionChange = (subscriptionId, changeType, userId) => {
  // In a real app, this would send the update to a WebSocket server
  // For now, we'll just log it
  console.log(`Subscription ${subscriptionId} ${changeType} for user ${userId}`);
  
  // Emit a custom event that other parts of the app can listen to
  const event = new CustomEvent('subscriptionUpdate', {
    detail: {
      subscriptionId,
      changeType,
      userId,
      timestamp: new Date().toISOString()
    }
  });
  
  window.dispatchEvent(event);
};

// Listen for subscription updates
export const listenForSubscriptionUpdates = (callback) => {
  const handler = (event) => {
    callback(event.detail);
  };
  
  window.addEventListener('subscriptionUpdate', handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('subscriptionUpdate', handler);
  };
};

// Sync user data across tabs/windows
export const syncUserDataAcrossTabs = (callback) => {
  const handler = (event) => {
    if (event.key === 'userDataUpdate') {
      callback(JSON.parse(event.newValue));
    }
  };
  
  window.addEventListener('storage', handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handler);
  };
};

// Notify other tabs of user data changes
export const notifyUserDataChange = (userData) => {
  localStorage.setItem('userDataUpdate', JSON.stringify({
    ...userData,
    timestamp: new Date().toISOString()
  }));
  
  // Remove the item after a short delay to allow for multiple updates
  setTimeout(() => {
    localStorage.removeItem('userDataUpdate');
  }, 100);
};