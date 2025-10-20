const cors = require("cors");

import express, { Express } from "express";
import { Server } from "http";
import { errorHandlerType } from "../errors/handler";

export class Application {
  private app: Express;
  private server?: Server;

  constructor(private errorHandler: errorHandlerType) {
    this.app = express();
    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  public setupRouteHandlers() {
    this.app.use(this.errorHandler);
    this.app.use((req, res) =>
      res.status(404).send({ message: `'${req.url}' Not found` })
    );
  }

  private gracefulShutdown = async () => {
    console.log("\nGracefully shutting down...");
    await this.stop();
    process.exit(0);
  };

  public getServer() {
    return this.app;
  }

  public start(port: number) {
    this.server = this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    process.on("SIGINT", this.gracefulShutdown);
    process.on("SIGTERM", this.gracefulShutdown);
    return this.server;
  }

  public async stop(): Promise<void> {
    if (!this.server) return;
    return new Promise((resolve, reject) => {
      this.server?.close((err) => {
        if (err) return reject(err);
        console.log("Server stopped.");
        resolve();
      });
    });
  }

  public mountRouter(path: string, router: express.Router) {
    this.app.use(path, router);
  }
}
