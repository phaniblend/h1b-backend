"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const environment_1 = require("./config/environment");
// import { config } from './config/database';
// import { AppDataSource } from './config/database';
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
// Route imports
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const application_1 = __importDefault(require("./routes/application"));
const document_1 = __importDefault(require("./routes/document"));
const payment_1 = __importDefault(require("./routes/payment"));
const compliance_1 = __importDefault(require("./routes/compliance"));
const timesheet_1 = __importDefault(require("./routes/timesheet"));
const advisor_1 = __importDefault(require("./routes/advisor"));
const reports_1 = __importDefault(require("./routes/reports"));
const app = (0, express_1.default)();
const PORT = environment_1.config.PORT;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: environment_1.config.RATE_LIMIT_WINDOW_MS,
    max: environment_1.config.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
});
// Middleware
app.use((0, cors_1.default)({
    origin: environment_1.config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
// Handle preflight requests
app.options('*', (0, cors_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: environment_1.isProduction ? undefined : false,
    crossOriginEmbedderPolicy: environment_1.isProduction ? true : false,
}));
app.use((0, compression_1.default)());
app.use(limiter);
app.use((0, morgan_1.default)('combined', { stream: { write: message => logger_1.logger.info(message.trim()) } }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'H1BConnect API',
        environment: environment_1.config.NODE_ENV,
        version: '1.0.0',
        mode: environment_1.config.ENABLE_MOCK_MODE ? 'Mock Mode' : 'Production Mode',
        deployment: {
            railway: environment_1.config.RAILWAY_ENVIRONMENT_NAME || null,
            vercel: environment_1.config.VERCEL_URL || null,
            heroku: environment_1.config.HEROKU_APP_NAME || null,
        }
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/applications', application_1.default);
app.use('/api/documents', document_1.default);
app.use('/api/payments', payment_1.default);
app.use('/api/compliance', compliance_1.default);
app.use('/api/timesheets', timesheet_1.default);
app.use('/api/advisors', advisor_1.default);
app.use('/api/reports', reports_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Start server without database for development
const startServer = async () => {
    try {
        // Database initialization only in production when enabled
        if (environment_1.isProduction && environment_1.config.ENABLE_DATABASE) {
            // await AppDataSource.initialize();
            // logger.info('Database connected successfully');
        }
        app.listen(PORT, () => {
            logger_1.logger.info(`H1BConnect API server running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${environment_1.config.NODE_ENV}`);
            logger_1.logger.info(`Frontend URL: ${environment_1.config.FRONTEND_URL}`);
            if (environment_1.config.ENABLE_MOCK_MODE) {
                logger_1.logger.info('Running in MOCK MODE - no database required');
            }
            if (environment_1.config.RAILWAY_ENVIRONMENT_NAME) {
                logger_1.logger.info(`Railway Environment: ${environment_1.config.RAILWAY_ENVIRONMENT_NAME}`);
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGTERM', async () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    // if (config.ENABLE_DATABASE) {
    //   await AppDataSource.destroy();
    // }
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    // if (config.ENABLE_DATABASE) {
    //   await AppDataSource.destroy();
    // }
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map