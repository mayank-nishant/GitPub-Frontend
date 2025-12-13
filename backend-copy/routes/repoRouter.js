import express from "express";
import { createRepository, getAllRepositories, fetchRepositoryById, fetchRepositoryByName, fetchRepositoriesForCurrentUser, updateRepositoryById, deleteRepositoryById, toggleVisibilityById } from "../controllers/repoController.js";

const repoRouter = express.Router();

repoRouter.post("/repo/create", createRepository);
repoRouter.get("/repo/all", getAllRepositories);
repoRouter.get("/repo/:id", fetchRepositoryById);
repoRouter.get("/repo/name/:name", fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", updateRepositoryById);
repoRouter.delete("/repo/delete/:id", deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", toggleVisibilityById);

export default repoRouter;
