"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mockUsers = [];
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const { firstName, lastName, email, password } = req.body;
                // Check if user already exists
                const existingUser = mockUsers.find(user => user.email === email);
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists' });
                }
                // Hash password
                const hashedPassword = await bcryptjs_1.default.hash(password, 12);
                // Create user
                const user = {
                    id: Math.random().toString(36).substr(2, 9),
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role: 'USER',
                    createdAt: new Date(),
                    isVerified: true // Auto-verify for development
                };
                mockUsers.push(user);
                // Remove password from response
                const { password: _, ...userWithoutPassword } = user;
                res.status(201).json({
                    message: 'User created successfully',
                    user: userWithoutPassword
                });
            }
            catch (error) {
                console.error('Registration error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                // Find user
                const user = mockUsers.find(user => user.email === email);
                if (!user) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }
                // Check password
                const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }
                // Generate JWT
                const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
                // Remove password from response
                const { password: _, ...userWithoutPassword } = user;
                res.json({
                    message: 'Login successful',
                    token,
                    user: userWithoutPassword
                });
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const userId = req.userId; // Added by auth middleware
                const user = mockUsers.find(user => user.id === userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Remove password from response
                const { password: _, ...userWithoutPassword } = user;
                res.json({ user: userWithoutPassword });
            }
            catch (error) {
                console.error('Profile error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                // For development, just return success
                res.json({
                    message: 'Password reset email sent successfully (development mode)',
                    email
                });
            }
            catch (error) {
                console.error('Forgot password error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { token, password } = req.body;
                // For development, just return success
                res.json({
                    message: 'Password reset successfully (development mode)'
                });
            }
            catch (error) {
                console.error('Reset password error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.verifyEmail = async (req, res) => {
            try {
                const { token } = req.params;
                // For development, just return success
                res.json({
                    message: 'Email verified successfully (development mode)'
                });
            }
            catch (error) {
                console.error('Verify email error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.resendVerification = async (req, res) => {
            try {
                const { email } = req.body;
                // For development, just return success
                res.json({
                    message: 'Verification email sent successfully (development mode)',
                    email
                });
            }
            catch (error) {
                console.error('Resend verification error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.refreshToken = async (req, res) => {
            try {
                const userId = req.userId;
                // Generate new token
                const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
                res.json({
                    message: 'Token refreshed successfully',
                    token
                });
            }
            catch (error) {
                console.error('Refresh token error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.logout = async (req, res) => {
            try {
                // For development, just return success
                res.json({
                    message: 'Logged out successfully'
                });
            }
            catch (error) {
                console.error('Logout error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.changePassword = async (req, res) => {
            try {
                const { currentPassword, newPassword } = req.body;
                const userId = req.userId;
                const user = mockUsers.find(user => user.id === userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Check current password
                const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    return res.status(400).json({ message: 'Current password is incorrect' });
                }
                // Hash new password
                const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
                user.password = hashedNewPassword;
                res.json({
                    message: 'Password changed successfully'
                });
            }
            catch (error) {
                console.error('Change password error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map