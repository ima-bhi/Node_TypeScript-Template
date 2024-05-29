import { Document, Model } from 'mongoose';
import { IContact } from '../interfaces/IContact.Interface';
declare global {
    namespace Models {
        export type ContactModel = Model<IContact & Document>;
    }
}