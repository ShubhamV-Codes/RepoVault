const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);


async function revertRepo(commitID){
    const repoPath = path.resolve(process.cwd(),".repogit");
    const commitsPath = path.join(repoPath,"commits");

    try{
        const commitDir = path.join(commitsPath,commitID);
        const files = await readdir(commitDir);
        const parentDir = path.resolve(repoPath,"..");
        for(const file of files){
            const srcPath = path.join(commitDir,file);
            const destPath = path.join(parentDir,file);
            await copyFile(srcPath,destPath);
        }
        console.log(`Reverted to commit ${commitID} successfully.`);

    }catch(err){
        console.log("Unable to Revert: ", err);
    }
    
}
module.exports = {revertRepo};