import { Service, Inject } from 'typedi';
import { IContact } from '../interfaces/IContact.Interface';
@Service()
export default class ContactService {
  constructor(
    @Inject('ContactModel') private ContactModel:Models.ContactModel,
    @Inject('logger') private logger,
  ) {}

  public async create(doc:object): Promise<{ contactRecord: IContact }> {
    try {
      let contactRecord = await this.ContactModel.create(doc);
      return { contactRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  //updateOne
  public async update(key:object,doc:object): Promise<any> {
    try {
      let contactRecord = await this.ContactModel.updateOne(key,doc);
      return { contactRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  //search by Ket
  public async search(doc: object): Promise<{ entry: IContact }> {
    try {
      let entry = await this.ContactModel.findOne(doc);
      return { entry };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  //generate rollNumber
  public async generateUniqueId():Promise<any>{
    const maxNumber=await this.ContactModel.findOne({}).sort('-uniqueId').limit(1);
    return maxNumber;
  }

}
