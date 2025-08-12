export interface MailingListAPI {
  addEmailToList(email: string): Promise<boolean>;
}
