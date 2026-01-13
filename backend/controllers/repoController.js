const { s3, S3_BUCKET } = require("../config/aws-config");
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
  console.log("==================== BACKEND DEBUG ====================");
  console.log("1. Received userID:", userID);
  console.log("2. userID type:", typeof userID);
  
  try {
    const repositories = await Repository.find({ owner: userID }).populate(
      "owner issues"
    );
    
    console.log("3. Found repositories count:", repositories.length);
    console.log("4. Repositories:", JSON.stringify(repositories, null, 2));
    
    if (repositories.length === 0 || !repositories) {
      console.log("5. No repositories found - sending 404");
      return res
        .status(404)
        .json({ error: "No repositories found for this user" });
    }
    
    console.log("6. Sending response with repositories");
    console.log("==================== BACKEND DEBUG END ====================");
    res.status(200).json({ repositories });
  } catch (error) {
    console.log("ERROR in backend:", error);
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

// Add file to repository
async function addFileToRepository(req, res) {
  const { id } = req.params;
  const { filename, content, fileType } = req.body;

  try {
    if (!filename || content === undefined) {
      return res.status(400).json({ error: "Filename and content are required" });
    }

    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    // Check if file already exists
    const existingFile = repository.content.find(f => f.filename === filename);
    if (existingFile) {
      return res.status(400).json({ error: "File already exists" });
    }

    const newFile = {
      filename,
      path: `/${filename}`,
      content,
      fileType: fileType || filename.split('.').pop(),
      size: content.length,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    repository.content.push(newFile);
    await repository.save();

    res.status(201).json({ 
      message: "File added successfully",
      file: newFile 
    });
  } catch (error) {
    console.error("Error adding file:", error);
    res.status(500).json({ error: "Error adding file" });
  }
}

// Update file
async function updateFile(req, res) {
  const { id, filename } = req.params;
  const { content } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const file = repository.content.find(f => f.filename === filename);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    file.content = content;
    file.size = content.length;
    file.updatedAt = new Date();

    await repository.save();

    res.status(200).json({ 
      message: "File updated successfully",
      file 
    });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ error: "Error updating file" });
  }
}

// Delete file
async function deleteFile(req, res) {
  const { id, filename } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    repository.content = repository.content.filter(f => f.filename !== filename);
    await repository.save();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
}

// Get specific file
async function getFile(req, res) {
  const { id, filename } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const file = repository.content.find(f => f.filename === filename);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Error fetching file" });
  }
}




async function pushToRepository(req, res) {
  console.log("🔥 PUSH HIT");
  console.log("PARAMS:", req.params);
  console.log("FILES COUNT:", req.body?.files?.length);

  try {
    const { repoId } = req.params;
    const { files } = req.body;

    if (!repoId) {
      return res.status(400).json({ message: "repoId missing" });
    }

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ message: "files missing" });
    }

    const repository = await Repository.findById(repoId);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const key = `${repoId}/${file.filename}`;

      await s3.putObject({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.content,
        ContentType: "text/plain",
      }).promise();

      uploadedFiles.push({
        filename: file.filename,
        s3Key: key,
        size: file.size,
      });
    }

    // MongoDB me sirf metadata
    repository.content = uploadedFiles;
    await repository.save();

    res.json({ message: "Push successful", files: uploadedFiles });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ message: "Push failed" });
  }
}



async function pullFromRepository(req, res) {
  console.log("🔥 PULL ENDPOINT HIT");
  try {
    const { repoId } = req.params;
    console.log("📦 Repo ID:", repoId);

    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    console.log("📁 Files count:", repo.content.length);

    // S3 se content fetch karo
    const filesWithContent = await Promise.all(
      repo.content.map(async (file) => {
        try {
          console.log("⬇️ Fetching from S3:", file.s3Key);
          
          const s3Object = await s3.getObject({
            Bucket: S3_BUCKET,
            Key: file.s3Key
          }).promise();
          
          const content = s3Object.Body.toString('utf-8');
          console.log("✅ Fetched:", file.filename, "Size:", content.length);
          
          return {
            filename: file.filename,
            content: content,  // ← YE IMPORTANT HAI
            size: file.size,
            s3Key: file.s3Key,
            uploadedAt: file.uploadedAt
          };
        } catch (s3Error) {
          console.error(`❌ S3 Error for ${file.filename}:`, s3Error.message);
          return {
            filename: file.filename,
            content: "// Error loading file",
            size: file.size,
            s3Key: file.s3Key,
            error: true
          };
        }
      })
    );

    console.log("📤 Sending response with content");
    res.json({ files: filesWithContent });
  } catch (err) {
    console.error("❌ Pull error:", err);
    res.status(500).json({ error: "Pull failed" });
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
  addFileToRepository,
  updateFile,
  deleteFile,
  getFile,
  pushToRepository,
  pullFromRepository,
};
