"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const contact_controller_1 = __importDefault(require("../../controllers/contact.controller"));
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/contact', route);
    //create mappin in model
    route.post('/identify', async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        logger.debug('Calling contact/order endpoint with body: %o', req.body);
        try {
            const ContactControllerInstance = typedi_1.Container.get(contact_controller_1.default);
            const contact = await ContactControllerInstance.order(req.body);
            res.status(200).json({
                contact: contact,
            });
        }
        catch (e) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            logger.error('Error: %o', e);
            return next(e);
        }
    });
    route.get('/_search', async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        logger.debug('Calling appSetting/_search endpoint with body: %o', req.body);
        try {
            const UserControllerInstance = typedi_1.Container.get(contact_controller_1.default);
            const result = await UserControllerInstance.search();
            res.status(200).json({
                data: result,
            });
        }
        catch (e) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            logger.error('Error: %o', e);
            return next(e);
        }
    });
};
//# sourceMappingURL=contact.routes.js.map