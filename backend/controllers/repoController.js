const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

async function createRepository(req, res) {
    
const{owner,name,issues, description, content, visibility} = req.body;


    try{
        if(!name){
            return res.status(400).send({error: 'Repository name is required'});
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({error: 'Invalid owner ID'});
        }
        
        const newRepository = new Repository({
            name, description, content, visibility, owner, issues
        });
        const result = await newRepository.save();
         
        res.status(201).json({
            message:"Repository Created", repositoryID: result._id
        });

    }catch(error){
        res.status(500).send({error: 'Error creating repository'});
        console.error('Error creating repository:', error);
    }
    
}
async function getAllRepositories(req, res){
    res.send("All repositories fetched");
}
async function fetchRepositoryById (req, res){
    res.send("Repository fetched by ID");
}
async function fetchRepositoriesByName (req, res){
    res.send("Repository fetched by name");
}
async function fetchRepositoryForCurrentUser (req, res){
    res.send("Repository fetched for current user");
}
async function updateRepositoryById (req, res){
    res.send("Repository updated");
}
async function toggleRepositoryVisibility (req, res){
    res.send("Repository visibility toggled");
}
async function deleteRepositoryById (req, res) {
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