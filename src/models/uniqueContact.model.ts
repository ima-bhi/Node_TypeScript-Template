import mongoose from 'mongoose';
import { IUniqueContact } from '../interfaces/IUniqueContact.Interface';
const UniqueContact = new mongoose.Schema(
    {
        primaryId: Number,
        phoneNumbers: [String],
        emails: [String],
        secondaryIds: [Number],
    },
    { timestamps: true },
);


export default mongoose.model<IUniqueContact & mongoose.Document>('UniqueContact', UniqueContact);