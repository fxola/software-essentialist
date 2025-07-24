import { MailingListAPI } from "../../modules/marketing/mailing-list-api";
import { MarketingController } from "../../modules/marketing/marketing-controller";
import { MarketingRoutes } from "../../modules/marketing/marketing-route";
import { MarketingService } from "../../modules/marketing/marketing-service";
import { PostController } from "../../modules/posts/post-controller";
import { PostRoutes } from "../../modules/posts/post-route";
import { PostService } from "../../modules/posts/post-service";
import { UserController } from "../../modules/users/user-controlller";
import { UserRoutes } from "../../modules/users/user-routes";
import { UserService } from "../../modules/users/user-service";
import { Application } from "../application";
import { Config } from "../config";
import { Database } from "../database";
import { errorHandler, errorHandlerType } from "../errors/handler";
import { AppRoutes } from "../routes";

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  private config: Config;
  private app: Application;
  private appRoutes: AppRoutes;
  private userRoutes: UserRoutes;
  private postRoutes: PostRoutes;
  private marketingRoutes: MarketingRoutes;
  private dbConnection: Database;
  private mailingList: MailingListAPI;
  private errorHandler: errorHandlerType;

  public static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }
    return CompositionRoot.instance;
  }

  private constructor(config: Config) {
    this.config = config;
    this.dbConnection = this.createDbConnection();
    this.mailingList = this.createMailingList();
    this.errorHandler = errorHandler;

    this.userRoutes = this.createUserRoutes();
    this.postRoutes = this.createPostRoutes();
    this.marketingRoutes = this.createMarketingRoutes();

    this.appRoutes = this.createAppRoutes();
    this.app = this.createApplication();
  }

  public getDbConnection() {
    return this.dbConnection;
  }

  public getMailingList() {
    return this.mailingList;
  }

  public getApplication() {
    return this.app;
  }

  private createDbConnection() {
    const db = new Database();
    if (!this.dbConnection) {
      this.dbConnection = db;
    }
    return this.dbConnection;
  }

  private createMailingList() {
    const mailingListAPI = new MailingListAPI();
    if (!this.mailingList) {
      this.mailingList = mailingListAPI;
    }
    return this.mailingList;
  }

  private createUserRoutes() {
    const userService = new UserService(this.dbConnection);
    const userController = new UserController(userService);
    return new UserRoutes(userController);
  }

  private createPostRoutes() {
    const postService = new PostService(this.dbConnection);
    const postController = new PostController(postService);
    return new PostRoutes(postController);
  }

  private createMarketingRoutes() {
    const marketingService = new MarketingService(this.mailingList);
    const marketingController = new MarketingController(marketingService);
    return new MarketingRoutes(marketingController);
  }

  private createAppRoutes() {
    return new AppRoutes(
      this.userRoutes,
      this.postRoutes,
      this.marketingRoutes
    );
  }

  private createApplication() {
    const app = new Application(this.appRoutes, this.errorHandler);
    return app;
  }
}
