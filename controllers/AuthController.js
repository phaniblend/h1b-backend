"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));

// Enhanced mock storage with better structure
const mockUsers = [];
const mockVerificationTokens = new Map(); // token -> { email, expires, type }
const mockPasswordResetTokens = new Map(); // token -> { email, expires }

class AuthController {
    constructor() {
        // Helper function to normalize phone numbers
        this.normalizePhone = (phone) => {
            return phone.replace(/\D/g, ''); // Remove all non-digits
        };

        // Helper function to generate verification token
        this.generateVerificationToken = () => {
            return crypto_1.default.randomBytes(32).toString('hex');
        };

        // Helper function to send email (mock implementation)
        this.sendVerificationEmail = async (email, token, firstName) => {
            // In production, this would use a real email service like SendGrid, AWS SES, etc.
            console.log(`
=== EMAIL VERIFICATION ===
To: ${email}
Subject: Verify Your H1BConnect Account

Hi ${firstName},

Welcome to H1BConnect! Please verify your email address by clicking the link below:

http://localhost:3001/verify-email/${token}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
H1BConnect Team
===========================
            `);
            
            // Store token for verification
            mockVerificationTokens.set(token, {
                email,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                type: 'email_verification'
            });
        };

        // Helper function to send password reset email
        this.sendPasswordResetEmail = async (email, token, firstName) => {
            console.log(`
=== PASSWORD RESET ===
To: ${email}
Subject: Reset Your H1BConnect Password

Hi ${firstName},

You requested to reset your password. Click the link below to reset it:

http://localhost:3001/reset-password/${token}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
H1BConnect Team
===================
            `);
            
            mockPasswordResetTokens.set(token, {
                email,
                expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
            });
        };

        this.register = async (req, res) => {
            try {
                const { firstName, lastName, email, password, phone } = req.body;

                // Normalize email and phone
                const normalizedEmail = email.toLowerCase().trim();
                const normalizedPhone = phone ? this.normalizePhone(phone) : null;

                // Enhanced duplicate checking with specific error messages
                const existingUserByEmail = mockUsers.find(user => user.email === normalizedEmail);
                if (existingUserByEmail) {
                    return res.status(400).json({ 
                        message: 'Account already exists with this email address',
                        field: 'email',
                        code: 'EMAIL_EXISTS'
                    });
                }

                if (normalizedPhone) {
                    const existingUserByPhone = mockUsers.find(user => user.phone === normalizedPhone);
                    if (existingUserByPhone) {
                        return res.status(400).json({ 
                            message: 'Account already exists with this phone number',
                            field: 'phone',
                            code: 'PHONE_EXISTS'
                        });
                }
                }

                // Enhanced password validation
                if (password.length < 8) {
                    return res.status(400).json({
                        message: 'Password must be at least 8 characters long',
                        field: 'password',
                        code: 'PASSWORD_TOO_SHORT'
                    });
                }

                // Check password strength
                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasNumbers = /\d/.test(password);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

                if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                    return res.status(400).json({
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                        field: 'password',
                        code: 'PASSWORD_TOO_WEAK'
                    });
                }

                // Hash password with higher salt rounds for security
                const hashedPassword = await bcryptjs_1.default.hash(password, 14);

                // Generate verification token
                const verificationToken = this.generateVerificationToken();

                // Create user with enhanced security fields
                const user = {
                    id: crypto_1.default.randomUUID(),
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: normalizedEmail,
                    phone: normalizedPhone,
                    password: hashedPassword,
                    role: 'USER',
                    isVerified: false, // Require email verification
                    isActive: true,
                    loginAttempts: 0,
                    lastLoginAttempt: null,
                    accountLocked: false,
                    lockUntil: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    verificationToken,
                    // Security audit fields
                    registrationIP: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('User-Agent')
                };

                mockUsers.push(user);

                // Send verification email
                await this.sendVerificationEmail(normalizedEmail, verificationToken, firstName);

                // Remove sensitive data from response
                const { password: _, verificationToken: __, ...userWithoutSensitiveData } = user;

                res.status(201).json({
                    message: 'Account created successfully! Please check your email to verify your account.',
                    user: userWithoutSensitiveData,
                    requiresVerification: true
                });

            } catch (error) {
                console.error('Registration error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const normalizedEmail = email.toLowerCase().trim();

                // Find user
                const user = mockUsers.find(user => user.email === normalizedEmail);
                if (!user) {
                    return res.status(400).json({ 
                        message: 'Invalid email or password',
                        code: 'INVALID_CREDENTIALS'
                    });
                }

                // Check if account is locked
                if (user.accountLocked && user.lockUntil && new Date() < user.lockUntil) {
                    const lockTimeRemaining = Math.ceil((user.lockUntil - new Date()) / (1000 * 60));
                    return res.status(423).json({ 
                        message: `Account is temporarily locked. Try again in ${lockTimeRemaining} minutes.`,
                        code: 'ACCOUNT_LOCKED',
                        lockUntil: user.lockUntil
                    });
                }

                // Reset lock if time has passed
                if (user.accountLocked && user.lockUntil && new Date() >= user.lockUntil) {
                    user.accountLocked = false;
                    user.lockUntil = null;
                    user.loginAttempts = 0;
                }

                // Check password
                const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    // Increment login attempts
                    user.loginAttempts = (user.loginAttempts || 0) + 1;
                    user.lastLoginAttempt = new Date();

                    // Lock account after 5 failed attempts
                    if (user.loginAttempts >= 5) {
                        user.accountLocked = true;
                        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
                        return res.status(423).json({ 
                            message: 'Account locked due to too many failed login attempts. Try again in 30 minutes.',
                            code: 'ACCOUNT_LOCKED_ATTEMPTS'
                        });
                    }

                    return res.status(400).json({ 
                        message: 'Invalid email or password',
                        code: 'INVALID_CREDENTIALS',
                        attemptsRemaining: 5 - user.loginAttempts
                    });
                }

                // Check if email is verified
                if (!user.isVerified) {
                    return res.status(403).json({ 
                        message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
                        code: 'EMAIL_NOT_VERIFIED',
                        email: user.email
                    });
                }

                // Reset login attempts on successful login
                user.loginAttempts = 0;
                user.lastLoginAttempt = null;
                user.accountLocked = false;
                user.lockUntil = null;

                // Generate JWT with enhanced payload
                const tokenPayload = {
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                };

                const token = jsonwebtoken_1.default.sign(
                    tokenPayload,
                    process.env.JWT_SECRET || 'fallback_secret_change_in_production',
                    { expiresIn: '24h' }
                );

                // Update last login
                user.lastLogin = new Date();
                user.updatedAt = new Date();

                // Remove sensitive data from response
                const { password: _, verificationToken: __, ...userWithoutSensitiveData } = user;

                res.json({
                    message: 'Login successful',
                    token,
                    user: userWithoutSensitiveData
                });

            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.verifyEmail = async (req, res) => {
            try {
                const { token } = req.params;

                // Check if token exists and is valid
                const tokenData = mockVerificationTokens.get(token);
                if (!tokenData) {
                    return res.status(400).json({ 
                        message: 'Invalid or expired verification token',
                        code: 'INVALID_TOKEN'
                    });
                }

                // Check if token has expired
                if (new Date() > tokenData.expires) {
                    mockVerificationTokens.delete(token);
                    return res.status(400).json({ 
                        message: 'Verification token has expired. Please request a new one.',
                        code: 'TOKEN_EXPIRED'
                    });
                }

                // Find user and verify
                const user = mockUsers.find(u => u.email === tokenData.email);
                if (!user) {
                    return res.status(404).json({ 
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    });
            }

                if (user.isVerified) {
                    return res.status(400).json({ 
                        message: 'Email is already verified',
                        code: 'ALREADY_VERIFIED'
                    });
                }

                // Verify the user
                user.isVerified = true;
                user.verificationToken = null;
                user.updatedAt = new Date();

                // Remove the token
                mockVerificationTokens.delete(token);

                res.json({
                    message: 'Email verified successfully! You can now log in.',
                    code: 'EMAIL_VERIFIED'
                });

            } catch (error) {
                console.error('Email verification error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.resendVerification = async (req, res) => {
            try {
                const { email } = req.body;
                const normalizedEmail = email.toLowerCase().trim();

                const user = mockUsers.find(u => u.email === normalizedEmail);
                if (!user) {
                    return res.status(404).json({ 
                        message: 'No account found with this email address',
                        code: 'USER_NOT_FOUND'
                    });
                }

                if (user.isVerified) {
                    return res.status(400).json({ 
                        message: 'Email is already verified',
                        code: 'ALREADY_VERIFIED'
                    });
                }

                // Generate new verification token
                const verificationToken = this.generateVerificationToken();
                user.verificationToken = verificationToken;
                user.updatedAt = new Date();

                // Send new verification email
                await this.sendVerificationEmail(normalizedEmail, verificationToken, user.firstName);

                res.json({
                    message: 'Verification email sent successfully. Please check your inbox.',
                    code: 'VERIFICATION_SENT'
                });

            } catch (error) {
                console.error('Resend verification error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.getProfile = async (req, res) => {
            try {
                const userId = req.userId; // Added by auth middleware
                const user = mockUsers.find(user => user.id === userId);
                
                if (!user) {
                    return res.status(404).json({ 
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    });
                }

                // Remove sensitive data from response
                const { password: _, verificationToken: __, ...userWithoutSensitiveData } = user;
                res.json({ user: userWithoutSensitiveData });

            } catch (error) {
                console.error('Profile error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                const normalizedEmail = email.toLowerCase().trim();

                const user = mockUsers.find(u => u.email === normalizedEmail);
                if (!user) {
                    // Don't reveal if email exists for security
                    return res.json({
                        message: 'If an account with this email exists, you will receive a password reset link.',
                        code: 'RESET_EMAIL_SENT'
                    });
                }

                // Generate reset token
                const resetToken = this.generateVerificationToken();
                
                // Send reset email
                await this.sendPasswordResetEmail(normalizedEmail, resetToken, user.firstName);

                res.json({
                    message: 'If an account with this email exists, you will receive a password reset link.',
                    code: 'RESET_EMAIL_SENT'
                });

            } catch (error) {
                console.error('Forgot password error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.resetPassword = async (req, res) => {
            try {
                const { token, password } = req.body;

                // Check if token exists and is valid
                const tokenData = mockPasswordResetTokens.get(token);
                if (!tokenData) {
                    return res.status(400).json({ 
                        message: 'Invalid or expired reset token',
                        code: 'INVALID_TOKEN'
                    });
                }

                // Check if token has expired
                if (new Date() > tokenData.expires) {
                    mockPasswordResetTokens.delete(token);
                    return res.status(400).json({ 
                        message: 'Reset token has expired. Please request a new one.',
                        code: 'TOKEN_EXPIRED'
                    });
                }

                // Find user
                const user = mockUsers.find(u => u.email === tokenData.email);
                if (!user) {
                    return res.status(404).json({ 
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    });
                }

                // Validate new password
                if (password.length < 8) {
                    return res.status(400).json({
                        message: 'Password must be at least 8 characters long',
                        code: 'PASSWORD_TOO_SHORT'
                    });
                }

                // Hash new password
                const hashedPassword = await bcryptjs_1.default.hash(password, 14);
                user.password = hashedPassword;
                user.updatedAt = new Date();

                // Remove the token
                mockPasswordResetTokens.delete(token);

                res.json({
                    message: 'Password reset successfully. You can now log in with your new password.',
                    code: 'PASSWORD_RESET'
                });

            } catch (error) {
                console.error('Reset password error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.refreshToken = async (req, res) => {
            try {
                const userId = req.userId;
                const user = mockUsers.find(u => u.id === userId);
                
                if (!user || !user.isVerified) {
                    return res.status(401).json({ 
                        message: 'Invalid user or unverified account',
                        code: 'INVALID_USER'
                    });
                }

                // Generate new token
                const tokenPayload = {
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                };

                const token = jsonwebtoken_1.default.sign(
                    tokenPayload,
                    process.env.JWT_SECRET || 'fallback_secret_change_in_production',
                    { expiresIn: '24h' }
                );

                res.json({
                    message: 'Token refreshed successfully',
                    token
                });

            } catch (error) {
                console.error('Refresh token error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.logout = async (req, res) => {
            try {
                // In a real implementation, you might blacklist the token
                res.json({
                    message: 'Logged out successfully',
                    code: 'LOGOUT_SUCCESS'
                });

            } catch (error) {
                console.error('Logout error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };

        this.changePassword = async (req, res) => {
            try {
                const { currentPassword, newPassword } = req.body;
                const userId = req.userId;

                const user = mockUsers.find(user => user.id === userId);
                if (!user) {
                    return res.status(404).json({ 
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    });
                }

                // Check current password
                const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    return res.status(400).json({ 
                        message: 'Current password is incorrect',
                        code: 'INVALID_CURRENT_PASSWORD'
                    });
                }

                // Validate new password
                if (newPassword.length < 8) {
                    return res.status(400).json({
                        message: 'New password must be at least 8 characters long',
                        code: 'PASSWORD_TOO_SHORT'
                    });
                }

                // Hash new password
                const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 14);
                user.password = hashedNewPassword;
                user.updatedAt = new Date();

                res.json({
                    message: 'Password changed successfully',
                    code: 'PASSWORD_CHANGED'
                });

            } catch (error) {
                console.error('Change password error:', error);
                res.status(500).json({ 
                    message: 'Internal server error. Please try again later.',
                    code: 'INTERNAL_ERROR'
                });
            }
        };
    }
}

exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map