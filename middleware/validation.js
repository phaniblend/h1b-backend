"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};
exports.authValidation = {
    register: validateRequest(joi_1.default.object({
        firstName: joi_1.default.string().min(2).max(50).required(),
        lastName: joi_1.default.string().min(2).max(50).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    })),
    login: validateRequest(joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required()
    })),
    forgotPassword: validateRequest(joi_1.default.object({
        email: joi_1.default.string().email().required()
    })),
    resetPassword: validateRequest(joi_1.default.object({
        token: joi_1.default.string().required(),
        password: joi_1.default.string().min(6).required()
    })),
    resendVerification: validateRequest(joi_1.default.object({
        email: joi_1.default.string().email().required()
    })),
    changePassword: validateRequest(joi_1.default.object({
        currentPassword: joi_1.default.string().required(),
        newPassword: joi_1.default.string().min(6).required()
    }))
};
//# sourceMappingURL=validation.js.map