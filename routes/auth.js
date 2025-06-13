"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const AuthController_1 = require("../controllers/AuthController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
// Public routes
router.post('/register', validation_1.authValidation.register, (0, errorHandler_1.asyncHandler)(authController.register));
router.post('/login', validation_1.authValidation.login, (0, errorHandler_1.asyncHandler)(authController.login));
router.post('/forgot-password', validation_1.authValidation.forgotPassword, (0, errorHandler_1.asyncHandler)(authController.forgotPassword));
router.post('/reset-password', validation_1.authValidation.resetPassword, (0, errorHandler_1.asyncHandler)(authController.resetPassword));
router.get('/verify-email/:token', (0, errorHandler_1.asyncHandler)(authController.verifyEmail));
router.post('/resend-verification', validation_1.authValidation.resendVerification, (0, errorHandler_1.asyncHandler)(authController.resendVerification));
// Protected routes
router.post('/refresh-token', auth_1.auth, (0, errorHandler_1.asyncHandler)(authController.refreshToken));
router.post('/logout', auth_1.auth, (0, errorHandler_1.asyncHandler)(authController.logout));
router.post('/change-password', auth_1.auth, validation_1.authValidation.changePassword, (0, errorHandler_1.asyncHandler)(authController.changePassword));
router.get('/profile', auth_1.auth, (0, errorHandler_1.asyncHandler)(authController.getProfile));
exports.default = router;
//# sourceMappingURL=auth.js.map