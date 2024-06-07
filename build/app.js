"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./loaders/logger"));
//const options = config.options;
async function startServer() {
    const app = (0, express_1.default)();
    await require('./loaders').default({ expressApp: app });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    app.listen(config_1.default.scy.port, err => {
        if (err) {
            logger_1.default.error(err);
            process.exit(1);
            return;
        }
        logger_1.default.info(`
      ________________________________________
      
      Server listening on port: ${config_1.default.scy.port}
      ________________________________________
    `);
    });
}
startServer();
//# sourceMappingURL=app.js.map