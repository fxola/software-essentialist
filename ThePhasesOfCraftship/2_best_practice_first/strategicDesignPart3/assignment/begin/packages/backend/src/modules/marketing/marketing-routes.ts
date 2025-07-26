import { Router } from "express";
import { MarketingController } from "./marketing-controller";

export class MarketingRoutes {
  private router: Router;

  constructor(private controller: MarketingController) {
    this.router = Router();
    this.assembleRoutes();
  }

  private assembleRoutes() {
    this.router.post("/new", this.controller.addEmailToList);
  }

  public getRouter() {
    return this.router;
  }
}
