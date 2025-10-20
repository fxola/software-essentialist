import { Router } from "express";
import { PostController } from "./post-controller";

export class PostRoutes {
  private router: Router;

  constructor(private controller: PostController) {
    this.router = Router();
    this.assembleRoutes();
  }

  private assembleRoutes() {
    this.router.get("/", this.controller.getPosts);
  }

  public getRouter() {
    return this.router;
  }
}
