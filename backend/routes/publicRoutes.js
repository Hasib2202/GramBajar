import express from 'express';
import {
  getPublicProducts,       // Corrected name
  getPublicProductById,    // Corrected name
  getPublicCategories      // Corrected name (was getCategories)
} from '../controllers/publicController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

// Public product routes
router.get('/products', getPublicProducts);
router.get('/products/:id', validateObjectId, getPublicProductById);

// Public category routes
router.get('/categories', getPublicCategories); // Now uses correct function

export default router;