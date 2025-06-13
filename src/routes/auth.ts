import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthController } from '../controllers/AuthController';
import { authValidation } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', authValidation.register, asyncHandler(authController.register));
router.post('/login', authValidation.login, asyncHandler(authController.login));
router.post('/forgot-password', authValidation.forgotPassword, asyncHandler(authController.forgotPassword));
router.post('/reset-password', authValidation.resetPassword, asyncHandler(authController.resetPassword));
router.get('/verify-email/:token', asyncHandler(authController.verifyEmail));
router.post('/resend-verification', authValidation.resendVerification, asyncHandler(authController.resendVerification));

// Protected routes
router.post('/refresh-token', auth, asyncHandler(authController.refreshToken));
router.post('/logout', auth, asyncHandler(authController.logout));
router.post('/change-password', auth, authValidation.changePassword, asyncHandler(authController.changePassword));
router.get('/profile', auth, asyncHandler(authController.getProfile));

export default router; 