import { Spy } from "../../../shared/testDoubles/Spy";
import { EmailNotificationAPI } from "../ports/emailNotificationAPI";

export class MailGunEmailNotificationAPISPy
  extends Spy<EmailNotificationAPI>
  implements EmailNotificationAPI
{
  constructor() {
    super();
  }

  sendMail(input: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    this.addCall("sendMail", [input]);
    console.log(
      `Sending email with details ${JSON.stringify(input, null, 2)} using spy`,
    );
    return Promise.resolve();
  }

  reset() {
    this.resetCalls();
  }
}
