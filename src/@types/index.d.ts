import { Document, Model } from 'mongoose';
import { IContact } from '../interfaces/IContact.Interface';
import { IUniqueContact } from '../interfaces/IUniqueContact.Interface';
declare global {
    namespace Models {
        export type ContactModel = Model<IContact & Document>;
        export type UniqueContactModel=Model<IUniqueContact & Document>;
    }
}