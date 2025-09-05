const API_BASE_URL = 'http://localhost:5000/api';

// Sri City valid pincodes
export const SRI_CITY_PINCODES = [
  '517646', '517645', '517644', '517643', '517642', '517641'
];

// Minimum quantity for university club orders
export const CLUB_MINIMUM_QUANTITY = 20;

// Admin secret key
export const ADMIN_SECRET_KEY = 'sustainable-admin-2025';

// API functions
export const api = {
  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products?key=${ADMIN_SECRET_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}?key=${ADMIN_SECRET_KEY}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}?key=${ADMIN_SECRET_KEY}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  // Orders
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    return response.json();
  },

  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders?key=${ADMIN_SECRET_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Seed data
  seedProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/seed?key=${ADMIN_SECRET_KEY}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to seed products');
    return response.json();
  }
};