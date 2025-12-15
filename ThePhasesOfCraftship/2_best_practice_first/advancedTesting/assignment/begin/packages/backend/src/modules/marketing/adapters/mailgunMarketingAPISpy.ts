import { Spy } from "../../../shared/testDoubles/Spy";
import { MailingListAPI } from "../ports/mailingListAPI";

export class MailgunMarketingAPISpy
  extends Spy<MailingListAPI>
  implements MailingListAPI
{
  mailingList: string[];
  constructor() {
    super();
    this.mailingList = [];
  }

  addEmailToList(email: string): Promise<boolean> {
    this.addCall("addEmailToList", [email]);
    console.log(`Adding ${email} to mailing list spy`);
    this.mailingList.push(email);
    return Promise.resolve(true);
  }

  reset() {
    this.mailingList = [];
    this.resetCalls();
  }
}
