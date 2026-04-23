import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import reviewRoutes from './routes/review.js';
import errorHandler from './middleware/errorHandler.js';

// Initialize the Express application
const app = express();

// ==========================================
// Middleware Configuration
// ==========================================

// 1. Security Headers
app.use(helmet());

// 2. CORS Handling
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Body Parsing
app.use(express.json());

// 4. Request Logging
app.use(morgan('dev'));

// ==========================================
// Rate Limiting Configuration
// ==========================================

// Create a limiter specifically for the AI review endpoint to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// ==========================================
// Route Registration
// ==========================================

// Apply the rate limiter ONLY to the /api/review route
app.use('/api/review', apiLimiter, reviewRoutes);

// Detailed health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'RepoRoast API is running.' });
});

// ==========================================
// Error Handling
// ==========================================

// Register Error Handler (must be the VERY LAST middleware)
app.use(errorHandler);

// ==========================================
// Server Startup
// ==========================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
