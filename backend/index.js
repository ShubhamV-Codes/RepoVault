const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");

const {initRepo} = require("./controllers/init");
const {addRepo} = require("./controllers/add");
const {commitRepo} = require("./controllers/commit");
const {pushRepo} = require("./controllers/push");
const {pullRepo} = require("./controllers/pull");
const {revertRepo} = require("./controllers/revert");

yargs(hideBin(process.argv))
//Initialize Repository
.command('init',"Initialize a new repository",{},initRepo)

//Add file to Repository
.command("add <file>","Add a file to the repository",(yargs)=>{
    yargs.positional("file",{
        describe:"File to be added to the repository",
        type:"string"
    });
},addRepo)

//Commit changes to Repository
.command("commit <message>","Commit changes to the repository",(yargs)=>{
    yargs.positional("message",{
        describe:"Commit message",
        type:"string"
    });
},commitRepo)

//Push changes to Remote Repository
.command("push","Push commits to S3",{},pushRepo)

//Pull changes from Remote Repository
.command("pull","Pull commits from S3",{},pullRepo)

//Revert to a previous commit
.command("revert <commitID>","Revert to a previous commit",(yargs)=>{
    yargs.positional("commitID",{
        describe:"Commit ID to revert to",
        type:"string"
    });
},revertRepo)

.demandCommand(1, "You need atleast one command")
.help().argv;