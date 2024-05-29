import mongoose from 'mongoose';
import { IAppSetting } from '../interfaces/IAppSetting.Interface';
const AppSetting = new mongoose.Schema(
    {
        uniqueNumberCount:{
            type:Number
        },
    },
    { timestamps: true },
);


export default mongoose.model<IAppSetting & mongoose.Document>('AppSetting', AppSetting);