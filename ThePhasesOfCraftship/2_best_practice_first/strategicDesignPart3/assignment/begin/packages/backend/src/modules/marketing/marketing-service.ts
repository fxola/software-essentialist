import { MailingListAPI } from "./mailing-list-api";
import { AddEmailDTO } from "./marketing-dto";

export class MarketingService {
  constructor(private mailingListAPI: MailingListAPI) {}

  addToEmailToList = async (dto: AddEmailDTO) => {
    const result = await this.mailingListAPI.addEmail(dto.email);
    return result;
  };
}
