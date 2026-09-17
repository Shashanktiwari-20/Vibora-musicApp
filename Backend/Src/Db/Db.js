const mongoose = require("mongoose");

const ConnectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DataBase Connected")
}

module.exports = ConnectDB;