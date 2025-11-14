import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addSubscription, addSubscriptionToAPI } from '../store/subscriptionSlice';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage = () => {
  const { selectedProduct, selectedPlan } = useSelector(state => state.subscriptions);
  const { subscriptions } = useSelector(state => state.subscriptions);
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Redirect to home if no product/plan selected
  if (!selectedProduct || !selectedPlan) {
    navigate('/');
    return null;
  }

  // Validation schema for payment form
  const paymentSchema = Yup.object().shape({
    cardholderName: Yup.string().required('Cardholder name is required'),
    cardNumber: Yup.string()
      .matches(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, 'Invalid card number format')
      .required('Card number is required'),
    expiryDate: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiry date format (MM/YY)')
      .required('Expiry date is required'),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, 'Invalid CVV')
      .required('CVV is required'),
  });

  // Handle coupon application
  const applyCoupon = () => {
    setIsApplyingCoupon(true);
    
    // Simulate API call
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'save10') {
        setDiscount(10);
        toast.success('Coupon applied! 10% discount added.', {
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else if (couponCode.toLowerCase() === 'save20') {
        setDiscount(20);
        toast.success('Coupon applied! 20% discount added.', {
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        toast.error('Invalid coupon code.', {
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
      setIsApplyingCoupon(false);
    }, 500);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // In a real app, this would call a payment API
      // For our mock system, we'll just simulate a successful payment
      
      // Add subscription to store
      const subscriptionData = {
        userId: user.id,
        product: selectedProduct.name,
        plan: selectedPlan
      };
      
      dispatch(addSubscription(subscriptionData));
      
      // Also add to WordPress API
      if (token) {
        // Format dates properly
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const nextBillingDate = calculateNextBillingDate(selectedPlan.period);
        
        const apiSubscriptionData = {
          userId: user.id,
          product: selectedProduct.name,
          planId: parseInt(selectedPlan.id, 10) || selectedPlan.id, // Try to convert to integer, fallback to original if NaN
          startDate: startDate,
          nextBillingDate: nextBillingDate
        };
        
        dispatch(addSubscriptionToAPI({ subscriptionData: apiSubscriptionData, token }));
      }
      
      toast.success('Payment successful! Subscription activated.', {
        autoClose: 3000,
        hideProgressBar: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Payment failed. Please try again.', {
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to calculate next billing date
  const calculateNextBillingDate = (period) => {
    const today = new Date();
    
    switch (period) {
      case "monthly":
        const monthly = new Date(today);
        monthly.setMonth(monthly.getMonth() + 1);
        return monthly.toISOString().split('T')[0];
      case "quarterly":
        const quarterly = new Date(today);
        quarterly.setMonth(quarterly.getMonth() + 3);
        return quarterly.toISOString().split('T')[0];
      case "yearly":
        const yearly = new Date(today);
        yearly.setFullYear(yearly.getFullYear() + 1);
        return yearly.toISOString().split('T')[0];
      default:
        const defaultDate = new Date(today);
        defaultDate.setMonth(defaultDate.getMonth() + 1);
        return defaultDate.toISOString().split('T')[0];
    }
  };

  // Format period for display
  const formatPeriod = (period) => {
    switch (period) {
      case 'monthly': return 'per month';
      case 'quarterly': return 'per quarter';
      case 'yearly': return 'per year';
      default: return period;
    }
  };

  // Calculate amounts - ensure they are numbers
  const subtotal = parseFloat(selectedPlan.price) || 0;
  const discountAmount = subtotal * (discount / 100);
  const totalAmount = subtotal - discountAmount;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-[#071846] text-white flex items-center justify-center mx-auto mb-2">1</div>
            <span className="text-sm text-gray-600">Plan</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-1 bg-gray-200">
              <div className="w-1/2 h-1 bg-[#071846]"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-[#071846] text-white flex items-center justify-center mx-auto mb-2">2</div>
            <span className="text-sm text-gray-600">Payment</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-1 bg-gray-200"></div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mx-auto mb-2">3</div>
            <span className="text-sm text-gray-600">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase for {selectedProduct.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
          
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-3xl mr-4">{selectedProduct.thumbnail}</span>
            <div>
              <h3 className="font-bold text-gray-800">{selectedProduct.name}</h3>
              <p className="text-gray-600">{selectedPlan.name} Plan</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{selectedPlan.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Billing Cycle:</span>
              <span className="font-medium capitalize">{formatPeriod(selectedPlan.period)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Features:</span>
              <div className="text-right">
                {selectedPlan.features && selectedPlan.features.length > 0 ? (
                  selectedPlan.features.map((feature, index) => (
                    <div key={index} className="text-gray-600">• {feature}</div>
                  ))
                ) : (
                  <div className="text-gray-600">Basic features included</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)} {formatPeriod(selectedPlan.period)}</span>
            </div>
          </div>
          
          {/* Coupon Section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-medium text-gray-800 mb-3">Apply Coupon</h3>
            <div className="flex">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
              />
              <button
                onClick={applyCoupon}
                disabled={isApplyingCoupon}
                className="bg-[#071846] text-white px-4 py-2 rounded-r-md hover:bg-[#0a2263] disabled:opacity-50 flex items-center"
              >
                {isApplyingCoupon ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Applying...</span>
                  </>
                ) : 'Apply'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Try: SAVE10 or SAVE20
            </p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
          
          <Formik
            initialValues={{
              cardholderName: '',
              cardNumber: '',
              expiryDate: '',
              cvv: '',
            }}
            validationSchema={paymentSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <Field
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                    placeholder="John Doe"
                  />
                  <ErrorMessage name="cardholderName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <Field
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                    placeholder="1234 5678 9012 3456"
                  />
                  <ErrorMessage name="cardNumber" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <Field
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                      placeholder="MM/YY"
                    />
                    <ErrorMessage name="expiryDate" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <Field
                      type="text"
                      id="cvv"
                      name="cvv"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#071846] focus:border-[#071846]"
                      placeholder="123"
                    />
                    <ErrorMessage name="cvv" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex">
                    <span className="text-blue-500 mr-2">ℹ️</span>
                    <p className="text-sm text-blue-700">
                      This is a demo checkout. No real payment will be processed. 
                      Enter any valid format details to proceed.
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#071846] hover:bg-[#0a2263] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#071846] disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : `Pay $${totalAmount.toFixed(2)} ${formatPeriod(selectedPlan.period)}`}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;