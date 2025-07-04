// src/lib/api/orderApi.js
import axios from 'axios';

// Use the correct base URL from environment variables
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE}/api/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      }
    });
    return response.data.order;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

// Process payment
export const processPayment = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE}/api/orders/${orderId}/pay`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment processing failed');
  }
};

// Get order details
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE}/api/orders/${orderId}`);
    return response.data.order;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get order details');
  }
};