"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const express_1 = __importDefault(require("express"));
function API() {
    const app = (0, express_1.default)();
    return app;
}
exports.API = API;
//# sourceMappingURL=api.js.map