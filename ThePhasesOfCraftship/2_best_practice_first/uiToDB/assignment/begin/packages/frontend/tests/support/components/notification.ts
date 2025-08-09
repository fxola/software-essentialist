import { newSelectors } from "../../../src/shared/selectors";
import {
  Component,
  PageElementConfigValue,
  PageElements,
} from "../page-elements";
import { PuppeteerProtocolDriver } from "../protocol-driver";

export class NotificationsComponent extends Component {
  private elements: PageElements;

  constructor(driver: PuppeteerProtocolDriver) {
    super(driver);
    this.elements = this.createNotificationElements();
  }

  private createNotificationElements() {
    return new PageElements(
      {
        errorMessage: newSelectors.notifications
          .errorMessage as PageElementConfigValue,
      },
      this.driver,
    );
  }

  async getErrorMessage() {
    const errorContainer = await this.elements.get("errorMessage");
    return errorContainer?.evaluate((e) => e.textContent);
  }
}
