const mongoose = require("mongoose");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");
const Repository = require("../models/repoModel");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;
  try {
    if (!title) {
      return res.status(400).send({ error: "Issue title is required" });
    }

    const newIssue = new Issue({
      title,
      description,
      repository: id,
    });
    const result = await newIssue.save();

    res.status(201).json({
      message: "Issue Created",
      issueID: result._id,
    });
  } catch (error) {
    res.status(500).send({ error: "Error creating issue" });
    console.error("Error creating issue:", error);
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params;
  try {
    const issues = await Issue.find({ repository: id }).populate("repository");
    if (!issues) {
      return res
        .status(404)
        .json({ error: "No issues found for this repository" });
    }
    res.status(200).json(issues);
  } catch (error) {
    console.log("Error during fetching all issues:", error);
    res.status(500).json({ error: "Error fetching issues" });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const updatedIssue = await Issue.findById(id);
    if (title) updatedIssue.title = title;
    if (description) updatedIssue.description = description;
    if (status) updatedIssue.status = status;
    await updatedIssue.save();
    res
      .status(200)
      .json({ message: "Issue updated successfully", updatedIssue });
  } catch (error) {
    console.log("Error during updating issue by ID:", error);
    res.status(500).json({ error: "Error updating issue" });
    if (!updatedIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;
  try {
    const deletedIssue = await Issue.findByIdAndDelete(id);
    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.log("Error during deleting issue by ID:", error);
    res.status(500).json({ error: "Error While Deleting the Issue" });
  }
}

async function getIssueById(req, res) {
  const {id} = req.params;
  try {
    const issue = await Issue.findById(id).populate("repository");
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.status(200).json(issue);
  } catch (error) {
    console.log("Error during fetching issue by ID:", error);
    res.status(500).json({ error: "Error fetching issue" });
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  updateIssueById,
  deleteIssueById,
  getIssueById,
};
