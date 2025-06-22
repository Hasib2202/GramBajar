import express from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerification,
  googleLogin, 
  googleCallback,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  uploadProfileImage,
  logout,
  verifyToken
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import { registerAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/resend-verification', resendVerification);
router.get('/verify-email', verifyEmail); // Add this route
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.post('/logout', logout);
router.get('/profileDetails', protect, getUserProfile);
router.put('/password', protect, updatePassword);
router.put('/profile', protect, updateUserProfile);
router.post('/upload', protect, uploadProfileImage);

router.get('/verify-token', verifyToken); // Add this route
router.post('/register-admin', registerAdmin);

export default router;