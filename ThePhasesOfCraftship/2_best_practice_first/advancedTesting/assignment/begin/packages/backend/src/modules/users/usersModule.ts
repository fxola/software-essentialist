import { UsersController } from "./usersController";
import { Database } from "../../shared/database";
import { WebServer } from "../../shared/http/webServer";
import { UsersService } from "./usersService";
import { userErrorHandler } from "./usersErrors";
import { ProductionUserRepository } from "./adapters/productionUserRepository";
import { UserRepository } from "./ports/userRepository";
import { EmailNotificationAPI } from "../notifications/ports/emailNotificationAPI";

export class UsersModule {
  private usersService: UsersService;
  private usersController: UsersController;
  private userRepository: UserRepository;

  private constructor(
    private dbConnection: Database,
    private emailAPI: EmailNotificationAPI,
  ) {
    this.userRepository = this.createUserRepository();
    this.usersService = this.createUsersService();
    this.usersController = this.createUsersController();
  }

  static build(dbConnection: Database, emailAPI: EmailNotificationAPI) {
    return new UsersModule(dbConnection, emailAPI);
  }

  private createUsersService() {
    return new UsersService(this.userRepository, this.emailAPI);
  }

  private createUserRepository() {
    return new ProductionUserRepository(this.dbConnection.getConnection());
  }

  private createUsersController() {
    return new UsersController(this.usersService, userErrorHandler);
  }

  public getController() {
    return this.usersController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/users", this.usersController.getRouter());
  }
}
