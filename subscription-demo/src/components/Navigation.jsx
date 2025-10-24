import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { toast } from 'react-toastify';

const Navigation = () => {
  const { isLoggedIn, user, isAdmin } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!', {
      autoClose: 3000,
      hideProgressBar: true,
    });
    navigate('/');
  };

  // Determine if we should show the back button
  const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard' && location.pathname !== '/admin';

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center nav-home">
              <img 
                src="/webkit-logo.jpg" 
                alt="Webkit Solutions Logo" 
                className="h-10 w-10 mr-3 rounded-lg object-contain"
                style={{ width: '160px', height: 'auto' }}
              />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/" 
                className={`text-[#071846] hover:bg-[#071846] hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium nav-home no-underline ${
                  location.pathname === '/' ? 'bg-[#071846] bg-opacity-10' : ''
                }`}
              >
                Home
              </Link>
              
              {isLoggedIn ? (
                <>
                  {isAdmin ? (
                    <Link 
                      to="/admin" 
                      className={`text-[#071846] hover:bg-[#071846] hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium no-underline ${
                        location.pathname === '/admin' ? 'bg-[#071846] bg-opacity-10' : ''
                      }`}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/dashboard" 
                        className={`text-[#071846] hover:bg-[#071846] hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium no-underline ${
                          location.pathname === '/dashboard' ? 'bg-[#071846] bg-opacity-10' : ''
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className={`text-[#071846] hover:bg-[#071846] hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium no-underline ${
                          location.pathname === '/profile' ? 'bg-[#071846] bg-opacity-10' : ''
                        }`}
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-[#071846] hover:bg-[#071846] hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium no-underline"
                  >
                    Logout
                  </button>
                  <span className="text-[#071846] bg-[#071846] bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium">
                    Welcome, {user?.name}
                    {isAdmin && <span className="ml-2 bg-[#DD3E32] bg-opacity-10 text-[#DD3E32] text-xs px-2 py-1 rounded">Admin</span>}
                  </span>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className={`text-[#071846] hover:bg-[#071846] hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium no-underline ${
                    location.pathname === '/login' ? 'bg-[#071846] bg-opacity-10' : ''
                  }`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          
          {/* Back button for inner pages */}
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="md:hidden text-[#071846] hover:text-gray-700 no-underline"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;