import express from "express";
const cors = require("cors");
import { Routes } from "./routes";
import { createServer } from "http";

export function app(appRoutes: Routes) {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use(appRoutes);

  const server = createServer(app);

  const start = (port: number) => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
  };

  const stop = () => {
    console.log("Shutting down gracefully...");
    server.close((err) => {
      if (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
      console.log("Closed out remaining connections");
      process.exit(0);
    });
  };

  return { start, stop };
}
