import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export const ProductCard = ({ product }) => {
  const { items, addToCart, updateQuantity } = useCart();
  
  const cartItem = items.find(item => item.product._id === product._id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleIncrement = () => {
    updateQuantity(product._id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(product._id, quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ₹{product.price}
          </span>
          
          <div className="flex items-center space-x-2">
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors group/btn"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="font-medium">Add</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Minus className="h-4 w-4 text-gray-700" />
                </button>
                <span className="w-8 text-center font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};