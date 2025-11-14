import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProduct } from '../store/subscriptionSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getUserOnboardingStatus, 
  markStepAsCompleted, 
  setCurrentOnboardingStep,
  ONBOARDING_STEPS
} from '../utils/onboarding';
import TeamProfiles from '../components/TeamProfiles';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const { products, loading } = useSelector(state => state.subscriptions);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mark onboarding step as completed
    const onboardingStatus = getUserOnboardingStatus();
    if (!onboardingStatus.completedSteps.includes(ONBOARDING_STEPS.BROWSE_SOLUTIONS)) {
      markStepAsCompleted(ONBOARDING_STEPS.BROWSE_SOLUTIONS);
      setCurrentOnboardingStep(ONBOARDING_STEPS.SELECT_PLAN);
    }
  }, []);

  const handleViewPricing = (product) => {
    dispatch(selectProduct(product));
    navigate(`/pricing/${product.id}`);
    toast.info(`Viewing plans for ${product.name}`, {
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* About Us Section */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">About Webkit Solutions</h2>
        <div className="max-w-3xl mx-auto text-gray-600">
          <p className="text-lg">
            Webkit Solutions is a leading provider of business software solutions, helping companies streamline operations and achieve growth through innovative technology.
          </p>
        </div>
      </div>

      {/* Team Profiles Section */}
      <TeamProfiles />

      {/* Solutions Section */}
      <div id="solutions" className="solutions-grid mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Software Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our suite of powerful business tools designed to transform your operations and drive success.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" message="Loading our solutions..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover border border-gray-100 transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4"><img className='h-14 w-14 object-cover rounded-full mr-4' src={product.thumbnail} alt={product.name} /></span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
                  
                  {/* Pricing Information */}
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Starting at</span>
                      <span className="text-2xl font-bold text-[#071846]">${product.startingPrice}<span className="text-sm font-normal text-gray-500">/month</span></span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition duration-300 font-medium"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleViewPricing(product)}
                      className="flex-1 bg-[#071846] text-white py-2 rounded-lg hover:bg-[#0a2263] transition duration-300 font-medium"
                    >
                      View Plans
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features/Why Choose Us Section */}
      <div id="why-choose-us" className="mt-16 bg-gradient-to-br from-[#071846] to-[#0a2263] rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-4">Why Choose Our Solutions?</h2>
        <p className="text-center text-blue-200 mb-12 max-w-2xl mx-auto">
          We provide unmatched value through our innovative approach and commitment to excellence.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-[#DD3E32] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
            <p className="text-blue-100">
              Enterprise-grade security to keep your business data safe and protected with 99.9% uptime guarantee.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-[#DD3E32] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-blue-100">
              Optimized performance with global CDN and edge computing for instant access to your data.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-[#DD3E32] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">🔄</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Integration</h3>
            <p className="text-blue-100">
              Seamlessly connect with 500+ popular business tools through our extensive API library.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-[#DD3E32] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
            <p className="text-blue-100">
              Real-time insights and customizable reports to help you make data-driven decisions.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-[#DD3E32] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">🛠️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
            <p className="text-blue-100">
              Dedicated support team available around the clock to assist with any issues or questions.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
            <div className="bg-[#DD3E32] w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Scalable Solutions</h3>
            <p className="text-blue-100">
              Grow with confidence knowing our solutions can scale with your business needs.
            </p>
          </div>
        </div>
      </div>

      {/* Solution Detail Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-500 mb-4">
                  {selectedProduct.name} Solution Preview
                </div>
                <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-[#071846] text-white py-2 px-6 rounded-lg hover:bg-[#0a2263]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;