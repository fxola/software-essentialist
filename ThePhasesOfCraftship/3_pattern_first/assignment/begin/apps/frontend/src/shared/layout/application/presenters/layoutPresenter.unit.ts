import { LayoutPresenter } from "./layoutPresenter";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { createAPIClient } from "@dddforum/api";
import { NavigationStore } from "@/shared/navigation/navigationStore";

import { NavLayoutVm } from "../viewModels/navLayoutVm";
import { setupAuthStoreWithMember } from "@/shared/testUtils";

describe("LayoutPresenter", () => {
  let presenter: LayoutPresenter;
  let authStore: AuthStore;
  let navigationStore: NavigationStore;
  let vm: NavLayoutVm;

  beforeEach(() => {
    const apiClient = createAPIClient("");

    authStore = new AuthStore(apiClient);
    navigationStore = new NavigationStore();
    presenter = new LayoutPresenter(authStore, navigationStore);
  });

  describe("layout", () => {
    it("should show username when member is authenticated", async () => {
      const username = "merkel";

      setupAuthStoreWithMember(authStore, { username });

      await presenter.load((loadedVm) => {
        vm = loadedVm;
      });

      expect(vm.isAuthenticated).toBe(true);
      expect(vm.username).toBe(username);
    });

    it("should show no username when member is not authenticated", async () => {
      await presenter.load((loadedVm) => {
        vm = loadedVm;
      });

      expect(vm.isAuthenticated).toBe(false);
      expect(vm.username).toBe(null);
    });
  });

  describe("actions", () => {
    it("should sign out the member and navigate to home", async () => {
      const username = "merkel";
      const logoutSpy = jest.spyOn(authStore, "logout");
      const navigateSpy = jest.spyOn(navigationStore, "navigate");

      setupAuthStoreWithMember(authStore, { username });

      await presenter.signOut();

      expect(logoutSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith("/");
    });
  });
});
