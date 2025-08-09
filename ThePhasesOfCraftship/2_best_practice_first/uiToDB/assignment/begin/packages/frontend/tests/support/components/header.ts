import { newSelectors } from "../../../src/shared/selectors";
import {
  Component,
  PageElementConfigValue,
  PageElements,
} from "../page-elements";
import { PuppeteerProtocolDriver } from "../protocol-driver";

export class HeaderComponent extends Component {
  private elements: PageElements;
  constructor(driver: PuppeteerProtocolDriver) {
    super(driver);
    this.elements = this.createHeaderElements();
  }

  private createHeaderElements() {
    return new PageElements(
      { header: newSelectors.headerComponent.header as PageElementConfigValue },
      this.driver,
    );
  }

  async getLoggedInUsername() {
    try {
      const header = await this.elements.get("header");
      return header?.evaluate((e) => e.textContent);
    } catch (e) {
      return undefined;
    }
  }
}
