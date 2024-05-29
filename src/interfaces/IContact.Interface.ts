import mongoose from 'mongoose';

export interface IContact {
  _id: mongoose.Types.ObjectId;
  uniqueId:number;
  phoneNumber:string;
  email:string;
  linkedId:number;
  linkPrecedence:string;
}