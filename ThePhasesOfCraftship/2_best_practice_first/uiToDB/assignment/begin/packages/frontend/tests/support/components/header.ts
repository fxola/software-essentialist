import { Component, PageElements } from "../page-elements";
import { PuppeteerProtocolDriver } from "../protocol-driver";

export class HeaderComponent extends Component {
  private elements: PageElements;
  constructor(driver: PuppeteerProtocolDriver) {
    super(driver);
    this.elements = this.createHeaderElements();
  }

  private createHeaderElements() {
    return new PageElements(
      {
        header: { selector: ".header.username", type: "div" },
      },
      this.driver,
    );
  }

  async getLoggedInUsername() {
    const header = await this.elements.get("header");
    return header?.evaluate((e) => e.textContent);
  }
}
