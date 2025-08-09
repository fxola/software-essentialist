import { Router } from "express";
import { UserController } from "./user-controlller";

export class UserRoutes {
  private router: Router;

  constructor(private controller: UserController) {
    this.router = Router();
    this.mountRoutes();
  }

  mountRoutes() {
    this.router.get("/", this.controller.getUser);
    this.router.post("/new", this.controller.createUser);
  }

  public getRouter() {
    return this.router;
  }
}
