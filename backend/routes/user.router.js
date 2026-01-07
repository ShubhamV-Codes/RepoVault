const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get("/allusers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userprofile/:id", userController.getUserProfile);
userRouter.put("/updateprofile/:id", userController.updateUserProfile);
userRouter.delete("/deleteprofile/:id", userController.deleteUserProfile);

module.exports = userRouter;