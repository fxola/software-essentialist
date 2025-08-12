import { ServerErrorException } from "../../shared/exceptions";
import { MailingListAPI } from "./ports/mailingListAPI";

export class MarketingService {
  constructor(private mailingListAPI: MailingListAPI) {}

  async addEmailToList(email: string) {
    try {
      const result = await this.mailingListAPI.addEmailToList(email);
      return result;
    } catch (err) {
      throw new ServerErrorException();
    }
  }
}
