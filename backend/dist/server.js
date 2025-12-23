"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const setup_1 = require("./setup");
dotenv_1.default.config();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
async function bootstrap() {
    const app = await (0, setup_1.createServer)();
    app.listen(port, () => {
        console.log(`API running on http://localhost:${port}`);
    });
}
bootstrap().catch((err) => {
    console.error('Fatal startup error', err);
    process.exit(1);
});
