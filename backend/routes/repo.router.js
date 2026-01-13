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
repoRouter.post("/repo/:repoId/push", repoController.pushToRepository);
repoRouter.get("/repo/:repoId/pull", repoController.pullFromRepository);

repoRouter.post("/repo/:id/file", repoController.addFileToRepository);
repoRouter.put("/repo/:id/file/:filename", repoController.updateFile);
repoRouter.delete("/repo/:id/file/:filename", repoController.deleteFile);
repoRouter.get("/repo/:id/file/:filename", repoController.getFile);

module.exports = repoRouter;