import { Service, Inject } from 'typedi';
import { IUniqueContact } from '../interfaces/IUniqueContact.Interface';
@Service()
export default class UniqueContactService {
  constructor(
    @Inject('UniqueContactModel') private UniqueContactModel: Models.UniqueContactModel,
    @Inject('logger') private logger,
  ) { }

  public async create(doc: object): Promise<{ contactRecord: IUniqueContact }> {
    try {
      let contactRecord = await this.UniqueContactModel.create(doc);
      return { contactRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  //update
  public async update(key: object, doc: object): Promise<any> {
    try {
      let entry = await this.UniqueContactModel.updateOne(key, doc);
      return { entry };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  //delete
  public async delete(key: object): Promise<any> {
    try {
      let entry = await this.UniqueContactModel.deleteOne(key);
      return { entry };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  //search entry
  public async search(key: object): Promise<{ entry: IUniqueContact[] }> {
    try {
      let entry = await this.UniqueContactModel.find(key).sort('createdAt');
      return { entry };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  //final search
  public async searchFinal(key: object): Promise<{ payload: IUniqueContact }> {
    try {
      let payload = await this.UniqueContactModel.findOne(key);
      return { payload };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }


}
