const express = require('express');
const repoController = require('../controllers/repoController');

const repoRouter = express.Router();

repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoriesByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoryForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleRepositoryVisibility);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);

module.exports = repoRouter;