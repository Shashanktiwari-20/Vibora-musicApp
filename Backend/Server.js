require("dotenv").config();
const App = require("./Src/App")
const ConnectDb = require("./Src/Db/Db")

ConnectDb();

App.listen(3000,()=>{
    console.log("the server is running on port 3000");
})