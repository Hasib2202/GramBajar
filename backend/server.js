import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import passport from 'passport';
import configurePassport from './config/passport.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Location'] // Expose redirect headers
}));
app.use(express.json());
app.use(cookieParser());

// Passport configuration
configurePassport();
app.use(passport.initialize());

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/', urlRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Google Callback: ${process.env.BACKEND_URL}/api/auth/google/callback`);
});