// src/lib/api/orderApi.js
import { getToken } from '@/src/utils/auth';
import axios from 'axios';

// ... existing code ...

// Create order with authentication
export const createOrder = async (orderData) => {
  try {
    const token = getToken(); // Get JWT token from storage
    const response = await axios.post(`${API_BASE}/api/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.order;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

// Similarly update other functions to include authorization header