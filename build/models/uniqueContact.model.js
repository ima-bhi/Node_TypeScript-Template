"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UniqueContact = new mongoose_1.default.Schema({
    primaryId: Number,
    phoneNumbers: [String],
    emails: [String],
    secondaryIds: [Number],
}, { timestamps: true });
exports.default = mongoose_1.default.model('UniqueContact', UniqueContact);
//# sourceMappingURL=uniqueContact.model.js.map