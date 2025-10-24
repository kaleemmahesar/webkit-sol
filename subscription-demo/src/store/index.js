import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import subscriptionSlice from './subscriptionSlice';
import billingSlice from './billingSlice';
import profileSlice from './profileSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    subscriptions: subscriptionSlice,
    billing: billingSlice,
    profile: profileSlice,
  },
});

export default store;