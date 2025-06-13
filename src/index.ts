import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config, isProduction, isDevelopment } from './config/environment';
// import { config } from './config/database';
// import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import applicationRoutes from './routes/application';
import documentRoutes from './routes/document';
import paymentRoutes from './routes/payment';
import complianceRoutes from './routes/compliance';
import timesheetRoutes from './routes/timesheet';
import advisorRoutes from './routes/advisor';
import reportsRoutes from './routes/reports';

const app = express();
const PORT = config.PORT;

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: isProduction ? true : false,
}));
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}));
app.use(compression());
app.use(limiter);
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'H1BConnect API',
    environment: config.NODE_ENV,
    version: '1.0.0',
    mode: config.ENABLE_MOCK_MODE ? 'Mock Mode' : 'Production Mode',
    deployment: {
      railway: config.RAILWAY_ENVIRONMENT_NAME || null,
      vercel: config.VERCEL_URL || null,
      heroku: config.HEROKU_APP_NAME || null,
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/advisors', advisorRoutes);
app.use('/api/reports', reportsRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server without database for development
const startServer = async () => {
  try {
    // Database initialization only in production when enabled
    if (isProduction && config.ENABLE_DATABASE) {
      // await AppDataSource.initialize();
      // logger.info('Database connected successfully');
    }
    
    app.listen(PORT, () => {
      logger.info(`H1BConnect API server running on port ${PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`Frontend URL: ${config.FRONTEND_URL}`);
      
      if (config.ENABLE_MOCK_MODE) {
        logger.info('Running in MOCK MODE - no database required');
      }
      
      if (config.RAILWAY_ENVIRONMENT_NAME) {
        logger.info(`Railway Environment: ${config.RAILWAY_ENVIRONMENT_NAME}`);
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  // if (config.ENABLE_DATABASE) {
  //   await AppDataSource.destroy();
  // }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  // if (config.ENABLE_DATABASE) {
  //   await AppDataSource.destroy();
  // }
  process.exit(0);
});

startServer(); 