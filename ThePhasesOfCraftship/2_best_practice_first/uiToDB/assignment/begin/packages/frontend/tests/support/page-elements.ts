import { ElementHandle } from "puppeteer";
import { PuppeteerProtocolDriver } from "./protocol-driver";

type ElementType = "input" | "button" | "div" | "checkbox";

export abstract class Component {
  constructor(protected driver: PuppeteerProtocolDriver) {}
}

type PageElementConfigValue =
  | { selector: string; type: ElementType }
  | Component;

type PageElementsConfig = {
  [key: string]: PageElementConfigValue;
};

export class PageElements {
  constructor(
    private config: PageElementsConfig,
    private driver: PuppeteerProtocolDriver,
  ) {}

  async get<T = ElementHandle<Element> | null>(
    nameKey: string,
    timeout?: number,
  ): Promise<T> {
    const component = this.config[nameKey];

    if (component instanceof Component) {
      return component as T;
    }

    let element;
    try {
      element = await this.driver.page.waitForSelector(component.selector, {
        timeout,
      });
    } catch (e) {
      console.log("Element not found", e);
      throw new Error(`Element ${nameKey} not found!`);
    }

    if (!element) {
      throw new Error(
        `Could not load component's element ${nameKey}: maybe it's not on the page yet.`,
      );
    }

    return element as T;
  }
}
