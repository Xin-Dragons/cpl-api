"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const port = process.env.PORT;
const server = (0, api_1.API)().listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log(`Listening on port ${port}`);
});
process.on('SIGINT', () => {
    if (server.listening) {
        console.log('Attempting to exit gracefully.');
        server.close(() => {
            console.log('Server closed. Quitting.');
            process.exit();
        });
    }
});
//# sourceMappingURL=index.js.map