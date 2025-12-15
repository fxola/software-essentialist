import { makeAutoObservable, observe } from "mobx";
import { PostsFilterValue, SearchFilterViewModel } from "../viewModels/searchFilterViewModel";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { PostViewModel } from "../viewModels/postViewModel";
import { IPostsStore } from "../../stores/postsStore";
import { Posts } from "@dddforum/api";

export class PostsPresenter {
  postVMs: PostViewModel[];
  searchFilter: SearchFilterViewModel;

  constructor(
    private postsStore: IPostsStore,
    private authStore: AuthStore,
  ) {
    makeAutoObservable(this);
    this.postVMs = [];
    this.searchFilter = new SearchFilterViewModel("popular");
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    observe(this.postsStore, "postsDm", async (posts) => {
      const currentMember = this.authStore.getCurrentMember();
      this.postVMs = posts.newValue.map((post) => PostViewModel.fromDomain(post, currentMember));
    });

    observe(this, "searchFilter", async (searchFilter) => {
      const query = Posts.Queries.GetPostsQuery.create(searchFilter.newValue.value);
      const posts = await this.postsStore.getPosts(query);
      const currentMember = this.authStore.getCurrentMember();
      this.postVMs = posts.map((post) => PostViewModel.fromDomain(post, currentMember));
    });
  }

  async load(callback?: (posts: PostViewModel[], filter: SearchFilterViewModel) => void) {
    const currentMember = this.authStore.getCurrentMember();
    const postsDm = await this.postsStore.getPosts();
    this.postVMs = postsDm.map((post) => PostViewModel.fromDomain(post, currentMember));
    callback && callback(this.postVMs, this.searchFilter);
  }

  switchSearchFilter(nextFilter: PostsFilterValue) {
    this.searchFilter = new SearchFilterViewModel(nextFilter);
  }
}
