import User from '../models/User.js';

// Verify admin role
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized: Admin access required'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Admin-specific error handler
export const adminErrorHandler = (err, req, res, next) => {
  console.error('Admin Error:', err);
  res.status(500).json({
    success: false,
    message: 'Admin operation failed',
    error: err.message
  });
};