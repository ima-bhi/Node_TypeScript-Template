import { Document, Model } from 'mongoose';
import { IContact } from '../interfaces/IContact.Interface';
import { IAppSetting } from '../interfaces/IAppSetting.Interface';
declare global {
    namespace Models {
        export type ContactModel = Model<IContact & Document>;
        export type AppSettingModel = Model<IAppSetting & Document>;
    }
}