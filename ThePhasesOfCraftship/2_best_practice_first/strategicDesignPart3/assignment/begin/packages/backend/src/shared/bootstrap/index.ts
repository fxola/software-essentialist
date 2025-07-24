import { PrismaClient } from "@prisma/client";
import { Database } from "../database";
import { UserService } from "../../modules/users/user-service";
import { PostService } from "../../modules/posts/post-service";
import { MarketingService } from "../../modules/marketing/marketing-service";
import { MailingListAPI } from "../../modules/marketing/mailing-list-api";
import { UserController } from "../../modules/users/user-controlller";
import { PostController } from "../../modules/posts/post-controller";
import { MarketingController } from "../../modules/marketing/marketing-controller";
import { UserRoutes } from "../../modules/users/user-routes";
import { PostRoutes } from "../../modules/posts/post-route";
import { MarketingRoutes } from "../../modules/marketing/marketing-route";
import { AppRoutes } from "../routes";
import { Application } from "../application";
import { errorHandler } from "../errors/handler";

export const prisma = new PrismaClient();

const db = new Database(prisma);
export const mailingListAPI = new MailingListAPI();

const userService = new UserService(db);
const postService = new PostService(db);
const marketingService = new MarketingService(mailingListAPI);

const userController = new UserController(userService);
const postController = new PostController(postService);
const marketingController = new MarketingController(marketingService);

const userRoutes = new UserRoutes(userController);
const postRoutes = new PostRoutes(postController);
const marketingRoutes = new MarketingRoutes(marketingController);

const appRoutes = new AppRoutes(userRoutes, postRoutes, marketingRoutes);

export const app = new Application(appRoutes, errorHandler);
