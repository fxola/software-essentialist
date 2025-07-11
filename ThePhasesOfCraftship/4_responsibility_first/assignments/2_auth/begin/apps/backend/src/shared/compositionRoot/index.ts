import { CommentsModule } from "../../modules/comments/commentsModule";
import { MembersModule } from "../../modules/members/membersModule";
import { VotesModule } from "../../modules/votes/votesModule";
import { Application } from "../application/applicationInterface";
import { WebServer } from "../http";
import { NatsEventBus, EventBus } from "@dddforum/bus";
import { MarketingModule, NotificationsModule, PostsModule, UsersModule } from "../../modules";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { EventOutboxTable } from "@dddforum/outbox";

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  
  private eventBus: EventBus;
  private dbConnection: PrismaDatabase;
  private config: Config;
  private webServer!: WebServer;
  private eventsOutboxTable: EventOutboxTable;

  private usersModule!: UsersModule;
  private marketingModule!: MarketingModule;
  
  
  private notificationsModule!: NotificationsModule;
  private commentsModule!: CommentsModule;
  private postsModule!: PostsModule;
  private membersModule!: MembersModule;
  private votesModule!: VotesModule;

  public static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }
    return CompositionRoot.instance;
  }

  private constructor(config: Config) {
    this.config = config;

    // Create services
    this.dbConnection = this.createDBConnection();
    this.eventBus = this.createEventBus();
    this.eventsOutboxTable = this.createEventsTable();
    this.webServer = this.createWebServer();
  }

  async start () {
    // Start services
    await this.dbConnection.connect();
    await this.webServer.start();
    await this.eventBus.initialize();
    
    // Connect modules starting with the root modules (generic)
    this.usersModule = this.createUsersModule();
    this.notificationsModule = this.createNotificationsModule();
    this.marketingModule = this.createMarketingModule();

    // Build the core modules
    this.membersModule = this.createMembersModule();
    this.postsModule = this.createPostsModule();
    this.commentsModule = this.createCommentsModule();
    this.votesModule = this.createVotesModule();
    
    this.mountRoutes();
  }

  async stop () {
    await this.webServer.stop();
    await this.eventBus.stop();
  }

  createCommentsModule () {
    return CommentsModule.build(
      this.dbConnection, 
      this.config,
      this.postsModule.getPostsRepository(),
      this.membersModule.getMembersRepository(),
      this.eventBus,
      this.eventsOutboxTable
    );
  }

  createMembersModule() {
    return MembersModule.build(
      this.dbConnection, 
      this.eventsOutboxTable,
      this.config
    );
  }

  createNotificationsModule() {
    return NotificationsModule.build(this.eventBus, this.config);
  }

  createEventsTable () {
    return new EventOutboxTable(this.getDatabase());
  }

  createMarketingModule() {
    return MarketingModule.build(this.config);
  }

  createUsersModule() {
    return UsersModule.build(
      this.config,
    );
  }

  createVotesModule () {
    return VotesModule.build(
      this.dbConnection,
      this.membersModule.getMembersRepository(),
      this.commentsModule.getCommentsRepository(),
      this.postsModule.getPostsRepository(),
      this.eventBus,
      this.eventsOutboxTable,
      this.config
    );
  }

  createPostsModule() {
    return PostsModule.build(
      this.dbConnection,
      this.config,
      this.eventBus,
      this.membersModule.getMembersRepository(),
      this.eventsOutboxTable,
    );
  }

  getDatabase() {
    if (!this.dbConnection) this.createDBConnection();
    return this.dbConnection;
  }

  getEventBus() {
    return this.eventBus;
  }

  createEventBus() {
    return new NatsEventBus();
  }

  createWebServer() {
    return new WebServer(this.config);
  }

  getWebServer() {
    return this.webServer;
  }

  private mountRoutes() {
    this.usersModule.mountRouter(this.webServer)
    this.marketingModule.mountRouter(this.webServer);
    this.membersModule.mountRouter(this.webServer);
    this.postsModule.mountRouter(this.webServer);
    this.votesModule.mountRouter(this.webServer);
    this.commentsModule.mountRouter(this.webServer);
  }

  private createDBConnection() {
    const config = this.config;
    const dbConnection = new PrismaDatabase(config);
    if (!this.dbConnection) {
      this.dbConnection = dbConnection;
    }
    return dbConnection;
  }

  getApplication(): Application {
    return {
      users: this.usersModule.getUsersService(),
      posts: this.postsModule.getPostsService(),
      marketing: this.marketingModule.getMarketingService(),
      notifications: this.notificationsModule.getNotificationsService(),
      votes: this.votesModule.getVotesService(),
    };
  }

  getTransactionalEmailAPI() {
    return this.notificationsModule.getTransactionalEmailAPI();
  }

  getContactListAPI() {
    return this.marketingModule.getContactListAPI();
  }

  getModule (moduleName: 'members' | 'users' | 'votes' | 'posts' | 'notifications' | 'marketing') {
    switch (moduleName) {
      case 'members':
        return this.membersModule;
      case 'users':
        return this.usersModule;
      case 'posts':
        return this.postsModule;
      case 'votes':
        return this.votesModule;
      case 'notifications':
        return this.notificationsModule;
      case 'marketing':
        return this.marketingModule;
      default:
        throw new Error(`Module ${moduleName} not found`);
    }
  }

  getRepositories() {
    return {
      posts: this.postsModule.getPostsRepository(),
    };
  }
}
