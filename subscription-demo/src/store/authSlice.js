import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  isAdmin: false,
  users: [
    // Pre-populate with some mock users for testing
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      status: "active" // Add status field
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      status: "active" // Add status field
    }
  ],
  adminUsers: [
    // Pre-populate with admin users
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "super_admin"
    }
  ]
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      
      // Check regular users first
      const user = state.users.find(u => u.email === email && u.password === password);
      if (user) {
        // Check if user is active
        if (user.status === 'inactive') {
          throw new Error('Account deactivated. Please renew your account or contact admin.');
        }
        
        state.isLoggedIn = true;
        state.user = { id: user.id, name: user.name, email: user.email };
        state.isAdmin = false;
        return state;
      }
      
      // Check admin users
      const admin = state.adminUsers.find(a => a.email === email && a.password === password);
      if (admin) {
        state.isLoggedIn = true;
        state.user = { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
        state.isAdmin = true;
        return state;
      }
      
      // If user doesn't exist, throw error (handled in component)
      throw new Error('Invalid credentials');
    },
    signup: (state, action) => {
      const { name, email, password } = action.payload;
      
      // Check if user already exists (both regular and admin)
      const existingUser = state.users.find(u => u.email === email) || 
                          state.adminUsers.find(a => a.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: state.users.length + 1,
        name,
        email,
        password, // In a real app, this would be hashed
        status: "active" // Add status field
      };
      
      state.users.push(newUser);
      state.isLoggedIn = true;
      state.user = { id: newUser.id, name: newUser.name, email: newUser.email };
      state.isAdmin = false;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isAdmin = false;
    },
    loadUsers: (state, action) => {
      state.users = action.payload;
    },
    deactivateUser: (state, action) => {
      const userId = action.payload;
      const user = state.users.find(u => u.id === userId);
      if (user) {
        user.status = "inactive";
      }
    },
    deleteUser: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter(u => u.id !== userId);
    }
  },
});

export const { login, signup, logout, loadUsers, deactivateUser, deleteUser } = authSlice.actions;

export default authSlice.reducer;