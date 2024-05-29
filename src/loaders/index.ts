import expressLoader from './express';
import dependencyInjectorLoader from '../loaders/dependencyInjector';
import mongooseLoader from '../loaders/mongoose';
import Logger from '../loaders/logger';
import config from '../config';
//@ts-ignore
export default async ({ expressApp }) => {
    //@ts-ignore
  const mongoConnection = await mongooseLoader(config.scy.databaseURL);
  Logger.info('Mongo loaded & connected!');
  
  const ContactModel={
    name:'ContactModel',
    model:require('../models/contact.model').default,
  }
  // It returns the agenda instance because it's needed in the subsequent loaders
 await dependencyInjectorLoader({
    mongoConnection,
    models: [ContactModel],
  });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
