import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts, loadUserSubscriptions } from './store/subscriptionSlice';
import { setAdminStatus } from './store/authSlice';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Tour from './components/Tour';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin, user, token } = useSelector(state => state.auth);

  // Load products when app starts
  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  // Load user subscriptions when a logged-in user's auth state is restored
  useEffect(() => {
    if (isLoggedIn && user && token && user.id && user.id !== 'undefined' && user.id !== 'null' && user.id.trim() !== '') {
      dispatch(loadUserSubscriptions(token));
    }
  }, [dispatch, isLoggedIn, user, token]);

  // Check if user is admin based on email
  useEffect(() => {
    if (isLoggedIn && user && token && user.id && user.id !== 'undefined' && user.id !== 'null' && user.id.trim() !== '') {
      // Check if user is admin (you can customize this logic)
      const isAdminUser = user.email === 'admin@example.com' || 
                         user.email === 'admin@localhost' ||
                         user.email === 'admin' ||
                         user.email.includes('admin');
      dispatch(setAdminStatus(isAdminUser));
    }
  }, [isLoggedIn, user, token, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Tour>
        <Navigation />
        <main className="">
          <div className='container mx-auto px-4 py-8 flex-grow'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing/:productId" element={<PricingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/checkout" element={isLoggedIn ? <CheckoutPage /> : <LoginPage />} />
              <Route path="/dashboard" element={isLoggedIn && !isAdmin ? <DashboardPage /> : isLoggedIn && isAdmin ? <AdminDashboardPage /> : <LoginPage />} />
              <Route path="/profile" element={isLoggedIn && !isAdmin ? <ProfilePage /> : <LoginPage />} />
              <Route path="/admin" element={isLoggedIn && isAdmin ? <AdminDashboardPage /> : <LoginPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </Tour>
    </div>
  );
}

export default App;