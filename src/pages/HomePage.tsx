import React, { useState, useEffect } from 'react';
import { Leaf, ShoppingBag, Truck, Star } from 'lucide-react';
import { ProductCard } from '../components/Products/ProductCard';
import { CustomerTypeModal } from '../components/CustomerType/CustomerTypeModal';
import { Product, CustomerType } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);

  useEffect(() => {
    fetchProducts();
    
    // Check if customer type was already selected
    const savedCustomerType = localStorage.getItem('customerType') as CustomerType;
    if (savedCustomerType) {
      setCustomerType(savedCustomerType);
    } else {
      // Show modal after a short delay for better UX
      setTimeout(() => setShowCustomerModal(true), 1000);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerTypeSelect = (type: CustomerType) => {
    setCustomerType(type);
    localStorage.setItem('customerType', type);
    setShowCustomerModal(false);
    toast.success(
      type === 'sri_city' 
        ? 'Great! Free delivery available in Sri City' 
        : 'Perfect! Bulk orders get free delivery across India'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerTypeModal
        isOpen={showCustomerModal}
        onSelect={handleCustomerTypeSelect}
        onClose={() => setShowCustomerModal(false)}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fresh, Organic & Sustainable
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Premium eco-friendly products delivered fresh to your doorstep
            </p>
            
            {customerType && (
              <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-6 py-3">
                {customerType === 'sri_city' ? (
                  <>
                    <Truck className="h-5 w-5" />
                    <span>Free delivery in Sri City</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Bulk orders • Free delivery across India</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Organic</h3>
              <p className="text-gray-600">All products are certified organic and sustainably sourced</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free delivery for Sri City residents and club bulk orders</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Hand-picked products ensuring the highest quality standards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of sustainable, organic products
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">Check back soon for our latest eco-friendly products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};