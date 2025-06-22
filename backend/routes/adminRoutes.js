import express from 'express';
import { isAdmin, adminErrorHandler } from '../middleware/adminMiddleware.js';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser
} from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(protect, isAdmin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Apply admin-specific error handling
router.use(adminErrorHandler);

export default router;