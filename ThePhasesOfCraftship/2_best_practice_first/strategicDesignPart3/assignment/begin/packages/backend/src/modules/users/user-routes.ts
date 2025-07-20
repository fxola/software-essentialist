import { Router } from "express";
import { UserController } from "./user-controlller";

export class UserRoutes {
  private router: Router;

  constructor(private controller: UserController) {
    this.router = Router();
  }

  mountRoutes() {
    this.router.post("/new", this.controller.createUser);
  }

  public getRouter() {
    return this.router;
  }
}
