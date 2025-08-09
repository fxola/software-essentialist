import { CreateUserParams } from "@dddforum/shared/src/api/users";
import { PuppeteerProtocolDriver } from "../protocol-driver";
import { PageElements, PageElementsConfig } from "../page-elements";
import { PageObject } from "../page-object";
import { newSelectors } from "../../../src/shared/selectors";

export class RegistrationPage extends PageObject {
  private elements: PageElements;

  constructor(driver: PuppeteerProtocolDriver, baseUrl: string) {
    super(driver, `${baseUrl}/join`);
    this.elements = this.createRegistrationPageElements();
  }

  private createRegistrationPageElements() {
    return new PageElements(
      newSelectors.registrationPage as PageElementsConfig,
      this.driver,
    );
  }

  async enterUserDetails(params: CreateUserParams) {
    const emailfield = await this.elements.get("email");
    await emailfield?.type(params.email);

    const firstNamefield = await this.elements.get("firstName");
    await firstNamefield?.type(params.firstName);

    const lastNamefield = await this.elements.get("lastName");
    await lastNamefield?.type(params.lastName);

    const usernamefield = await this.elements.get("username");
    await usernamefield?.type(params.username);
  }

  async acceptMarketingEmail() {
    const marketingCheckboxField = await this.elements.get("marketingCheckBox");
    marketingCheckboxField?.click();
  }

  async submitRegistrationForm() {
    const submitButton = await this.elements.get("submitButton");
    submitButton?.click();
  }
}
