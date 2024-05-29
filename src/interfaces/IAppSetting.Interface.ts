import mongoose from 'mongoose';

export interface IAppSetting {
  _id: mongoose.Types.ObjectId;
  uniqueNumberCount:number;
}