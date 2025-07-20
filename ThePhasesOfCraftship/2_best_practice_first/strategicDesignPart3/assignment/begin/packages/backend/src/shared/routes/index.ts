import { Router } from "express";
import { UserRoutes } from "../../modules/users/user-routes";

export class AppRoutes {
  private router: Router;

  constructor(private userRoutes: UserRoutes) {
    this.router = Router();
    this.assembleRoutes();
  }

  private assembleRoutes = () => {
    this.router.use("/users", this.userRoutes.getRouter());
  };

  public getRoutes() {
    return this.router;
  }
}
