export interface EmailNotificationAPI {
  sendMail(input: { to: string; subject: string; text: string }): Promise<void>;
}
