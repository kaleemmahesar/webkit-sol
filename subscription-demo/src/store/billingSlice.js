import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  billingHistory: [
    // Mock billing history data
    {
      id: 1,
      userId: 1,
      subscriptionId: 1,
      product: "Inventory Manager Pro",
      plan: "Pro",
      amount: 55,
      date: "2025-09-01",
      status: "Paid",
      invoiceUrl: "#"
    },
    {
      id: 2,
      userId: 1,
      subscriptionId: 1,
      product: "Inventory Manager Pro",
      plan: "Pro",
      amount: 55,
      date: "2025-06-01",
      status: "Paid",
      invoiceUrl: "#"
    },
    {
      id: 3,
      userId: 1,
      subscriptionId: 1,
      product: "Inventory Manager Pro",
      plan: "Pro",
      amount: 55,
      date: "2025-03-01",
      status: "Paid",
      invoiceUrl: "#"
    }
  ]
};

export const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addBillingRecord: (state, action) => {
      state.billingHistory.push(action.payload);
    },
    getUserBillingHistory: (state, action) => {
      return state.billingHistory.filter(record => record.userId === action.payload);
    }
  },
});

export const { addBillingRecord, getUserBillingHistory } = billingSlice.actions;

export default billingSlice.reducer;