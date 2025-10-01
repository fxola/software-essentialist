import { makeAutoObservable, reaction } from "mobx";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { NavLayoutVm } from "../viewModels/navLayoutVm";

export class LayoutPresenter {
  public navLayoutVm: NavLayoutVm | null;

  constructor(
    public authStore: AuthStore,
    public navigationStore: NavigationStore,
  ) {
    makeAutoObservable(this);
    this.setupSubscriptions();
    this.navLayoutVm = null;
  }

  private setupSubscriptions() {
    reaction(
      () => ({ user: this.authStore.getCurrentUser(), member: this.authStore.getCurrentMember(), currentPath: this.navigationStore.getCurrentPath() }),
      ({ user, member, currentPath }) => {
        const newNavLayoutVm = NavLayoutVm.fromDomain(user, member, currentPath);

        if (newNavLayoutVm != this.navLayoutVm) {
          this.navLayoutVm = newNavLayoutVm;
        }
      },
    );
  }

  async load(callback?: (navLayoutVm: NavLayoutVm) => void) {
    if (this.navLayoutVm === null) {
      const user = this.authStore.getCurrentUser();
      const member = this.authStore.getCurrentMember();
      const pathname = this.navigationStore.getCurrentPath();
      this.navLayoutVm = NavLayoutVm.fromDomain(user, member, pathname);
    }
    callback && callback(this.navLayoutVm);
    return this.navLayoutVm;
  }

  async signOut() {
    this.authStore.logout();
    this.navigationStore.navigate("/");
    this.navLayoutVm = null;
  }
}
