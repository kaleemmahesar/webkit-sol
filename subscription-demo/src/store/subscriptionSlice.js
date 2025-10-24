import { createSlice } from '@reduxjs/toolkit';
import { addDays, addMonths, addYears } from '../utils/dateUtils';

const initialState = {
  selectedProduct: null,
  selectedPlan: null,

  // Mock data for software solutions
  products: [
    {
      id: 1,
      name: "Inventory Manager Pro",
      description: "Complete inventory tracking and management solution for small businesses",
      thumbnail: "📦",
      startingPrice: 20,
      plans: [
        {
          id: "basic-monthly",
          name: "Basic",
          price: 20,
          period: "monthly",
          features: [
            "Track up to 500 items",
            "Basic reporting",
            "Email support",
            "Mobile app access"
          ]
        },
        {
          id: "pro-quarterly",
          name: "Pro",
          price: 55,
          period: "quarterly",
          features: [
            "Track up to 2000 items",
            "Advanced reporting",
            "Priority support",
            "Mobile app access",
            "API access"
          ]
        },
        {
          id: "enterprise-yearly",
          name: "Enterprise",
          price: 180,
          period: "yearly",
          features: [
            "Unlimited items",
            "Advanced analytics",
            "24/7 phone support",
            "API access",
            "Custom integrations",
            "Dedicated account manager"
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Customer Relations Hub",
      description: "Manage customer interactions, support tickets, and satisfaction metrics",
      thumbnail: "👥",
      startingPrice: 25,
      plans: [
        {
          id: "starter-monthly",
          name: "Starter",
          price: 25,
          period: "monthly",
          features: [
            "Up to 1000 contacts",
            "Email templates",
            "Basic analytics",
            "Ticket management"
          ]
        },
        {
          id: "business-quarterly",
          name: "Business",
          price: 70,
          period: "quarterly",
          features: [
            "Up to 5000 contacts",
            "Custom email templates",
            "Advanced analytics",
            "Priority ticket management",
            "Live chat support"
          ]
        },
        {
          id: "corporate-yearly",
          name: "Corporate",
          price: 220,
          period: "yearly",
          features: [
            "Unlimited contacts",
            "AI-powered insights",
            "Custom workflows",
            "Dedicated support team",
            "API access",
            "SLA guarantee"
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Payroll Plus",
      description: "Automated payroll processing with tax compliance and employee self-service",
      thumbnail: "💰",
      startingPrice: 30,
      plans: [
        {
          id: "small-monthly",
          name: "Small Biz",
          price: 30,
          period: "monthly",
          features: [
            "Up to 10 employees",
            "Automated payroll",
            "Tax filing assistance",
            "Employee portal"
          ]
        },
        {
          id: "medium-quarterly",
          name: "Medium Biz",
          price: 85,
          period: "quarterly",
          features: [
            "Up to 50 employees",
            "Advanced payroll features",
            "Multi-state tax support",
            "Benefits administration",
            "Time tracking integration"
          ]
        },
        {
          id: "large-yearly",
          name: "Enterprise",
          price: 280,
          period: "yearly",
          features: [
            "Unlimited employees",
            "Global payroll support",
            "Advanced analytics",
            "Dedicated specialist",
            "Compliance monitoring",
            "Custom reporting"
          ]
        }
      ]
    }
  ],
  subscriptions: [
    // Pre-populate with some mock subscriptions for testing
    {
      id: 1,
      userId: 1,
      product: "Inventory Manager Pro",
      plan: {
        id: "pro-quarterly",
        name: "Pro",
        price: 55,
        period: "quarterly",
        features: [
          "Track up to 2000 items",
          "Advanced reporting",
          "Priority support",
          "Mobile app access",
          "API access"
        ]
      },
      startDate: "2025-10-01",
      nextBillingDate: "2025-12-31",
      status: "Active"
    }
  ]
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