import mongoose, { ConnectOptions } from 'mongoose';
import { Db } from 'mongodb';

export default async (databaseURL: string): Promise<Db> => {
  const connection = await mongoose.connect(databaseURL, {
  } as ConnectOptions);
  mongoose.set('debug', true);
  return connection.connection.db as Db;
};
