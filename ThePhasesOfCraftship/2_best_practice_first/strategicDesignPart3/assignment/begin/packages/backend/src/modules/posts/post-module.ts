import { Database } from "../../shared/database";
import { PostController } from "./post-controller";
import { PostRoutes } from "./post-routes";
import { PostService } from "./post-service";

export class PostModule {
  private postRoutes: PostRoutes;

  constructor(private dbConnection: Database) {
    this.postRoutes = this.createPostRoutes();
  }

  private createPostRoutes() {
    const postService = new PostService(this.dbConnection);
    const postController = new PostController(postService);
    return new PostRoutes(postController);
  }

  public static build(dbConnection: Database) {
    return new PostModule(dbConnection);
  }

  public getRouter() {
    return this.postRoutes.getRouter();
  }
}
