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
app.set('trust proxy', 1);

// 1. Security Headers
app.use(helmet());

// 2. CORS Handling (Disabled temporarily as requested)
app.use(cors({ origin: '*' }));

// 3. Body Parsing
app.use(express.json({ limit: '10kb' }));

// 4. Request Logging
app.use(morgan('dev'));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too many requests from this IP',
    code: 'RATE_LIMIT'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Route Registration
app.use('/api/review', apiLimiter, reviewRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'RepoRoast API is running.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
