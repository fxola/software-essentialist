import { PostsStore } from "@/modules/posts/repos/postsStore";
import { AuthStore } from "@/modules/auth/authStore";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { CommentsStore } from "@/modules/comments/repos/commentsStore";
import { makeAutoObservable } from "mobx";

export class Stores {
  constructor(
    public auth: AuthStore, // users, auth, member
    public posts: PostsStore,
    public navigation: NavigationStore,
    public comments: CommentsStore
  ) {
    makeAutoObservable(this);
  }
} 