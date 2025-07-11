
import express from "express";
import { Queries, API, Commands } from "@dddforum/api/posts";
import { ErrorHandler } from "../../shared/errors";
import { PostsService } from "./application/postsService";

export class PostsController {
  private router: express.Router;

  constructor(
    private postsService: PostsService,
    private errorHandler: ErrorHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.get("/", this.getPosts.bind(this));
    this.router.post("/new", this.createPost.bind(this));
    this.router.get('/:postId', this.getPostById.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async getPosts(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const query = Queries.GetPostsQuery.fromRequest(req.query);
      const posts = await this.postsService.getPosts(query);
      
      const response: API.GetPostsAPIResponse = {
        success: true,
        data: posts.map((p) => p.toDTO()),
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async createPost(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const commandOrError = Commands.CreatePostCommand.fromRequest(req.body);
      if (!commandOrError.isSuccess()) {
        return next(commandOrError.getError());
      }

      const result = await this.postsService.createPost(commandOrError.getValue());
      if (!result.isSuccess()) {
        return next(result.getError());
      }

      const newPost = result.getValue();
      const postDetails = await this.postsService.getPostDetailsById(newPost.id);

      const response: API.CreatePostAPIResponse = {
        success: true,
        data: postDetails?.toDTO()
      };

      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  private async getPostById (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const query = Queries.GetPostByIdQuery.fromRequest(req);
      const postOrNothing = await this.postsService.getPostDetailsById(query.postId);

      if (postOrNothing === null) {
        // Improvement: Handle these consistently and with strict types
        return res.status(404).json({
          success: false,
          data: undefined,
          error: {
            code: "PostNotFound",
            message: "Post not found."
          }
        });
      } else {
        const response: API.GetPostByIdAPIResponse = {
          success: true,
          data: postOrNothing.toDTO()
        };
        // Improvement: Handle these consistently and with strict types
        return res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  }
}
