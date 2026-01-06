const createRepository = (req, res)=>{
    res.send("Repository created");
}
const getAllRepositories = (req, res)=>{
    res.send("All repositories fetched");
}
const fetchRepositoryById = (req, res)=>{
    res.send("Repository fetched by ID");
}
const fetchRepositoriesByName = (req, res)=>{
    res.send("Repository fetched by name");
}
const fetchRepositoryForCurrentUser = (req, res)=>{
    res.send("Repository fetched for current user");
}
const updateRepositoryById = (req, res)=>{
    res.send("Repository updated");
}
const toggleRepositoryVisibility = (req, res)=>{
    res.send("Repository visibility toggled");
}
const deleteRepositoryById = (req, res)=>{
    res.send("Repository deleted");
}

module.exports = {
    createRepository,
    getAllRepositories, 
    fetchRepositoryById,
    fetchRepositoriesByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleRepositoryVisibility,
    deleteRepositoryById
};