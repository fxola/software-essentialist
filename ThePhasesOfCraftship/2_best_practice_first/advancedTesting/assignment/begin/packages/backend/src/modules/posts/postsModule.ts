import { WebServer } from "../../shared/http/webServer";
import { PostsController } from "./postsController";

export class PostsModule {
  private constructor(private postsController: PostsController) {}

  static build(postsController: PostsController) {
    return new PostsModule(postsController);
  }

  public getPostsController() {
    return this.postsController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/posts", this.postsController.getRouter());
  }
}
