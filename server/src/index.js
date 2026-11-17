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

// 2. CORS Handling
const allowedOrigins = ['https://repo-roast-ai.vercel.app', 'http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));
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

// Make a dying process visible in the host's logs. Without these, an
// out-of-memory exit or an uncaught error just cuts the response stream with
// nothing to read afterwards.
const rssMb = () => Math.round(process.memoryUsage().rss / 1024 / 1024);
process.on('uncaughtException', (err) => {
  console.error(`[Process] uncaughtException (rss ${rssMb()}MB):`, err?.stack || err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error(`[Process] unhandledRejection (rss ${rssMb()}MB):`, reason?.stack || reason);
  process.exit(1);
});
process.on('SIGTERM', () => {
  console.error(`[Process] SIGTERM received, the host is stopping this instance (rss ${rssMb()}MB)`);
  process.exit(0);
});
process.on('exit', (code) => {
  console.error(`[Process] exiting with code ${code} (rss ${rssMb()}MB)`);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
