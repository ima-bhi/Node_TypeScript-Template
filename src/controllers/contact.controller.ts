import { Service, Inject, Container } from 'typedi';

@Service()
export default class ContactController {
  constructor(@Inject('logger') private logger) {}


  // search
  public async search(): Promise<any> {
    try {
     return {data:[]};
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  

}