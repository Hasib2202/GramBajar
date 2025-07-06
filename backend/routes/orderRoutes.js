import express from 'express';
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getSalesReport,
  createOrder,
  processPayment,
  getOrderDetails,
  getOrdersByUser,
  getOrderByIdUser
} from '../controllers/orderController.js';
import { verifyUser, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', verifyUser, createOrder);
router.post('/:id/pay', verifyUser, processPayment);
router.get('/user/:id', verifyUser, getOrderDetails); // Changed to /user/:id
router.get('/user/:id/orders', verifyUser, getOrdersByUser); // ← new: list all orders
router.get('/:id', verifyUser, getOrderByIdUser);

// Admin routes (prefixed with /admin)
router.get('/admin', verifyAdmin, getOrders);
router.get('/admin/:id', verifyAdmin, getOrderById);
router.put('/admin/:id/status', verifyAdmin, updateOrderStatus);
router.get('/admin/reports/sales', verifyAdmin, getSalesReport);

export default router;