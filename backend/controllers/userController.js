
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

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

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    await connectClient();
    const db = client.db("repovault");
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({ success: true, token, userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getAllUsers(req, res) {
  try {
    await connectClient();
    const db = client.db("repovault");
    const usersCollection = db.collection("users");
    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .toArray();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getUserProfile(req, res) {
  const currentID = req.params.id;
  if (!ObjectId.isValid(currentID)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  try {
    await connectClient();
    const db = client.db("repovault");
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne(
      { _id: new ObjectId(currentID) },
      { projection: { password: 0 } }
    );
    if (!user) {
      return res.status(404).json({ message: "User not Found!" });
    }
    return res.status(200).json({
      message: "User Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// async function updateUserProfile(req, res) {
//   const currentID = req.params.id;
//   const { email, password } = req.body;

//   if (!ObjectId.isValid(currentID)) {
//     return res.status(400).json({ message: "Invalid User ID" });
//   }
//   try {
//     await connectClient();
//     const db = client.db("repovault");
//     const usersCollection = db.collection("users");

//     const updateFields = {};

//     if (email) updateFields.email = email;

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       updateFields.password = hashedPassword;
//     }

//     if (Object.keys(updateFields).length === 0) {
//       return res.status(400).json({ message: "No fields to update" });
//     }

//     const result = await usersCollection.findOneAndUpdate(
//       { _id: new ObjectId(currentID) },
//       { $set: updateFields, $currentDate: { updatedAt: true } },
//       { returnDocument: "after", projection: { password: 0 }, upsert: false }
//     );
//     if (!result) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     return res.status(200).json({
//   message: "Profile updated successfully",
//   user: result.value
//   });

//   } catch (error) {
//     console.error("Update user profile error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  if (!ObjectId.isValid(currentID)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  try {
    await connectClient();
    const db = client.db("repovault");
    const usersCollection = db.collection("users");

    const updateFields = {};

    // Check if email already exists for a different user
    if (email) {
      const existingUser = await usersCollection.findOne({ 
        email: email,
        _id: { $ne: new ObjectId(currentID) } // Exclude current user
      });
      
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      
      updateFields.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentID) },
      { $set: updateFields, $currentDate: { updatedAt: true } },
      { returnDocument: "after", projection: { password: 0 } }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: result
    });

  } catch (error) {
    console.error("Update user profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;
  if (!ObjectId.isValid(currentID)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  try {
    await connectClient();
    const db = client.db("repovault");
    const usersCollection = db.collection("users");
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    console.error("Delete user profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
