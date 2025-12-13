import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import { Server } from "socket.io";

import mainRouter from "./routes/mainRouter.js";

import initRepo from "./controllers/init.js";
import addRepo from "./controllers/add.js";
import commitRepo from "./controllers/commit.js";
import pullRepo from "./controllers/pull.js";
import pushRepo from "./controllers/push.js";
import revertRepo from "./controllers/revert.js";

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add file to staging area",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit the staged files",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command("push", "Push commits to S3", {}, pushRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3001;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected...!!!"))
    .catch((err) => console.error("Unable to connect to MongoDB : ", err));

  app.use(cors({ origin: "*" }));

  app.use("/", mainRouter);

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let user = "test";
  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      const user = userID;
      console.log("=====");
      console.log(user);
      console.log("=====");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
    // CRUD operations
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}
