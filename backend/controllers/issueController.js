const createIssue = (req, res)=>{ 
    res.send("Issue created");
}
const getAllIssues = (req, res)=>{
    res.send("All issues fetched");
}

const updateIssueById = (req, res)=>{
    res.send("Issue updated");
}
const deleteIssueById = (req, res)=>{
    res.send("Issue deleted");
}   
const getIssueById = (req, res)=>{
    res.send("Issue fetched by ID");
}   
module.exports = {
    createIssue,
    getAllIssues,   
    updateIssueById,
    deleteIssueById,
    getIssueById
};  