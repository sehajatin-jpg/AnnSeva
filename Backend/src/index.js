import { app } from "./app.js";
import db_connect from "./db/index.js";

const port = process.env.PORT || 3000;

db_connect()
.then(()=>{
    app.listen(port,()=>{
        console.log("App listening on port: ",port)
    })
    app.on("Error",(err)=>{
        console.log("Error: ",err)
        throw err
    })
})
.catch((err)=>{
    console.log("MongoDB connection Failed!! ",err)
    throw err
})