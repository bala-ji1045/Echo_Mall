import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MapPin, Users, Loader } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CustomerTypeModal } from '../components/CustomerType/CustomerTypeModal';
import { CustomerType, OrderFormData } from '../types';
import { supabase, SRI_CITY_PINCODES, CLUB_MINIMUM_QUANTITY } from '../lib/supabase';
import toast from 'react-hot-toast';

// Validation schemas
const sriCitySchema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number').required('Phone number is required'),
  address: yup.string().required('Address is required'),
  pincode: yup.string().test('valid-pincode', 'Invalid Sri City pincode', (value) => 
    value ? SRI_CITY_PINCODES.includes(value) : false
  ).required('Pincode is required'),
});

const clubSchema = yup.object({
  clubName: yup.string().required('Club name is required'),
  collegeName: yup.string().required('College name is required'),
  contactPerson: yup.string().required('Contact person name is required'),
  clubPhone: yup.string().matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number').required('Phone number is required'),
  clubAddress: yup.string().required('College address is required'),
});

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const savedCustomerType = localStorage.getItem('customerType') as CustomerType;
    if (savedCustomerType) {
      setCustomerType(savedCustomerType);
    } else {
      setShowCustomerModal(true);
    }
  }, [items, navigate]);

  const schema = customerType === 'sri_city' ? sriCitySchema : clubSchema;
  const { register, handleSubmit, formState: { errors }, watch } = useForm<OrderFormData>({
    resolver: yupResolver(schema),
    defaultValues: { customerType }
  });

  const watchedValues = watch();

  // Validation for club minimum quantity
  const isClubOrderValid = customerType === 'university_club' ? totalItems >= CLUB_MINIMUM_QUANTITY : true;

  const handleCustomerTypeSelect = (type: CustomerType) => {
    setCustomerType(type);
    localStorage.setItem('customerType', type);
    setShowCustomerModal(false);
  };

  const onSubmit = async (formData: OrderFormData) => {
    if (!customerType) return;

    // Additional validation for club orders
    if (customerType === 'university_club' && totalItems < CLUB_MINIMUM_QUANTITY) {
      toast.error(`Club orders require minimum ${CLUB_MINIMUM_QUANTITY} items for free delivery`);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_type: customerType,
        customer_data: formData,
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total_amount: totalPrice,
        total_quantity: totalItems,
        status: 'pending' as const
      };

      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) throw error;

      // Clear cart and redirect
      clearCart();
      navigate('/thank-you');
      toast.success('Order placed successfully!');

    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!customerType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerTypeModal
          isOpen={showCustomerModal}
          onSelect={handleCustomerTypeSelect}
          onClose={() => navigate('/cart')}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              {/* Customer Type Display */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {customerType === 'sri_city' ? (
                    <>
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Sri City Resident</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">University Club</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowCustomerModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Change
                </button>
              </div>

              {/* Club Minimum Quantity Warning */}
              {customerType === 'university_club' && !isClubOrderValid && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-800 font-medium">
                    ⚠️ Club orders require minimum {CLUB_MINIMUM_QUANTITY} items for free delivery
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    Current quantity: {totalItems}. Please add {CLUB_MINIMUM_QUANTITY - totalItems} more items.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {customerType === 'sri_city' ? (
                  // Sri City Resident Form
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        {...register('address')}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter complete delivery address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        {...register('pincode')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Sri City pincode"
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Valid Sri City pincodes: {SRI_CITY_PINCODES.join(', ')}
                      </p>
                    </div>
                  </>
                ) : (
                  // University Club Form
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Club Name
                      </label>
                      <input
                        type="text"
                        {...register('clubName')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name of your club/society"
                      />
                      {errors.clubName && (
                        <p className="mt-1 text-sm text-red-600">{errors.clubName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        College/University Name
                      </label>
                      <input
                        type="text"
                        {...register('collegeName')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name of your institution"
                      />
                      {errors.collegeName && (
                        <p className="mt-1 text-sm text-red-600">{errors.collegeName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        {...register('contactPerson')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name of contact person"
                      />
                      {errors.contactPerson && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register('clubPhone')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10-digit mobile number"
                      />
                      {errors.clubPhone && (
                        <p className="mt-1 text-sm text-red-600">{errors.clubPhone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        {...register('clubAddress')}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Complete college address for delivery"
                      />
                      {errors.clubAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.clubAddress.message}</p>
                      )}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !isClubOrderValid}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <span>Place Order</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-gray-600">Qty: {quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(product.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items ({totalItems})</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 text-center">
                  🚚 Free delivery included • Payment on delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        <CustomerTypeModal
          isOpen={showCustomerModal}
          onSelect={handleCustomerTypeSelect}
          onClose={() => setShowCustomerModal(false)}
        />
      </div>
    </div>
  );
};