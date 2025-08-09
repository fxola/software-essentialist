import { MailingListAPI } from "../../modules/marketing/mailing-list-api";
import { Database } from "../database";
import { Application } from "../application";
import { Config } from "../config";
import { errorHandler, errorHandlerType } from "../errors/handler";
import { MarketingModule, PostModule, UserModule } from "../../modules";

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  private config: Config;
  private app: Application;
  private userModule: UserModule;
  private postModule: PostModule;
  private marketingModule: MarketingModule;

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

    this.userModule = this.createUserModule();
    this.postModule = this.createPostModule();
    this.marketingModule = this.createMarketingModule();

    this.app = this.createApplication();
    this.mountAppRoutes();
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

  private createUserModule() {
    return UserModule.build(this.dbConnection);
  }

  private createPostModule() {
    return PostModule.build(this.dbConnection);
  }

  private createMarketingModule() {
    return MarketingModule.build(this.mailingList);
  }

  private createApplication() {
    return new Application(this.errorHandler);
  }

  private mountAppRoutes() {
    this.app.mountRouter("/users", this.userModule.getRouter());
    this.app.mountRouter("/posts", this.postModule.getRouter());
    this.app.mountRouter("/marketing", this.marketingModule.getRouter());
    this.app.setupRouteHandlers();
  }
}
