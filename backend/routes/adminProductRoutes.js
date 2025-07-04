import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from '../controllers/productController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();
const upload = multer({ dest: 'tmp/uploads/' });

// ======== CATEGORY ROUTES ======== 
router.post('/categories', verifyAdmin, upload.single('image'), createCategory);
router.get('/categories', verifyAdmin, getCategories);
router.put('/categories/:id', verifyAdmin, upload.single('image'), updateCategory);
router.delete('/categories/:id', verifyAdmin, deleteCategory);

// ======== PRODUCT ROUTES ======== 
router.post('/', verifyAdmin, upload.array('images', 5), createProduct);
router.get('/', verifyAdmin, getProducts);
router.get('/:id', verifyAdmin, validateObjectId, getProductById);
router.put('/:id', verifyAdmin, upload.array('images', 5), validateObjectId, updateProduct);
router.delete('/:id', verifyAdmin, validateObjectId, deleteProduct);

export default router;