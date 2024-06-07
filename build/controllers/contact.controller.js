"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const contact_service_1 = __importDefault(require("../services/contact.service"));
const uniqueContact_service_1 = __importDefault(require("../services/uniqueContact.service"));
let ContactController = class ContactController {
    constructor(logger) {
        this.logger = logger;
    }
    //create and update models
    async order(doc) {
        try {
            const ContactServiceInstance = typedi_1.Container.get(contact_service_1.default);
            const uniqueContactServiceInstance = typedi_1.Container.get(uniqueContact_service_1.default);
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
                };
                await ContactServiceInstance.create(body);
                await uniqueContactServiceInstance.create(uEntry);
            }
            else if (entry.length === 1) {
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
                }
                else {
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
                        };
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
            }
            else {
                //Special case make one entry to other  
                const uEntry = {
                    primaryId: entry[0].primaryId,
                    phoneNumbers: [entry[0].phoneNumbers[0], entry[1].phoneNumbers[0]],
                    emails: [entry[0].emails[0], entry[1].emails[0]],
                    secondaryIds: [entry[1].primaryId]
                };
                //update entries in contact
                await ContactServiceInstance.update({ uniqueId: entry[1].primaryId }, { linkedId: entry[0].primaryId, linkPrecedence: 'secondary' });
                //create and delete entries on unique
                await uniqueContactServiceInstance.delete({ primaryId: entry[1].primaryId });
                //update first entry
                await uniqueContactServiceInstance.update({ primaryId: entry[0].primaryId }, uEntry);
            }
            const result = await this.genearteResult(doc.phoneNumber, doc.email);
            return result;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async checkEntry(phoneNumberToSearch, emailToSearch) {
        const uniqueContactServiceInstance = typedi_1.Container.get(uniqueContact_service_1.default);
        // Build the search query dynamically based on the provided values
        const searchQuery = {
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
    async genearteResult(phoneNumberToSearch, emailToSearch) {
        const uniqueContactServiceInstance = typedi_1.Container.get(uniqueContact_service_1.default);
        // Build the search query dynamically based on the provided values
        const searchQuery = {
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
        };
        return result;
    }
    //check sameEntry
    async checkSameEntry(phoneNumberToSearch, emailToSearch) {
        const ContactServiceInstance = typedi_1.Container.get(contact_service_1.default);
        // Build the search query dynamically based on the provided values
        const searchQuery = {};
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
    async geneareteUniqueId() {
        const ContactServiceInstance = typedi_1.Container.get(contact_service_1.default);
        const maxNumber = await ContactServiceInstance.generateUniqueId();
        let uniqueId = 0;
        if (maxNumber) {
            uniqueId = maxNumber.uniqueId + 1;
        }
        else {
            uniqueId = 1;
        }
        return uniqueId;
    }
    // search
    async search() {
        try {
            return { data: [] };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
};
ContactController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object])
], ContactController);
exports.default = ContactController;
//# sourceMappingURL=contact.controller.js.map