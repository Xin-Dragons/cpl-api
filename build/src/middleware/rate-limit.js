"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (max, windowSecs = 10) => (0, express_rate_limit_1.default)({
    windowMs: windowSecs * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
exports.limiter = limiter;
//# sourceMappingURL=rate-limit.js.map