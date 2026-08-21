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
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // console.log(`[CORS DEBUG] Incoming Origin: '${origin}'`);
    
    // Allow requests with no origin (like direct browser visits, curl, or Render health checks)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.error(`[CORS REJECTED] Origin '${origin}' is not in the allowed list!`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 3. Body Parsing - Strictly limit payload size to prevent DoS (repoUrl payload is tiny)
app.use(express.json({ limit: '10kb' }));

// 4. Request Logging
app.use(morgan('dev'));

// ==========================================
// Rate Limiting Configuration
// ==========================================

// Create a limiter specifically for the AI review endpoint to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'RATE_LIMIT'
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
