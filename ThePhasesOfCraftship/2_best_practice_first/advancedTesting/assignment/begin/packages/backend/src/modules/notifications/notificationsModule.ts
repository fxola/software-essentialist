import { Config } from "../../shared/config";
import { MailGunEmailNotificationAPI } from "./adapters/mailGunEmailNotificationAPI";
import { MailGunEmailNotificationAPISPy } from "./adapters/mailgunEmailNotificationAPISpy";
import { EmailNotificationAPI } from "./ports/emailNotificationAPI";

export class NotificationsModule {
  private emailNotificationAPI: EmailNotificationAPI;

  private constructor(private config: Config) {
    this.emailNotificationAPI = this.createEmailNotificationAPI();
  }

  static build(config: Config) {
    return new NotificationsModule(config);
  }

  public getEmailNotificationAPI() {
    return this.emailNotificationAPI;
  }

  private shouldBuildFakeEmailNotificationAPI() {
    const isDev = this.config.getEnvironment() === "development";
    const isUnitTest = this.config.getScript() === "test:unit";
    return isUnitTest || isDev;
  }

  private createEmailNotificationAPI() {
    if (this.emailNotificationAPI) {
      return this.emailNotificationAPI;
    }

    if (this.shouldBuildFakeEmailNotificationAPI()) {
      return new MailGunEmailNotificationAPISPy();
    }

    return new MailGunEmailNotificationAPI();
  }
}
