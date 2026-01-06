const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("MongoDB connected (MongoClient)");
  }
}

async function signup(req, res) {
  try {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    await connectClient();
    const db = client.db("repovault");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId }, 
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

const login = (req, res) => {
  res.status(200).json({ message: "User logged in" });
};

const getAllUsers = (req, res) => {
  res.status(200).json({ message: "All users fetched" });
};

const getUserProfile = (req, res) => {
  res.status(200).json({ message: "Profile fetched" });
};

const updateUserProfile = (req, res) => {
  res.status(200).json({ message: "Profile updated" });
};

const deleteUserProfile = (req, res) => {
  res.status(200).json({ message: "Profile deleted" });
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
