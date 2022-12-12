"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const express_1 = __importDefault(require("express"));
const routers_1 = require("./routers");
function API() {
    const app = (0, express_1.default)();
    app.use('/wallet(s?)', (0, routers_1.wallet)());
    app.use('/collection(s?)', (0, routers_1.collections)());
    app.use('/royalties', (0, routers_1.royalties)());
    return app;
}
exports.API = API;
//# sourceMappingURL=api.js.map