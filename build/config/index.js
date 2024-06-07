"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envFound = dotenv_1.default.config();
if (!envFound) {
    // This error should crash whole process
    throw new Error("Couldn't find .env file");
}
exports.default = {
    env: process.env.NODE_ENV || 'dev',
    apiPrefix: '/api',
    logLevel: 'silly',
    scy: {
        databaseURL: process.env.USERS_MONGODB_URI,
        port: process.env.USERS_MICROSERVICE_PORT,
        host: process.env.USERS_MICROSERVICE_HOST,
        pathPrefix: process.env.USERS_MICROSERVICE_PATHPREFIX,
    },
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: 10,
    },
};
//# sourceMappingURL=index.js.map