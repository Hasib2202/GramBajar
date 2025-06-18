import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailSender.js';
import passport from 'passport';

// User registration
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered. Please use a different email or login.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate verification token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    try {
      await sendVerificationEmail(email, token);
      res.status(201).json({
        message: 'Registration successful! Please check your email for verification',
        token: token
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(201).json({
        message: 'Registration successful! However, we failed to send the verification email.'
      });
    }
  } catch (error) {
    // Handle duplicate key error separately
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already registered. Please use a different email or login.'
      });
    }

    console.error('Registration error:', error);
    res.status(400).json({ message: 'User registration failed', error: error.message });
  }
};


// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      _id: user._id,
      name: user.name,
      email,
      role: user.role,
      image: user.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add to authController.js
// Reset Password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ 
      message: 'Token and password are required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        message: 'Reset token has expired. Please request a new one.' 
      });
    }
    res.status(400).json({ message: 'Invalid reset token' });
  }
};

// Password reset request
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10m'
    });

    await sendPasswordResetEmail(email, resetToken);
    res.json({ 
      message: 'Password reset email sent',
      resetToken: resetToken // Include the token in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// verify email
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ 
      message: 'Verification token is required',
      solution: `Please use a valid verification link sent to your email`
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        solution: 'Please register again'
      });
    }

    if (user.isVerified) {
      return res.status(200).json({ 
        message: 'Email already verified',
        solution: 'You can login directly'
      });
    }

    user.isVerified = true;
    await user.save();

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL}/auth/login?verification=success`);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        message: 'Verification link has expired',
        solution: 'Request a new verification email'
      });
    }
    
    console.error('Token verification error:', error);
    res.status(400).json({ 
      message: 'Invalid verification token',
      error: error.message 
    });
  }
};

// controllers/authController.js
export const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '1d' 
    });

    await sendVerificationEmail(email, token);
    
    res.json({ message: 'Verification email resent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// controllers/authController.js
export const googleLogin = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: JSON.stringify(req.query) // Preserve any query params
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google-auth-failed` 
  }, (err, user) => {
    if (err || !user) {
      console.error('Google auth failed:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google-auth-failed`);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'lax'
    });

    // Redirect to frontend with success
    const state = req.query.state ? JSON.parse(req.query.state) : {};
    const redirectUrl = state.redirect || process.env.FRONTEND_URL;
    res.redirect(`${redirectUrl}?login=success`);
  })(req, res, next);
};