import { PrismaClient } from "@prisma/client";

export class PostPersistence {
  private posts;

  constructor(private prisma: PrismaClient) {
    this.posts = this.createPostsPersistence();
  }

  private createPostsPersistence() {
    return {
      getRecentPosts: this.getRecentPosts,
    };
  }

  private getRecentPosts = async () => {
    const recentPosts = await this.prisma.post.findMany({
      include: {
        votes: true,
        memberPostedBy: { include: { user: true } },
        comments: true,
      },
      orderBy: { dateCreated: "desc" },
    });

    return recentPosts;
  };

  public getPersistence() {
    return this.posts;
  }
}
