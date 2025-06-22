import express from 'express';
import { 
  getDashboardStats, 
  getAllUsers,
  updateUserStatus,
  deleteUser
} from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();

// Apply admin middleware to all routes
router.use(verifyAdmin);

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

export default router;