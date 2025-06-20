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
  logout
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

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

// Add these routes
router.get('/profileDetails', protect, getUserProfile);
router.put('/password', protect, updatePassword);

router.put('/profile', protect, updateUserProfile);
router.post('/upload', protect, uploadProfileImage);

export default router;