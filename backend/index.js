const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const {Server} = require("socket.io");
const mainRouter = require("./routes/main.router");


const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");

const {initRepo} = require("./controllers/init");
const {addRepo} = require("./controllers/add");
const {commitRepo} = require("./controllers/commit");
const {pushRepo} = require("./controllers/push");
const {pullRepo} = require("./controllers/pull");
const {revertRepo} = require("./controllers/revert");

dotenv.config();


yargs(hideBin(process.argv))
//Starting Main Backend Server
.command("start", "Start the backend server", {},startServer)
//Initialize Repository
.command('init',"Initialize a new repository",{},initRepo)

//Add file to Repository
.command("add <file>","Add a file to the repository",(yargs)=>{
    yargs.positional("file",{
        describe:"File to be added to the repository",
        type:"string"
    });
},(argv)=>{
    addRepo(argv.file);
})

//Commit changes to Repository
.command("commit <message>","Commit changes to the repository",(yargs)=>{
    yargs.positional("message",{
        describe:"Commit message",
        type:"string"
    });
},(argv)=>{
    commitRepo(argv.message);
})

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
},(argv)=>{
    revertRepo(argv.commitID);
})

.demandCommand(1, "You need atleast one command")
.help().argv;

function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(bodyParser.json());
    
    app.use(express.json());
    const mongoURI = process.env.MONGODB_URI ;
    
    mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB"); })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
        });
        
        app.use(cors({origin :"*"}));

        app.use("/", mainRouter);
        
        
        let user = "testUser";

        const httpServer = http.createServer(app);
        const io = new Server (httpServer,{
            cors:{
                origin:"*",
                methods:["GET","POST"]
            }
        });
        
        io.on("connection", (socket)=>{
            socket.on("joinRoom",(userID)=>{
                user = userID;
                console.log("=====");
                console.log(`User connected: ${user}`);
                console.log("=====");
                socket.join(userID);
            });
        });

        const db = mongoose.connection;
        db.once("open",()=>{
            console.log("CRUD operation called");
        });

        httpServer.listen(port, ()=>{
            console.log(`Server is running on port: ${port}`);
        });


}