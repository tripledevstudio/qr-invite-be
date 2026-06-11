"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
let cachedServer;
exports.default = async (req, res) => {
    if (!cachedServer) {
        cachedServer = await (0, main_1.bootstrap)();
    }
    return cachedServer(req, res);
};
//# sourceMappingURL=index.js.map