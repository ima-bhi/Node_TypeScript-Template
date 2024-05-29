import mongoose from 'mongoose';
import { IContact } from '../interfaces/IContact.Interface';

const Contact = new mongoose.Schema(
    {
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
           enum:['primary','secondary']
        },
    },
    { timestamps: true },
);


export default mongoose.model<IContact & mongoose.Document>('Contact', Contact);