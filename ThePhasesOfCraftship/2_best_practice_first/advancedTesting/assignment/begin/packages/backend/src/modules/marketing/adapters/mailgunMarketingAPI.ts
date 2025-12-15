import { MailingListAPI } from "../ports/mailingListAPI";

export class MailGunMarketingAPI implements MailingListAPI {
  addEmailToList(email: string): Promise<boolean> {
    console.log(`${email} has been successfully added to the mailing list`);
    return Promise.resolve(true);
  }
}
