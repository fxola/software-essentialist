import { EmailNotificationAPI } from "../ports/emailNotificationAPI";

export class MailGunEmailNotificationAPI implements EmailNotificationAPI {
  async sendMail(input: { to: string; subject: string; text: string }) {
    console.log(
      `Sending email to ${input.to} with subject ${input.subject} and text ${input.text}`,
    );
  }
}
