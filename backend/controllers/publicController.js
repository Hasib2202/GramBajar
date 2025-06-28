import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Get all products (public)
// Get all products (public)
export const getPublicProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;
    
    let query = {}; // No filter on isActive

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('category', 'name image')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get public products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message
    });
  }
};


// Get single product (public)
export const getPublicProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name image')
      .where({ isActive: true }); // Only show active products
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not active'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get public product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message
    });
  }
};

// Get all categories (public)
export const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get public categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
};