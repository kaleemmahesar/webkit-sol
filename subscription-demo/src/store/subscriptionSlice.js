import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchSubscriptions, createSubscription } from '../utils/api';
import { addMonths, addYears } from '../utils/dateUtils';

export const loadProducts = createAsyncThunk(
  'subscriptions/loadProducts',
  async () => {
    const products = await fetchProducts();
    
    // The plans are now embedded in the products, so we don't need to fetch them separately
    return products.map(product => {
      // Ensure each product has plans, use startingPrice if no plans are defined
      let plans = product.plans || [];
      
      // If no plans are defined, create a default plan using the starting price
      if (plans.length === 0 && product.startingPrice > 0) {
        plans = [{
          id: `${product.id}-default`,
          name: 'Standard Plan',
          price: product.startingPrice,
          period: 'monthly',
          features: product.features || []
        }];
      }
      
      // Calculate starting price from plans if not set
      let startingPrice = product.startingPrice;
      if (startingPrice === 0 && plans.length > 0) {
        startingPrice = Math.min(...plans.map(plan => plan.price));
      }
      
      return { ...product, plans, startingPrice };
    });
  }
);

export const loadUserSubscriptions = createAsyncThunk(
  'subscriptions/loadUserSubscriptions',
  async (token) => {
    const subscriptions = await fetchSubscriptions(token);
    return subscriptions;
  }
);

export const addSubscriptionToAPI = createAsyncThunk(
  'subscriptions/addSubscriptionToAPI',
  async ({ subscriptionData, token }) => {
    const subscription = await createSubscription(subscriptionData, token);
    return subscription;
  }
);

const initialState = {
  selectedProduct: null,
  selectedPlan: null,
  products: [],
  subscriptions: [],
  loading: false,
  error: null
};

export const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    selectPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    addSubscription: (state, action) => {
      const newSubscription = {
        id: state.subscriptions.length > 0 ? Math.max(...state.subscriptions.map(s => s.id)) + 1 : 1,
        userId: action.payload.userId,
        product: action.payload.product,
        plan: action.payload.plan,
        startDate: new Date().toISOString().split('T')[0],
        nextBillingDate: calculateNextBillingDate(action.payload.plan.period),
        status: "Active"
      };
      
      state.subscriptions.push(newSubscription);
    },
    checkSubscriptions: (state) => {
      const currentDate = new Date();
      
      state.subscriptions.forEach(subscription => {
        if (subscription.status === "Active") {
          const nextBilling = new Date(subscription.nextBillingDate);
          
          // If billing date has passed, mark as inactive
          if (currentDate > nextBilling) {
            subscription.status = "Inactive";
          }
        }
      });
    },
    pauseSubscription: (state, action) => {
      const subscription = state.subscriptions.find(sub => sub.id === action.payload);
      if (subscription) {
        subscription.status = "Paused";
      }
    },
    activateSubscription: (state, action) => {
      const subscription = state.subscriptions.find(sub => sub.id === action.payload);
      if (subscription) {
        subscription.status = "Active";
        // Reset next billing date when activating
        subscription.nextBillingDate = calculateNextBillingDate(subscription.plan.period);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loadUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(loadUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSubscriptionToAPI.fulfilled, (state, action) => {
        // Handle successful subscription creation
        // The subscription is already added locally in the addSubscription reducer
      });
  },
});

// Helper function to calculate next billing date
function calculateNextBillingDate(period) {
  const today = new Date();
  
  switch (period) {
    case "monthly":
      return addMonths(today, 1).toISOString().split('T')[0];
    case "quarterly":
      return addMonths(today, 3).toISOString().split('T')[0];
    case "yearly":
      return addYears(today, 1).toISOString().split('T')[0];
    default:
      return addMonths(today, 1).toISOString().split('T')[0];
  }
}

export const { selectProduct, selectPlan, addSubscription, checkSubscriptions, pauseSubscription, activateSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;