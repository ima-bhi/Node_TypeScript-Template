"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const dependencyInjector_1 = __importDefault(require("../loaders/dependencyInjector"));
const mongoose_1 = __importDefault(require("../loaders/mongoose"));
const logger_1 = __importDefault(require("../loaders/logger"));
const config_1 = __importDefault(require("../config"));
//@ts-ignore
exports.default = async ({ expressApp }) => {
    //@ts-ignore
    const mongoConnection = await (0, mongoose_1.default)(config_1.default.scy.databaseURL);
    logger_1.default.info('Mongo loaded & connected!');
    const ContactModel = {
        name: 'ContactModel',
        model: require('../models/contact.model').default,
    };
    const UniqueContactModel = {
        name: 'UniqueContactModel',
        model: require('../models/uniqueContact.model').default
    };
    // It returns the agenda instance because it's needed in the subsequent loaders
    await (0, dependencyInjector_1.default)({
        mongoConnection,
        models: [ContactModel, UniqueContactModel],
    });
    logger_1.default.info('Dependency Injector loaded');
    await (0, express_1.default)({ app: expressApp });
    logger_1.default.info('Express loaded');
};
//# sourceMappingURL=index.js.map