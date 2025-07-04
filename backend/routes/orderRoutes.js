// routes/orderRoutes.js
import express from 'express';
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getSalesReport,
  createOrder,
  processPayment
} from '../controllers/orderController.js';
import { verifyUser, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', verifyUser, createOrder);
router.post('/:id/pay', verifyUser, processPayment);

// Admin routes
router.get('/', verifyAdmin, getOrders);
router.get('/:id', verifyAdmin, getOrderById);
router.put('/:id/status', verifyAdmin, updateOrderStatus);
router.get('/reports/sales', verifyAdmin, getSalesReport);

export default router;