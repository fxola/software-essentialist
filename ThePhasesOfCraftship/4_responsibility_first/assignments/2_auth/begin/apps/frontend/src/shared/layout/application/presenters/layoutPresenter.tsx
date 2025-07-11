
import { makeAutoObservable, reaction } from "mobx";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { NavLayoutVm } from "../viewModels/navLayoutVm";

export class LayoutPresenter {
  // Declare a view model. This is what the component will use to 
  // render properly. Keep this as flat as possible.
  public navLayoutVm: NavLayoutVm | null;

  constructor(
    // Here we have 'stores' or 'repos'. At the end of the day, they are the 
    // same thing. They are objects which store and return 'domain models' for us.
    // These objects can act similarly to that of repositories in a DDD context, because they
    // abstract the complexity of how we fetch/retrieve these objects. Perhaps they use local storage,
    // perhaps they use APIs. Perhaps both. Doesn't matter to the presenter. What is important
    // is that repositories expose the domain objects we need in order to construct the 
    // view models (see 'setupSubscriptions' below).
    public authStore: AuthStore,
    public navigationStore: NavigationStore
  ) {
    // Always make this presenter observable so that the component can subscribe to
    // the view model changes (see the load pattern we use).
    makeAutoObservable(this);
    // In the constructor, we also always do these 3 things. make auto observable, 
    // setup subscriptions, and initialize the view model with null.
    this.setupSubscriptions();
    this.navLayoutVm = null;
  }

  // What is a subscription? A subscription is how we create the view model.
  // Basically this is 'subscribeToDomainModelChangesToRebuildViewModel'. That's
  // what we're doing here. It's a chain.
  private setupSubscriptions () {
    reaction(
      () => ({
        currentPath: this.navigationStore.currentPath,
        user: this.authStore.authState.user,
        member: this.authStore.authState.member,
      }),
      ({ user, member, currentPath }) => {
        // When any of these properties of the store/repos (domain models) changes,
        // that's when it's time for us to re-create the view model.
        // Again, as soon as this happens, because the component subscribes to the
        // view model within the presenter with 'useEffect', that's what will trigger
        // the re-render.

        const newNavLayoutVm = NavLayoutVm.fromDomain(user, member, currentPath);

        // Only update if the value has changed
        // Note: we may need to introduce a 'compareTo' on these view models.
        // That would make for a good base class.
        if (this.navLayoutVm !== newNavLayoutVm) {
          this.navLayoutVm = newNavLayoutVm;
        }
      }
    );
  }

  // This is the last part 
  async load(callback?: (navLayoutVm: NavLayoutVm) => void) {
    if (this.navLayoutVm === null) {
      let user = await this.authStore.getCurrentUser();
      let member = await this.authStore.getCurrentMember();
      let pathname = await this.navigationStore.getCurrentPath();
      this.navLayoutVm = NavLayoutVm.fromDomain(user, member, pathname);
    }

    // Why do we return via callback and via promise? This is a conventional presenter
    // pattern that we use to make presenters accessible regardless of the view layer
    // library and regardless of the context (ie: we may be running production code, or
    // we may be writing a test). This pattern allows us to handle both and to synchronize
    // the way that we do them so that we can use TDD to drive our implementations.
    callback && callback(this.navLayoutVm);
    return this.navLayoutVm;
  }

  // Finally, because presenters are effectively Application Level 3 abstractions,
  // they can also perform application logic for us, acting similarly to that of use
  // cases on the backend. If all of the other methods you've seen so far are "convention",
  // these are the Use Case methods. These are the vertical slices. Everything else is
  // just convention to get things working.
  async signOut () {
    await this.authStore.logout();
    // Log out and then take them back to main
    this.navigationStore.navigate('/');
  }
}
