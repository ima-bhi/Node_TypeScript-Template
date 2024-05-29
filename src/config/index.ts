import dotenv from 'dotenv';
const envFound = dotenv.config();
if (!envFound) {
    // This error should crash whole process
    throw new Error("Couldn't find .env file");
}

export default {
    env: process.env.NODE_ENV || 'dev',
    apiPrefix: '/api',
    logLevel :'silly',
    scy: {
        databaseURL: process.env.USERS_MONGODB_URI,
        port: process.env.USERS_MICROSERVICE_PORT,
        host: process.env.USERS_MICROSERVICE_HOST,
        pathPrefix: process.env.USERS_MICROSERVICE_PATHPREFIX,
      },
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: 10,
      },
}