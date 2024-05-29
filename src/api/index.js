"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import auth from './routes/auth.routes';       -- Example 
exports.default = () => {
    const app = (0, express_1.Router)();
    //auth(app);   -- Example
    return app;
};
