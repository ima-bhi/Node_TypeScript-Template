"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Contact = new mongoose_1.default.Schema({
    uniqueId: {
        type: Number,
        unique: true,
    },
    phoneNumber: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    linkedId: {
        type: Number,
        default: null
    },
    linkPrecedence: {
        type: String,
        enum: ['primary', 'secondary']
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Contact', Contact);
//# sourceMappingURL=contact.model.js.map