import { MailGunMarketingAPI } from "../../modules/marketing/adapters/mailgunMarketingAPI";
import { MailgunMarketingAPISpy } from "../../modules/marketing/adapters/mailgunMarketingAPISpy";
import { MarketingController } from "../../modules/marketing/marketingController";
import { marketingErrorHandler } from "../../modules/marketing/marketingErrors";
import { MarketingService } from "../../modules/marketing/marketingService";
import { MailingListAPI } from "../../modules/marketing/ports/mailingListAPI";
import { ProductionPostRepository } from "../../modules/posts/adapters/productionPostsRepository";
import { PostsRepository } from "../../modules/posts/ports/postsRepository";
import { PostsController } from "../../modules/posts/postsController";
import { postsErrorHandler } from "../../modules/posts/postsErrors";
import { PostsService } from "../../modules/posts/postsService";
import { InMemoryUserRepositorySpy } from "../../modules/users/adapters/inMemoryUserRepositorySpy";
import { ProductionUserRepository } from "../../modules/users/adapters/productionUserRepository";
import { UserRepository } from "../../modules/users/ports/userRepository";
import { UsersController } from "../../modules/users/usersController";
import { userErrorHandler } from "../../modules/users/usersErrors";
import { UsersService } from "../../modules/users/usersService";
import { Application } from "../application";
import { Config } from "../config";
import { Database } from "../database";
import { WebServer } from "../http";
import {
  UsersModule,
  PostsModule,
  NotificationsModule,
  MarketingModule,
} from "@dddforum/backend/src/modules";

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  private webServer: WebServer;
  private dbConnection: Database;
  private config: Config;

  private userRepository: UserRepository;
  private usersService: UsersService;
  private usersController?: UsersController;

  private postsRepository: PostsRepository;
  private postsService: PostsService;
  private postsController?: PostsController;

  private mailingListAPI: MailingListAPI;
  private marketingService: MarketingService;
  private marketingController?: MarketingController;

  private application: Application;

  private usersModule: UsersModule;
  private marketingModule: MarketingModule;
  private postsModule: PostsModule;
  private notificationsModule: NotificationsModule;

  public static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }
    return CompositionRoot.instance;
  }

  private constructor(config: Config) {
    this.config = config;
    this.dbConnection = this.createDBConnection();
    this.notificationsModule = this.createNotificationsModule();

    this.userRepository = this.createUserRepository();
    this.usersService = this.createUsersService();

    this.mailingListAPI = this.buildMailingListAPI();
    this.marketingService = this.createMarketingService();

    this.postsRepository = this.createPostsRepository();
    this.postsService = this.createPostsService();

    this.application = {
      users: this.usersService,
      posts: this.postsService,
      marketing: this.marketingService,
    };

    this.marketingModule = this.createMarketingModule();
    this.usersModule = this.createUsersModule();
    this.postsModule = this.createPostsModule();
    this.webServer = this.createWebServer();
    this.mountRoutes();
  }

  createNotificationsModule() {
    return NotificationsModule.build(this.config);
  }

  createMarketingModule() {
    this.marketingController = this.createMarketingController();
    return MarketingModule.build(this.marketingController);
  }

  createPostsModule() {
    this.postsController = this.createPostsController();
    return PostsModule.build(this.postsController);
  }

  createUsersModule() {
    this.usersController = this.createUsersController();
    return UsersModule.build(this.usersController);
  }

  private shouldBuildFakeInstance() {
    const isDev = this.config.getEnvironment() === "development";
    const isUnitTest = this.config.getScript() === "test:unit";
    return isDev || isUnitTest;
  }

  private createUserRepository() {
    if (this.userRepository) return this.userRepository;

    if (this.shouldBuildFakeInstance()) {
      return new InMemoryUserRepositorySpy();
    }
    return new ProductionUserRepository(this.dbConnection.getConnection());
  }

  private createUsersService() {
    return new UsersService(
      this.userRepository,
      this.notificationsModule.getEmailNotificationAPI(),
    );
  }

  private createUsersController() {
    return new UsersController(this.application, userErrorHandler);
  }

  private buildMailingListAPI() {
    if (this.mailingListAPI) return this.mailingListAPI;

    if (this.shouldBuildFakeInstance()) {
      return new MailgunMarketingAPISpy();
    }

    return new MailGunMarketingAPI();
  }

  private createMarketingService() {
    return new MarketingService(this.mailingListAPI);
  }

  private createMarketingController() {
    return new MarketingController(this.application, marketingErrorHandler);
  }

  private createPostsService() {
    return new PostsService(this.postsRepository);
  }

  private createPostsRepository() {
    return new ProductionPostRepository(this.dbConnection.getConnection());
  }

  private createPostsController() {
    return new PostsController(this.application, postsErrorHandler);
  }

  getDBConnection() {
    if (!this.dbConnection) this.createDBConnection();
    return this.dbConnection;
  }

  createWebServer() {
    return new WebServer({ port: 3000, env: this.config.env });
  }

  getWebServer() {
    return this.webServer;
  }

  public getRepositories() {
    return {
      users: this.userRepository,
    };
  }

  public getServices() {
    return {
      marketing: this.mailingListAPI,
      notifications: {
        email: this.notificationsModule.getEmailNotificationAPI(),
      },
    };
  }

  public getApplication() {
    return this.application;
  }

  private mountRoutes() {
    this.marketingModule.mountRouter(this.webServer);
    this.usersModule.mountRouter(this.webServer);
    this.postsModule.mountRouter(this.webServer);
  }

  private createDBConnection() {
    const dbConnection = new Database();
    if (!this.dbConnection) {
      this.dbConnection = dbConnection;
    }
    return dbConnection;
  }
}
