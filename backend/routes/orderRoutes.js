import express from 'express';
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getSalesReport
} from '../controllers/orderController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyAdmin, getOrders);
router.get('/:id', verifyAdmin, getOrderById);
router.put('/:id/status', verifyAdmin, updateOrderStatus);
router.get('/reports/sales', verifyAdmin, getSalesReport);

export default router;