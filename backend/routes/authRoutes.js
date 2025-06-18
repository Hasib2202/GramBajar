import express from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerification,
  googleLogin, 
  googleCallback 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/resend-verification', resendVerification);
router.get('/verify-email', verifyEmail); // Add this route
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

export default router;