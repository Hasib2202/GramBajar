import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
import validateObjectId from '../middleware/validateObjectId.js';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock, discount } = req.body;
    const images = req.files || [];

    // Validate category
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'grambajar/products',
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
      });
      uploadedImages.push(result.secure_url);
      fs.unlinkSync(image.path);
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      stock,
      images: uploadedImages,
      discount,
      isActive: true
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;

    let query = {};

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
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message
    });
  }
};

// Get single product
export const getProductById = [
  validateObjectId,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('category', 'name image');

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        product
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get product',
        error: error.message
      });
    }
  }
];

// Helper function to extract public ID from Cloudinary URL
function extractPublicId(url) {
  const parts = url.split('/');
  const folder = parts[parts.length - 2];
  const filename = parts[parts.length - 1].split('.')[0];
  return `${folder}/${filename}`;
}

// Update product with proper image handling
export const updateProduct = [
  validateObjectId,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const newImages = req.files || [];

      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Preserve isActive if not provided
      if (updates.isActive === undefined) {
        updates.isActive = existingProduct.isActive;
      }

      // Get images to keep from request
      const keptImages = req.body.images 
        ? JSON.parse(req.body.images)
        : existingProduct.images;

      // Find images to delete
      const imagesToDelete = existingProduct.images.filter(
        img => !keptImages.includes(img)
      );

      // Upload new images
      const uploadedImages = [];
      for (const image of newImages) {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: 'grambajar/products',
          transformation: [{ width: 800, height: 800, crop: 'limit' }]
        });
        uploadedImages.push(result.secure_url);
        fs.unlinkSync(image.path);
      }

      // Combine kept images with new images
      updates.images = [...keptImages, ...uploadedImages];

      // Validate category if changed
      if (updates.category) {
        const categoryExists = await Category.findById(updates.category);
        if (!categoryExists) {
          return res.status(400).json({
            success: false,
            message: 'Invalid category ID'
          });
        }
      }

      // Update the product
      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      }).populate('category', 'name');

      // Delete removed images in background
      if (imagesToDelete.length > 0) {
        (async () => {
          for (const imgUrl of imagesToDelete) {
            try {
              const publicId = extractPublicId(imgUrl);
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.error('Error deleting old image:', err);
            }
          }
        })();
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  }
];
// Delete product
export const deleteProduct = [
  validateObjectId,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Delete images from Cloudinary
      for (const imageUrl of product.images) {
        const pathParts = imageUrl.split('/');
        const folder = pathParts[pathParts.length - 2];
        const filename = pathParts[pathParts.length - 1].split('.')[0];
        const publicId = `${folder}/${filename}`;

        await cloudinary.uploader.destroy(publicId);
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      });
    }
  }
];

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file;

    // Check if category exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'grambajar/categories',
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(image.path);
    }

    const newCategory = new Category({ name, image: imageUrl });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
};

// Update category (fixed image deletion)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    let imageUrl = category.image;
    if (image) {
      // Delete old image if exists
      if (category.image) {
        const pathParts = category.image.split('/');
        const folder = pathParts[pathParts.length - 2];
        const filename = pathParts[pathParts.length - 1].split('.')[0];
        const publicId = `${folder}/${filename}`;
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'grambajar/categories',
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(image.path);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image: imageUrl },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Delete image from Cloudinary
    if (category.image) {
      const pathParts = category.image.split('/');
      const folder = pathParts[pathParts.length - 2];
      const filename = pathParts[pathParts.length - 1].split('.')[0];
      const publicId = `${folder}/${filename}`;
      await cloudinary.uploader.destroy(publicId);
    }

    // Remove category from products
    await Product.updateMany(
      { category: category._id },
      { $unset: { category: "" } }
    );

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};