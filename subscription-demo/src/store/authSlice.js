import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../utils/api';

// Helper function to get initial state from localStorage
const getInitialState = () => {
  const savedAuth = localStorage.getItem('auth');
  if (savedAuth) {
    try {
      const parsed = JSON.parse(savedAuth);
      // Verify token is still valid (basic check)
      if (parsed.token && parsed.isLoggedIn) {
        // Ensure user object has valid properties
        const validUser = {
          id: String(parsed.user?.id || parsed.user?.ID || ''),
          name: parsed.user?.name || parsed.user?.display_name || parsed.user?.email || '',
          email: parsed.user?.email || parsed.user?.user_email || ''
        };
        
        // Always restore auth state if token exists and isLoggedIn is true
        // This prevents issues with user ID validation
        return {
          ...parsed,
          user: validUser,
          loading: false,
          error: null
        };
      }
    } catch (e) {
      console.error('Error parsing auth state from localStorage:', e);
      // If parsing fails, clear the localStorage
      localStorage.removeItem('auth');
    }
  }
  
  return {
    isLoggedIn: false,
    user: null,
    isAdmin: false,
    token: null,
    users: [
      // Pre-populate with some mock users for testing
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        status: "active"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        status: "active"
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
    ],
    loading: false,
    error: null
  };
};

// Async thunk for user login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await loginUser(email, password);
    return response;
  }
);

// Async thunk for user registration
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await registerUser(userData);
    return response;
  }
);

const initialState = getInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isAdmin = false;
      state.token = null;
      // Clear localStorage on logout
      localStorage.removeItem('auth');
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
    },
    // Add a reducer to update admin status
    setAdminStatus: (state, action) => {
      state.isAdmin = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Use the WordPress user data and JWT token
        state.isLoggedIn = true;
        state.user = { 
          id: String(action.payload.user_id || action.payload.user?.ID || action.payload.ID || action.payload.id || ''), // Keep user ID as string to match API
          name: action.payload.user_display_name || action.payload.user_nicename || action.payload.user?.display_name || action.payload.display_name || action.payload.user_email || action.payload.name || '',
          email: action.payload.user_email || action.payload.user?.user_email || action.payload.email || ''
        };
        // Check if user is admin (WordPress admin check)
        state.isAdmin = action.payload.user_email === 'admin@example.com' || 
                       action.payload.user_email === 'admin@localhost' ||
                       action.payload.user_nicename === 'admin' ||
                       action.payload.email === 'admin@example.com' ||
                       // Check if user has administrator capabilities
                       (action.payload.user_email && action.payload.user_email.includes('admin'));
        state.token = action.payload.token;
        // Save to localStorage
        localStorage.setItem('auth', JSON.stringify({
          isLoggedIn: true,
          user: state.user,
          isAdmin: state.isAdmin,
          token: state.token
        }));
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = { 
          id: String(action.payload.user.id || action.payload.user.ID || action.payload.user.id || ''), // Keep user ID as string to match API
          name: (action.payload.user.first_name && action.payload.user.last_name ? 
                action.payload.user.first_name + ' ' + action.payload.user.last_name : 
                action.payload.user.display_name || action.payload.user.name || '').trim() || action.payload.user.email || '', 
          email: action.payload.user.email || action.payload.user.user_email || ''
        };
        state.isAdmin = false; // New users are not admins by default
        state.token = action.payload.token;
        // Save to localStorage
        localStorage.setItem('auth', JSON.stringify({
          isLoggedIn: true,
          user: state.user,
          isAdmin: state.isAdmin,
          token: state.token
        }));
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout, loadUsers, deactivateUser, deleteUser, setAdminStatus } = authSlice.actions;

export default authSlice.reducer;