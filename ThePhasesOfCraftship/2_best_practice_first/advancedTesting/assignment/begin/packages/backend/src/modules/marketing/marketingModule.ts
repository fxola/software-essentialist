import { WebServer } from "../../shared/http/webServer";
import { MailGunMarketingAPI } from "./adapters/mailgunMarketingAPI";
import { MarketingController } from "./marketingController";
import { marketingErrorHandler } from "./marketingErrors";
import { MarketingService } from "./marketingService";
import { MailingListAPI } from "./ports/mailingListAPI";

export class MarketingModule {
  private marketingService: MarketingService;
  private marketingController: MarketingController;
  private mailingListAPI: MailingListAPI;

  private constructor() {
    this.mailingListAPI = this.buildContactListAPI();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  static build() {
    return new MarketingModule();
  }

  private createMarketingService() {
    return new MarketingService(this.mailingListAPI);
  }

  private createMarketingController() {
    return new MarketingController(
      this.marketingService,
      marketingErrorHandler,
    );
  }

  private buildContactListAPI() {
    return new MailGunMarketingAPI();
  }

  public getMarketingController() {
    return this.marketingController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/marketing", this.marketingController.getRouter());
  }
}
