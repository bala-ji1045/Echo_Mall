import React from 'react';
import { Users, MapPin, X } from 'lucide-react';
import { CustomerType } from '../../types';

interface CustomerTypeModalProps {
  isOpen: boolean;
  onSelect: (type: CustomerType) => void;
  onClose: () => void;
}

export const CustomerTypeModal: React.FC<CustomerTypeModalProps> = ({
  isOpen,
  onSelect,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to EcoProducts! 🌱
          </h2>
          <p className="text-gray-600">
            Please select your customer type to get started with your order
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelect('sri_city')}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                  Sri City Resident
                </h3>
                <p className="text-sm text-gray-600">
                  Free delivery within Sri City area
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelect('university_club')}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                  University/College Club
                </h3>
                <p className="text-sm text-gray-600">
                  Bulk orders (min. 20 items) with free delivery across India
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          You can change this selection later in your cart
        </div>
      </div>
    </div>
  );
};