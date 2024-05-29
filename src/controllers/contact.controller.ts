import { Service, Inject, Container } from 'typedi';
import { IContact } from '../interfaces/IContact.Interface';
import ContactService from '../services/contact.service';
@Service()
export default class ContactController {
  constructor(@Inject('logger') private logger) { }

  //create and update models
  public async order(doc: {
    phoneNumber: string,
    email: string
  }): Promise<any> {
    try {
      const ContactServiceInstance=Container.get(ContactService);

      const body = {
        uniqueId: 1,
        phoneNumber: doc.phoneNumber,
        email: doc.email,
        linkedId: null,
        linkPrecedence: 'primary'
      };

      const {contactRecord}=await ContactServiceInstance.create(body);
      return contactRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  // search
  public async search(): Promise<any> {
    try {
      return { data: [] };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }



}