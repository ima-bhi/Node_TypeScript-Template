import { Service, Inject } from 'typedi';
import { IAppSetting } from '../interfaces/IAppSetting.Interface';
import { IContact } from '../interfaces/IContact.Interface';
@Service()
export default class ContactService {
  constructor(
    @Inject('AppSettingModel') private AppSettingModel: Models.AppSettingModel,
    @Inject('ContactModel') private ContactModel:Models.ContactModel,
    @Inject('logger') private logger,
  ) {}

  public async create(doc: IContact): Promise<{ contactRecord: IContact }> {
    try {
      let contactRecord = await this.ContactModel.create(doc);
      return { contactRecord };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

}
