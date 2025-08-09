import { MailingListAPI } from "./mailing-list-api";
import { MarketingController } from "./marketing-controller";
import { MarketingRoutes } from "./marketing-routes";
import { MarketingService } from "./marketing-service";

export class MarketingModule {
  private marketingRoutes: MarketingRoutes;

  constructor(private mailingList: MailingListAPI) {
    this.marketingRoutes = this.createMarketingRoutes();
  }

  private createMarketingRoutes() {
    const marketingService = new MarketingService(this.mailingList);
    const marketingController = new MarketingController(marketingService);
    return new MarketingRoutes(marketingController);
  }

  public static build(mailingList: MailingListAPI) {
    return new MarketingModule(mailingList);
  }

  public getRouter() {
    return this.marketingRoutes.getRouter();
  }
}
