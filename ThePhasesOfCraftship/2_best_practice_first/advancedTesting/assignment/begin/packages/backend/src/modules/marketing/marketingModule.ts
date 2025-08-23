import { WebServer } from "../../shared/http/webServer";
import { MarketingController } from "./marketingController";

export class MarketingModule {
  private constructor(private marketingController: MarketingController) {}

  static build(marketingController: MarketingController) {
    return new MarketingModule(marketingController);
  }

  public getMarketingController() {
    return this.marketingController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/marketing", this.marketingController.getRouter());
  }
}
