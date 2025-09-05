import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Loader } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CustomerTypeModal } from '../components/CustomerType/CustomerTypeModal';
import { api, SRI_CITY_PINCODES, CLUB_MINIMUM_QUANTITY } from '../lib/api';
import toast from 'react-hot-toast';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [customerType, setCustomerType] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Sri City fields
    name: '',
    phone: '',
    address: '',
    pincode: '',
    // Club fields
    clubName: '',
    collegeName: '',
    contactPerson: '',
    clubPhone: '',
    clubAddress: ''
  });
  const [errors, setErrors] = useState({});

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const savedCustomerType = localStorage.getItem('customerType');
    if (savedCustomerType) {
      setCustomerType(savedCustomerType);
    } else {
      setShowCustomerModal(true);
    }
  }, [items, navigate]);

  const handleCustomerTypeSelect = (type) => {
    setCustomerType(type);
    localStorage.setItem('customerType', type);
    setShowCustomerModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (customerType === 'sri_city') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit phone number';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      else if (!SRI_CITY_PINCODES.includes(formData.pincode)) newErrors.pincode = 'Invalid Sri City pincode';
    } else {
      if (!formData.clubName.trim()) newErrors.clubName = 'Club name is required';
      if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person name is required';
      if (!formData.clubPhone.trim()) newErrors.clubPhone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(formData.clubPhone)) newErrors.clubPhone = 'Please enter a valid 10-digit phone number';
      if (!formData.clubAddress.trim()) newErrors.clubAddress = 'College address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerType) return;
    if (!validateForm()) return;

    // Additional validation for club orders
    if (customerType === 'university_club' && totalItems < CLUB_MINIMUM_QUANTITY) {
      toast.error(`Club orders require minimum ${CLUB_MINIMUM_QUANTITY} items for free delivery`);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_type: customerType,
        customer_data: customerType === 'sri_city' ? {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode
        } : {
          clubName: formData.clubName,
          collegeName: formData.collegeName,
          contactPerson: formData.contactPerson,
          clubPhone: formData.clubPhone,
          clubAddress: formData.clubAddress
        },
        items: items.map(item => ({
          product_id: item.product._id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total_amount: totalPrice,
        total_quantity: totalItems
      };

      await api.createOrder(orderData);

      // Clear cart and redirect
      clearCart();
      navigate('/thank-you');
      toast.success('Order placed successfully!');

    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error(error.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation for club minimum quantity
  const isClubOrderValid = customerType === 'university_club' ? totalItems >= CLUB_MINIMUM_QUANTITY : true;

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

              <form onSubmit={handleSubmit} className="space-y-6">
                {customerType === 'sri_city' ? (
                  // Sri City Resident Form
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter complete delivery address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Sri City pincode"
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
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
                        name="clubName"
                        value={formData.clubName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name of your club/society"
                      />
                      {errors.clubName && (
                        <p className="mt-1 text-sm text-red-600">{errors.clubName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        College/University Name
                      </label>
                      <input
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name of your institution"
                      />
                      {errors.collegeName && (
                        <p className="mt-1 text-sm text-red-600">{errors.collegeName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name of contact person"
                      />
                      {errors.contactPerson && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="clubPhone"
                        value={formData.clubPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10-digit mobile number"
                      />
                      {errors.clubPhone && (
                        <p className="mt-1 text-sm text-red-600">{errors.clubPhone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        name="clubAddress"
                        value={formData.clubAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Complete college address for delivery"
                      />
                      {errors.clubAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.clubAddress}</p>
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
                  <div key={product._id} className="flex justify-between text-sm">
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