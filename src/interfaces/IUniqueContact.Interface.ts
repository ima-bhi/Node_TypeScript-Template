import mongoose from 'mongoose';

export interface IUniqueContact {
  _id?: mongoose.Types.ObjectId;
  primaryId: mongoose.Types.ObjectId;
  phoneNumbers:[string];
  emails:[string];
  secondaryIds:[number];
}