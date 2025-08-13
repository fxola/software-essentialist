import { MailGunEmailNotificationAPI } from "./adapters/mailGunEmailNotificationAPI";
import { EmailNotificationAPI } from "./ports/emailNotificationAPI";

export class NotificationsModule {
  private emailNotificationAPI: EmailNotificationAPI;

  private constructor() {
    this.emailNotificationAPI = this.createEmailNotificationAPI();
  }

  static build() {
    return new NotificationsModule();
  }

  public getTransactionalEmailAPI() {
    return this.emailNotificationAPI;
  }

  private createEmailNotificationAPI() {
    return new MailGunEmailNotificationAPI();
  }
}
