import { Config } from "../../shared/config";
import { WebServer } from "../../shared/http/webServer";
import { MailGunMarketingAPI } from "./adapters/mailgunMarketingAPI";
import { MailgunMarketingAPISpy } from "./adapters/mailgunMarketingAPISpy";
import { MarketingController } from "./marketingController";
import { marketingErrorHandler } from "./marketingErrors";
import { MarketingService } from "./marketingService";
import { MailingListAPI } from "./ports/mailingListAPI";

export class MarketingModule {
  private marketingService: MarketingService;
  private marketingController: MarketingController;
  private mailingListAPI: MailingListAPI;

  private constructor(private config: Config) {
    this.mailingListAPI = this.buildMailingListAPI();
    this.marketingService = this.createMarketingService();
    this.marketingController = this.createMarketingController();
  }

  static build(config: Config) {
    return new MarketingModule(config);
  }

  private createMarketingService() {
    return new MarketingService(this.mailingListAPI);
  }

  private shouldBuildFakeMarketingAPI() {
    const isDev = this.config.getEnvironment() === "development";
    const isTest = this.config.getScript() === "test:unit";
    return isDev || isTest;
  }

  private createMarketingController() {
    return new MarketingController(
      this.marketingService,
      marketingErrorHandler,
    );
  }

  private buildMailingListAPI() {
    if (this.mailingListAPI) return this.mailingListAPI;

    if (this.shouldBuildFakeMarketingAPI()) {
      return new MailgunMarketingAPISpy();
    }

    return new MailGunMarketingAPI();
  }

  public getMarketingController() {
    return this.marketingController;
  }

  public getMarketingAPI() {
    return this.mailingListAPI;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/marketing", this.marketingController.getRouter());
  }
}
