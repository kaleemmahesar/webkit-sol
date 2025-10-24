import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, updatePreferences } from '../store/profileSlice';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const { profiles } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  
  // Find user profile or create default
  const userProfile = profiles.find(p => p.userId === user?.id) || {
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    company: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    preferences: {
      newsletter: true,
      productUpdates: true,
      marketingEmails: false
    }
  };
  
  const [profileData, setProfileData] = useState(userProfile);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setProfileData({
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [name]: checked
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Update profile
      dispatch(updateProfile({
        userId: user.id,
        profileData: {
          ...profileData,
          email: user.email // Keep email from auth
        }
      }));
      
      // Update preferences
      dispatch(updatePreferences({
        userId: user.id,
        preferences: profileData.preferences
      }));
      
      toast.success('Profile updated successfully!', {
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      toast.error('Failed to update profile. Please try again.', {
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#071846] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-[#071846]">
                  {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-500 text-sm mt-1">{profileData.company || 'Company not set'}</p>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-gray-600">
                <span className="mr-2">📧</span>
                <span>{user?.email}</span>
              </div>
              {profileData.phone && (
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📱</span>
                  <span>{profileData.phone}</span>
                </div>
              )}
              {profileData.company && (
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">🏢</span>
                  <span>{profileData.company}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={profileData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Communication Preferences</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={profileData.preferences.newsletter}
                      onChange={handlePreferenceChange}
                      className="h-4 w-4 text-[#071846] focus:ring-[#071846] border-gray-300 rounded"
                    />
                    <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                      Newsletter
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="productUpdates"
                      name="productUpdates"
                      checked={profileData.preferences.productUpdates}
                      onChange={handlePreferenceChange}
                      className="h-4 w-4 text-[#071846] focus:ring-[#071846] border-gray-300 rounded"
                    />
                    <label htmlFor="productUpdates" className="ml-2 block text-sm text-gray-700">
                      Product updates
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="marketingEmails"
                      name="marketingEmails"
                      checked={profileData.preferences.marketingEmails}
                      onChange={handlePreferenceChange}
                      className="h-4 w-4 text-[#071846] focus:ring-[#071846] border-gray-300 rounded"
                    />
                    <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700">
                      Marketing emails
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#071846] text-white py-2 px-6 rounded-lg hover:bg-[#0a2263] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#071846] disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;