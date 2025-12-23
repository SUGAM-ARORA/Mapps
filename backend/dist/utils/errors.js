"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.errorHandler = errorHandler;
exports.catchAsync = catchAsync;
/**
 * Custom API error with consistent format.
 */
class ApiError extends Error {
    constructor(statusCode, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
/**
 * Global error handler middleware.
 */
function errorHandler(err, _req, res, _next) {
    console.error('[Error]', err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }
    if (err instanceof SyntaxError) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON'
        });
    }
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}
/**
 * Async route handler wrapper to catch errors.
 */
function catchAsync(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
