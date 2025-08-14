import { UsersController } from "./usersController";
import { Database } from "../../shared/database";
import { WebServer } from "../../shared/http/webServer";
import { UsersService } from "./usersService";
import { userErrorHandler } from "./usersErrors";
import { ProductionUserRepository } from "./adapters/productionUserRepository";
import { UserRepository } from "./ports/userRepository";
import { EmailNotificationAPI } from "../notifications/ports/emailNotificationAPI";
import { Config } from "../../shared/config";
import { InMemoryUserRepository } from "./adapters/inMemoryUserRepository";

export class UsersModule {
  private usersService: UsersService;
  private usersController: UsersController;
  private userRepository: UserRepository;

  private constructor(
    private dbConnection: Database,
    private emailAPI: EmailNotificationAPI,
    private config: Config,
  ) {
    this.userRepository = this.createUserRepository();
    this.usersService = this.createUsersService();
    this.usersController = this.createUsersController();
  }

  static build(
    dbConnection: Database,
    emailAPI: EmailNotificationAPI,
    config: Config,
  ) {
    return new UsersModule(dbConnection, emailAPI, config);
  }

  private shouldBuildFakeRepository() {
    const isDev = this.config.getEnvironment() === "development";
    const isUnitTest = this.config.getScript() === "test:unit";
    return isDev || isUnitTest;
  }

  private createUsersService() {
    return new UsersService(this.userRepository, this.emailAPI);
  }

  private createUserRepository() {
    if (this.userRepository) return this.userRepository;

    if (this.shouldBuildFakeRepository()) {
      return new InMemoryUserRepository();
    }
    return new ProductionUserRepository(this.dbConnection.getConnection());
  }

  private createUsersController() {
    return new UsersController(this.usersService, userErrorHandler);
  }

  public getController() {
    return this.usersController;
  }

  public getUsersRepository() {
    return this.userRepository;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/users", this.usersController.getRouter());
  }
}
