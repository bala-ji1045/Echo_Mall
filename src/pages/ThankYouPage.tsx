import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, Clock, Phone } from 'lucide-react';

export const ThankYouPage: React.FC = () => {
  useEffect(() => {
    // Clear customer type on order completion to allow fresh selection for next order
    localStorage.removeItem('customerType');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Order! 🎉
            </h1>
            <p className="text-gray-600 text-lg">
              Your order has been successfully placed and received.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">What happens next?</span>
              </div>
              <p className="text-sm text-green-600">
                Our team will contact you within 24 hours to confirm your order details and coordinate payment & delivery.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-blue-700 mb-2">
                <Phone className="h-5 w-5" />
                <span className="font-semibold">Need help?</span>
              </div>
              <p className="text-sm text-blue-600">
                Contact us at <strong>+91 98765 43210</strong> or <strong>orders@ecoproducts.com</strong>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
            
            <Link
              to="/"
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Order placed on {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Thank you for choosing sustainable, eco-friendly products! 🌱
          </p>
        </div>
      </div>
    </div>
  );
};