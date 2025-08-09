import puppeteer, { Browser, LaunchOptions, Page } from "puppeteer";

export class PuppeteerProtocolDriver {
  constructor(
    public browser: Browser,
    public page: Page,
  ) {}

  public static async create(options?: LaunchOptions) {
    const browserInstance = await puppeteer.launch(options);
    const page = await browserInstance.newPage();
    return new PuppeteerProtocolDriver(browserInstance, page);
  }

  public async close() {
    await this.browser.close();
  }
}
