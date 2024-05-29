import { Service, Inject, Container } from 'typedi';
import { IContact } from '../interfaces/IContact.Interface';
import ContactService from '../services/contact.service';
import UniqueContactService from '../services/uniqueContact.service';
import e from 'express';
@Service()
export default class ContactController {
  constructor(@Inject('logger') private logger) { }

  //create and update models
  public async order(doc: { phoneNumber: string | null, email: string | null }): Promise<any> {
    try {
      const ContactServiceInstance = Container.get(ContactService);
      const uniqueContactServiceInstance = Container.get(UniqueContactService);
      //Step 1. Check for contact in db
      const entry = await this.checkEntry(doc.phoneNumber, doc.email);
      if (entry.length === 0) {
        //Create New Entry 
        const uniId = await this.geneareteUniqueId();
        const body = {
          uniqueId: uniId,
          phoneNumber: doc.phoneNumber,
          email: doc.email,
          linkedId: null,
          linkPrecedence: 'primary'
        };
        const uEntry = {
          primaryId: uniId,
          phoneNumbers: doc.phoneNumber ? [doc.phoneNumber] : [],
          emails: doc.email ? [doc.email] : [],
          secondaryIds: []
        }
        await ContactServiceInstance.create(body);
        await uniqueContactServiceInstance.create(uEntry);
      } else if (entry.length === 1) {
        //ENTRY ALREADRY PRESENT
        //CHECK FOR SAME ENTRY
        const sameEntry = await this.checkSameEntry(doc.phoneNumber, doc.email);
        if (sameEntry) {
          //do nothing 
          // const body = {
          //   uniqueId: sameEntry.uniqueId,
          //   phoneNumber: doc.phoneNumber,
          //   email: doc.email,
          //   linkedId: sameEntry.linkedId,
          //   linkPrecedence: sameEntry.linkPrecedence
          // };
        } else {
          //Check entries a/c to phoneNumber and email
          const entry = await this.checkEntry(doc.phoneNumber, doc.email);
          //create entry a/c to the entries
          if (entry) {
            let getUniqueId = entry[0].primaryId;
            const uniId = await this.geneareteUniqueId();
            const body = {
              uniqueId: uniId,
              phoneNumber: doc.phoneNumber,
              email: doc.email,
              linkedId: getUniqueId,
              linkPrecedence: 'secondary'
            };
            const uEntry = {
              $addToSet: {
                phoneNumbers: doc.phoneNumber ? doc.phoneNumber : null,
                emails: doc.email ? doc.email : null,
                secondaryIds: uniId
              }
            }
            // Ensure null values are not added to the arrays
            if (!doc.phoneNumber) {
              delete uEntry.$addToSet.phoneNumbers;
            }
            if (!doc.email) {
              delete uEntry.$addToSet.emails;
            }
            await ContactServiceInstance.create(body);
            await uniqueContactServiceInstance.update({ primaryId: entry[0].primaryId }, uEntry);
          }
        }
      } else {
        //Special case make one entry to other  
        const uEntry = {
          primaryId: entry[0].primaryId,
          phoneNumbers: [entry[0].phoneNumbers[0], entry[1].phoneNumbers[0]],
          emails: [entry[0].emails[0], entry[1].emails[0]],
          secondaryIds: [entry[1].primaryId]
        }
        //update entries in contact
        await ContactServiceInstance.update({ uniqueId: entry[1].primaryId }, { linkedId: entry[0].primaryId, linkPrecedence: 'secondary' })
        //create and delete entries on unique
        await uniqueContactServiceInstance.delete({ primaryId: entry[1].primaryId });
        //update first entry
        await uniqueContactServiceInstance.update({ primaryId: entry[0].primaryId }, uEntry);
      }

      const result = await this.genearteResult(doc.phoneNumber, doc.email);
      return result;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async checkEntry(phoneNumberToSearch: string | null, emailToSearch: string | null) {
    const uniqueContactServiceInstance = Container.get(UniqueContactService);
    // Build the search query dynamically based on the provided values
    const searchQuery: any = {
      $or: [],
    };

    if (phoneNumberToSearch) {
      searchQuery.$or.push({ phoneNumbers: phoneNumberToSearch });
    }

    if (emailToSearch) {
      searchQuery.$or.push({ emails: emailToSearch });
    }
    //step 1. check entry via both mobile Number
    const { entry } = await uniqueContactServiceInstance.search(searchQuery);
    return entry;
  }

  //geneeate result
  public async genearteResult(phoneNumberToSearch: string | null, emailToSearch: string | null) {
    const uniqueContactServiceInstance = Container.get(UniqueContactService);
    // Build the search query dynamically based on the provided values
    const searchQuery: any = {
      $or: [],
    };

    if (phoneNumberToSearch) {
      searchQuery.$or.push({ phoneNumbers: phoneNumberToSearch });
    }

    if (emailToSearch) {
      searchQuery.$or.push({ emails: emailToSearch });
    }
    //step 1. check entry via both mobile Number
    const { payload } = await uniqueContactServiceInstance.searchFinal(searchQuery);
    const result = {
      primaryContatctId: payload.primaryId,
      emails: payload.emails,
      phoneNumbers: payload.phoneNumbers,
      secondaryContactIds: payload.secondaryIds
    }
    return result;
  }

  //check sameEntry
  public async checkSameEntry(phoneNumberToSearch: string | null, emailToSearch: string | null) {
    const ContactServiceInstance = Container.get(ContactService);
    // Build the search query dynamically based on the provided values
    const searchQuery: any = {};

    if (phoneNumberToSearch) {
      searchQuery.phoneNumber = phoneNumberToSearch;
    }

    if (emailToSearch) {
      searchQuery.email = emailToSearch;
    }
    //step 1. check entry via both mobile Number
    const { entry } = await ContactServiceInstance.search(searchQuery);
    return entry;
  }
  public async geneareteUniqueId() {
    const ContactServiceInstance = Container.get(ContactService);
    const maxNumber = await ContactServiceInstance.generateUniqueId();
    let uniqueId = 0;
    if (maxNumber) {
      uniqueId = maxNumber.uniqueId + 1;
    } else {
      uniqueId = 1;
    }
    return uniqueId;
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