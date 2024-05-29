import 'reflect-metadata';
import config from './config';
import express from 'express';
import Logger from './loaders/logger';

//const options = config.options;
async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  app.listen(config.scy.port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`
      ________________________________________
      
      Server listening on port: ${config.scy.port}
      ________________________________________
    `);
  });
}

startServer();