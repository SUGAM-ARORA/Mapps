"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./utils/db");
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const errors_1 = require("./utils/errors");
async function createServer() {
    await (0, db_1.connectDb)();
    const app = (0, express_1.default)();
    // Security middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    }));
    // Body parsing
    app.use(express_1.default.json({ limit: '10kb' }));
    // Logging
    app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
    // Routes
    app.use('/api/auth', auth_1.default);
    app.use('/api/tasks', tasks_1.default);
    // Health check
    app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));
    // 404 handler
    app.use('*', (_req, res) => res.status(404).json({ success: false, message: 'Not found' }));
    // Error handler (must be last)
    app.use(errors_1.errorHandler);
    return app;
}
