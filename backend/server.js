const app=require("./app");
const connectDatabase = require("./db/Database");


// handling uncaught Exception

process.on("uncaughtException",(error)=>{
  console.log(`Error: ${error.message}`);
  console.log("shutting down the server for handling uncaught exception");
  
  
})

//config

if(process.env.NODE_ENV !== "PRODUCTION"){
require("dotenv").config({
  path:"backend/config/.env"
})
}

//connect db
connectDatabase();


const server=app.listen(process.env.PORT,()=>{
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  
})

//unhandled promise rejection

process.on("unhandledRejection",(error)=>{
  console.log(`Shutting down the server for ${error.message}`);
  console.log(`Shutting down the server for unhandle promise rejection`);
  
  server.close(()=>{
    process.exit(1)
  })
})