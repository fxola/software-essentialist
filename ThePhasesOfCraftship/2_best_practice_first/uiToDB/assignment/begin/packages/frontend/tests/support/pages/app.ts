class RegistrationPage {}
class MainPage {}
class HeaderComponent {}
class NotificationsComponent {}

interface App {
  pages: {
    main: MainPage;
    registration: RegistrationPage;
  };
  layout: {
    header: HeaderComponent;
  };
  notifications: NotificationsComponent;
}

export const createAppObject = (): App => {
  return {
    pages: {
      main: new MainPage(),
      registration: new RegistrationPage(),
    },
    layout: {
      header: new HeaderComponent(),
    },
    notifications: new NotificationsComponent(),
  };
};
