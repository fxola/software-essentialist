import { Database } from "../../shared/database";
import { UserController } from "./user-controlller";
import { UserRoutes } from "./user-routes";
import { UserService } from "./user-service";

export class UserModule {
  private userRoutes: UserRoutes;

  constructor(private dbConnection: Database) {
    this.userRoutes = this.createUserRoutes();
  }

  public static build(dbConnection: Database) {
    return new UserModule(dbConnection);
  }

  private createUserRoutes() {
    const userService = new UserService(this.dbConnection);
    const userController = new UserController(userService);
    return new UserRoutes(userController);
  }

  public getRouter() {
    return this.userRoutes.getRouter();
  }
}
