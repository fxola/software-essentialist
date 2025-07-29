export class MailingListAPI {
  public contacts: string[];

  constructor() {
    this.contacts = [];
  }

  addEmail = async (email: string) => {
    console.log(`${email} has been successfully added to the list`);
    this.contacts.push(email);
    return email;
  };

  removeEmail = async (email: string) => {
    console.log(`${email} has been successfully removed from the list`);
    this.contacts = this.contacts.filter((e) => e !== email);
  };

  clearMailingList = () => {
    this.contacts = [];
  };
}
