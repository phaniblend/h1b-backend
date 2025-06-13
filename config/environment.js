"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isDevelopment = exports.isProduction = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), envFile) });
exports.config = {
    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    // Frontend URL
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
    // Database
    DATABASE_URL: process.env.DATABASE_URL || 'mock',
    DATABASE_PUBLIC_URL: process.env.DATABASE_PUBLIC_URL || 'mock',
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    // Email
    SMTP_HOST: process.env.SMTP_HOST || 'localhost',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@h1bconnect.com',
    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    // AWS S3
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'h1bconnect-documents',
    // Security
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_FILE: process.env.LOG_FILE === 'true',
    // Feature flags
    ENABLE_MOCK_MODE: process.env.NODE_ENV === 'development' || process.env.ENABLE_MOCK_MODE === 'true',
    ENABLE_DATABASE: process.env.ENABLE_DATABASE === 'true' && process.env.NODE_ENV === 'production',
    // Deployment info
    RAILWAY_ENVIRONMENT_NAME: process.env.RAILWAY_ENVIRONMENT_NAME,
    RAILWAY_DEPLOYMENT_ID: process.env.RAILWAY_DEPLOYMENT_ID,
    VERCEL_URL: process.env.VERCEL_URL,
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
};
exports.isProduction = exports.config.NODE_ENV === 'production';
exports.isDevelopment = exports.config.NODE_ENV === 'development';
exports.isTest = exports.config.NODE_ENV === 'test';
// Validate required production environment variables
if (exports.isProduction) {
    const requiredEnvVars = [
        'JWT_SECRET',
        'FRONTEND_URL'
    ];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
        console.error('Missing required environment variables:', missingEnvVars);
        process.exit(1);
    }
}
exports.default = exports.config;
//# sourceMappingURL=environment.js.map