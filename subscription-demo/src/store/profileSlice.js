import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profiles: [
    // Pre-populate with some mock profiles for testing
    {
      id: 1,
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      company: "Acme Corp",
      phone: "+1 (555) 123-4567",
      address: "123 Business St, Suite 100",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      preferences: {
        newsletter: true,
        productUpdates: true,
        marketingEmails: false
      }
    },
    {
      id: 2,
      userId: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      company: "Globex Inc",
      phone: "+1 (555) 987-6543",
      address: "456 Enterprise Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
      preferences: {
        newsletter: true,
        productUpdates: false,
        marketingEmails: true
      }
    }
  ]
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      const { userId, profileData } = action.payload;
      const profileIndex = state.profiles.findIndex(p => p.userId === userId);
      
      if (profileIndex !== -1) {
        state.profiles[profileIndex] = {
          ...state.profiles[profileIndex],
          ...profileData
        };
      } else {
        state.profiles.push({
          id: state.profiles.length + 1,
          userId,
          ...profileData
        });
      }
    },
    updatePreferences: (state, action) => {
      const { userId, preferences } = action.payload;
      const profile = state.profiles.find(p => p.userId === userId);
      
      if (profile) {
        profile.preferences = {
          ...profile.preferences,
          ...preferences
        };
      }
    }
  },
});

export const { updateProfile, updatePreferences } = profileSlice.actions;

export default profileSlice.reducer;