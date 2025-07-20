import { Router } from "express";
import { UserRoutes } from "../../modules/users/user-routes";
import { PostRoutes } from "../../modules/posts/post-route";
import { MarketingRoutes } from "../../modules/marketing/marketing-route";

export class AppRoutes {
  private router: Router;

  constructor(
    private userRoutes: UserRoutes,
    private postRoutes: PostRoutes,
    private marketingRoutes: MarketingRoutes
  ) {
    this.router = Router();
    this.assembleRoutes();
  }

  private assembleRoutes = () => {
    this.router.use("/users", this.userRoutes.getRouter);
    this.router.use("/posts", this.postRoutes.getRouter);
    this.router.use("/marketing", this.marketingRoutes.getRouter);
  };

  public getRoutes() {
    return this.router;
  }
}
