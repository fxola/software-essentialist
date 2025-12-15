import { UsersController } from "./usersController";
import { WebServer } from "../../shared/http/webServer";

export class UsersModule {
  private constructor(private usersController: UsersController) {}

  static build(usersController: UsersController) {
    return new UsersModule(usersController);
  }

  public getController() {
    return this.usersController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/users", this.usersController.getRouter());
  }
}
