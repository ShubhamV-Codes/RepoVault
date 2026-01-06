const getAllUsers = (req,res)=>{
    res.send("All users fetched")
}

const signup = (req,res)=>{
    res.send("User signed up")
}

const login = (req,res)=>{
    res.send("User logged in")
}   

const getUserProfile = (req,res)=>{
    res.send("Profile fetched")
}   

const updateUserProfile = (req,res)=>{
    res.send("Profile updated")
}   

const deleteUserProfile = (req,res)=>{
    res.send("Profile deleted");
}

module.exports = {
    getAllUsers,
    signup, 
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}