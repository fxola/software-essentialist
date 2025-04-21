import { Server } from "http";
import { AssignmentController } from "./domain/assignments/assignment-controller";
import { ClassController } from "./domain/classes/class-controller";
import { StudentController } from "./domain/students/student-controller";
import express, { Express } from "express";
const cors = require("cors");

export class Application {
  private instance: Express;
  private server?: Server;

  constructor(
    private assignmentController: AssignmentController,
    private classController: ClassController,
    private studentController: StudentController
  ) {
    this.instance = express();
    this.setupMiddlewares();
    this.mountRoutes();
  }

  private setupMiddlewares() {
    this.instance.use(express.json());
    this.instance.use(cors());
  }

  private mountRoutes() {
    this.instance.use("/assignments", this.assignmentController.getRouter());
    this.instance.use("/students", this.studentController.getRouter());
    this.instance.use("/classes", this.classController.getRouter());

    this.instance.use((req, res) =>
      res
        .status(404)
        .send({ error: "Not Found", message: `Not found '${req.url}'` })
    );
  }

  public start(port = process.env.PORT || 3000) {
    this.server = this.instance.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    process.on("SIGINT", this.gracefulShutdown);
    process.on("SIGTERM", this.gracefulShutdown);
  }

  private gracefulShutdown = async () => {
    console.log("\nGracefully shutting down...");
    await this.stop();
    process.exit(0);
  };

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
}
