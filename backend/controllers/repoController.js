const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) {
  const { owner, name, issues, description, content, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).send({ error: "Repository name is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid owner ID" });
    }

    const newRepository = new Repository({
      name,
      description,
      content,
      visibility,
      owner,
      issues,
    });
    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository Created",
      repositoryID: result._id,
    });
  } catch (error) {
    res.status(500).send({ error: "Error creating repository" });
    console.error("Error creating repository:", error);
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({}).populate("owner issues");
    res.status(200).json(repositories);
  } catch (error) {
    console.log("Error during fetching all repositories:", error);
    res.status(500).json({ error: "Error fetching repositories" });
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findById({ _id: id }).populate(
      "owner issues"
    );
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    res.status(200).json(repository);
  } catch (error) {
    console.log("Error during fetching repository by ID:", error);
    res.status(500).json({ error: "Error fetching repository" });
  }
}

async function fetchRepositoriesByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.findOne({ name: name }).populate(
      "owner issues"
    );
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    res.status(200).json(repository);
  } catch (error) {
    console.log("Error during fetching repository by name:", error);
    res.status(500).json({ error: "Error fetching repository" });
  }
}

async function fetchRepositoryForCurrentUser(req, res) {
  const { userID } = req.params;
  try {
    const repositories = await Repository.find({ owner: userID }).populate(
      "owner issues"
    );
    if (repositories.length === 0 || !repositories) {
      return res
        .status(404)
        .json({ error: "No repositories found for this user" });
    }
    res.status(200).json(repositories);
  } catch (error) {
    console.log("Error during fetching repositories for current user:", error);
    res.status(500).json({ error: "Error fetching repositories" });
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description, name } = req.body;
  try {
    const repository = await Repository.findByIdAndUpdate(
      id,
      { content, description, name },
      { new: true }
    );
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    res.status(200).json(repository);
  } catch (error) {
    console.log("Error during updating repository:", error);
    res.status(500).json({ error: "Error updating repository" });
  }
}

async function toggleRepositoryVisibility(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    const updatedRepository = await Repository.findByIdAndUpdate(
      id,
      { visibility: !repository.visibility },
      { new: true }
    );
    res.status(200).json(updatedRepository);
  } catch (error) {
    console.log("Error during toggling repository visibility:", error);
    res.status(500).json({ error: "Error toggling repository visibility" });
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    console.log("Error during deleting repository:", error);
    res.status(500).json({ error: "Error deleting repository" });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoriesByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  toggleRepositoryVisibility,
  deleteRepositoryById,
};
