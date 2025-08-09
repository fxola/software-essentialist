import { PuppeteerProtocolDriver } from "./protocol-driver";

export class PageObject {
  protected driver: PuppeteerProtocolDriver;
  public url: string;

  constructor(driver: PuppeteerProtocolDriver, url: string) {
    this.driver = driver;
    this.url = url;
  }

  async open() {
    this.driver.page.goto(this.url);
  }
}
