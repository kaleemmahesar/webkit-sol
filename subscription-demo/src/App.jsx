import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { useSelector } from 'react-redux';

function App() {
  const { isLoggedIn, isAdmin } = useSelector(state => state.auth);

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