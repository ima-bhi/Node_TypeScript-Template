//@ts-ignore
import Agenda from 'agenda';
import config from '../config';

interface AgendaLoaderParams {
  mongoConnection: any; // Replace 'any' with the actual type of mongoConnection
}

const agendaFactory = ({ mongoConnection }: AgendaLoaderParams): Agenda => {
  return new Agenda({
    mongo: mongoConnection,
    db: { collection: config.agenda.dbCollection},
    processEvery: config.agenda.pooltime,
    maxConcurrency: config.agenda.concurrency,
  });
};

export default agendaFactory;