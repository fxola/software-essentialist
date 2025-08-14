import { Database } from "../../shared/database";
import { WebServer } from "../../shared/http/webServer";
import { ProductionPostRepository } from "./adapters/productionPostsRepository";
import { PostsRepository } from "./ports/postsRepository";
import { PostsController } from "./postsController";
import { postsErrorHandler } from "./postsErrors";
import { PostsService } from "./postsService";

export class PostsModule {
  private postsService: PostsService;
  private postsController: PostsController;
  private postsRepository: PostsRepository;

  private constructor(private dbConnection: Database) {
    this.postsRepository = this.createPostsRepository();
    this.postsService = this.createPostsService();
    this.postsController = this.createPostsController();
  }

  static build(dbConnection: Database) {
    return new PostsModule(dbConnection);
  }

  private createPostsService() {
    return new PostsService(this.postsRepository);
  }

  private createPostsRepository() {
    return new ProductionPostRepository(this.dbConnection.getConnection());
  }

  private createPostsController() {
    return new PostsController(this.postsService, postsErrorHandler);
  }

  public getPostsController() {
    return this.postsController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/posts", this.postsController.getRouter());
  }
}
