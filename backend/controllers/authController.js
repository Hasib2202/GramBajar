import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailSender.js';
import passport from 'passport';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from 'cloudinary';
import { env } from 'process';
import e from 'express';
import dotenv from "dotenv";
dotenv.config();  

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
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    // Determine redirect path based on role
    const redirectPath = user.role === 'Admin' 
      ? '/admin/dashboard' 
      : '/';

    res.json({
      success: true,
      message: 'Login successful',
      token,
      redirectPath, // Add this
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Temporary admin registration endpoint (remove after initial setup)
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  
  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: name, email, password'
    });
  }
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      isVerified: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Admin user created',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin creation failed',
      error: error.message
    });
  }
};

// User registration
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Basic input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

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

// Reset Password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      message: 'Token and password are required'
    });
  }

  // Add password validation
  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters'
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
      success: false,
      message: 'Verification token is required',
      solution: 'Please use the verification link sent to your email'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        solution: 'Please register again'
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email already verified',
        solution: 'You can login directly'
      });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

    user.isVerified = true;
    await user.save();

    // Return success response instead of redirecting
    res.json({
      success: true,
      message: 'Email verified successfully',
      redirect: `${process.env.FRONTEND_URL}/auth/login?verification=success`
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Verification link has expired',
        solution: 'Request a new verification email'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Invalid verification token',
      error: error.message
    });
  }
};

// resend verification email
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

// Google login
export const googleLogin = (req, res, next) => {
  console.log('Initiating Google login with params:', req.query);
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: JSON.stringify(req.query),
    prompt: 'select_account',
    accessType: 'offline'
  })(req, res, next);
};

// Google callback
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google-auth-failed` 
  }, async (err, user) => {
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
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/'
    });

    // Redirect to frontend with user data
    const state = req.query.state ? JSON.parse(req.query.state) : {};
    const redirectUrl = state.redirect || process.env.FRONTEND_URL;
    
    // Add cache busting parameter to profile picture URL
    const cacheBustedProfile = user.profilePicture 
      ? `${user.profilePicture}?${Date.now()}` 
      : '';
    
    res.redirect(
      `${redirectUrl}/login/success?token=${token}&id=${user._id}&name=${encodeURIComponent(user.name)}&email=${user.email}&profilePicture=${encodeURIComponent(cacheBustedProfile)}`
    );
  })(req, res, next);
};


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true
});

// Helper function to upload image to Cloudinary
export async function uploadToCloudinary(filePath, userId) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'grambajar/profile-pictures',
      public_id: `user-${userId}`,
      transformation: [{ width: 400, height: 400, crop: 'fill' }]
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

// Helper function to upload from URL
export async function uploadProfileImageFromURL(url, userId) {
  try {
    const result = await cloudinary.v2.uploader.upload(url, {
      folder: 'grambajar/profile-pictures',
      public_id: `google-${userId}`,
      transformation: [{ width: 400, height: 400, crop: 'fill' }]
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading profile image from URL:', error);
    return null;
  }
}

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'tmp/uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('profileImage');

// Upload or replace profile image
export const uploadProfileImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Upload new image
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'grambajar/profile-pictures',
        public_id: `user-${user._id}-${Date.now()}`,
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
        overwrite: true,
        invalidate: true
      });

      // Determine old public ID (stored or derived)
      let oldPublicId;
      if (user.imagePublicId) {
        oldPublicId = user.imagePublicId;
      } else if (user.image) {
        const match = user.image.match(/grambajar\/profile-pictures\/([^\.]+)/);
        oldPublicId = match ? `grambajar/profile-pictures/${match[1]}` : null;
      }

      // Delete old image if found
      if (oldPublicId) {
        await cloudinary.v2.uploader.destroy(oldPublicId, { invalidate: true });
      }

      // Save new URL and public ID
      user.image = result.secure_url;
      user.imagePublicId = result.public_id;
      await user.save();

      // Clean up local file
      fs.unlinkSync(req.file.path);

      res.json({ success: true, message: 'Profile image updated successfully', image: result.secure_url });
    } catch (error) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      console.error('Profile image upload error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

// Update user profile (name, email, optional image URL)
export const updateUserProfile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const { name, email, imageUrl } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.name = name || user.name;
      user.email = email || user.email;

      // Handle external image URL (e.g., social login)
      if (imageUrl) {
        const urlResult = await uploadProfileImageFromURL(imageUrl, user._id);
        if (urlResult) user.image = urlResult;
      }

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.image,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};