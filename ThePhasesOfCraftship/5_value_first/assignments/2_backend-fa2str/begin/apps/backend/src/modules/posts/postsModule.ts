
import { WebServer } from "../../shared/http/webServer";
import { ApplicationModule } from "../../shared/modules/applicationModule";
import { PostsController } from "./postsController";
import { postsErrorHandler } from "./postsErrors";
import { ProductionPostsRepository } from "./repos/adapters/productionPostsRepository";
import { PostsRepository } from "./repos/ports/postsRepository";
import { MembersRepository } from "../members/repos/ports/membersRepository";
import { PostsService } from "./application/postsService";
import { Database, PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { EventBus } from "@dddforum/bus";
import { EventOutboxTable } from "@dddforum/outbox";

export class PostsModule extends ApplicationModule {
  private postsRepository: PostsRepository;
  private postsService: PostsService;
  private postsController: PostsController;

  private constructor(
    private db: Database,
    config: Config,
    private eventBus: EventBus,
    private membersRepository: MembersRepository,
    private eventsTable: EventOutboxTable
  ) {
    super(config);
    this.postsRepository = this.createPostsRepository();
    this.postsService = this.createPostsService(membersRepository);
    this.postsController = this.createPostsController();
  }

  static build(
    db: PrismaDatabase, 
    config: Config, 
    eventBus: EventBus, 
    membersRepository: MembersRepository,
    eventsTable: EventOutboxTable
  ) {
    return new PostsModule(db, config, eventBus, membersRepository, eventsTable);
  }

  private createPostsRepository() {
    if (this.postsRepository) return this.postsRepository;

    // if (this.shouldBuildFakeRepository) {
    //   return InMemoryPostsRepository.createWithSeedData();
    // }

    return new ProductionPostsRepository(this.db, this.eventsTable);
  }

  private createPostsService(membersRepository: MembersRepository) {
    return new PostsService(this.postsRepository, membersRepository);
  }

  private createPostsController() {
    return new PostsController(this.postsService, postsErrorHandler);
  }

  public getPostsController() {
    return this.postsController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/posts", this.postsController.getRouter());
  }

  public getPostsService() {
    return this.postsService;
  }

  public getPostsRepository() {
    return this.postsRepository;
  }
}
