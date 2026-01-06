const express = require('express');
const issueController = require('../controllers/issueController');

const issueRouter = express.Router();

issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.get("/issue/:id", issueController.getIssueById);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);

module.exports = issueRouter;