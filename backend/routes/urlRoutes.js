// routes/urlRoutes.js
import express from 'express';
import { redirectUrl } from '../controllers/urlController.js';

const router = express.Router();
router.get('/r/:shortId', redirectUrl);

export default router;