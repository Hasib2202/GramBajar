import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Get all products (public)
// export const getPublicProducts = async (req, res) => {
//   try {
//     const { page = 1, limit = 6, search = '', category } = req.query;
    
//     let query = { isActive: true }; // Only show active products
    
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (category) {
//       query.category = category;
//     }
    
//     const products = await Product.find(query)
//       .populate('category', 'name image')
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .sort({ createdAt: -1 });
    
//     const total = await Product.countDocuments(query);
    
//     res.json({
//       success: true,
//       products,
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit)
//     });
//   } catch (error) {
//     console.error('Get public products error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get products',
//       error: error.message
//     });
//   }
// };

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


// Get all products (public) with enhanced filtering
export const getPublicProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      category, 
      minPrice, 
      maxPrice,
      sort = 'createdAt:desc'
    } = req.query;
    
    let query = { isActive: true }; // Only show active products
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Sorting logic
    const sortOptions = {
      'name:asc': { title: 1 },
      'name:desc': { title: -1 },
      'price:asc': { price: 1 },
      'price:desc': { price: -1 },
      'date:asc': { createdAt: 1 },
      'date:desc': { createdAt: -1 },
      'rating:desc': { rating: -1 }
    };
    
    const sortOrder = sortOptions[sort] || sortOptions['date:desc'];
    
    const products = await Product.find(query)
      .populate('category', 'name image')
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
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