import { PuppeteerProtocolDriver } from "../protocol-driver";
import { RegistrationPage } from "./registration";
import { MainPage } from "./main";
import { HeaderComponent } from "../components/header";
import { NotificationsComponent } from "../components/notification";

export interface App {
  pages: {
    main: MainPage;
    registration: RegistrationPage;
  };
  layout: {
    header: HeaderComponent;
  };
  notifications: NotificationsComponent;
}

export const createAppObject = (
  driver: PuppeteerProtocolDriver,
  baseUrl: string,
): App => {
  return {
    pages: {
      main: new MainPage(driver),
      registration: new RegistrationPage(driver, baseUrl),
    },
    layout: {
      header: new HeaderComponent(driver),
    },
    notifications: new NotificationsComponent(driver),
  };
};
