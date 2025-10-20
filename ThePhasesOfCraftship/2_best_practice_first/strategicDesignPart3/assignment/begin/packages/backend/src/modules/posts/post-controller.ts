import { NextFunction, Request, Response } from "express";
import { GetPostDTO } from "./post-dto";
import { PostService } from "./post-service";

export class PostController {
  constructor(private postService: PostService) {}

  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = GetPostDTO.prepare(req.query);
      const postsWithVotes = await this.postService.getPosts(dto);

      return res.json({
        error: undefined,
        data: { posts: postsWithVotes },
        success: true,
      });
    } catch (e) {
      next(e);
    }
  };
}
