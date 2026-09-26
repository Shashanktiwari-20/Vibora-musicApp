const mongoose = require("mongoose");
const config = require("../Config/config");

const ConnectDB = async ()=>{
    await mongoose.connect(config.MONGO_URI)
    console.log("DataBase Connected")
}

module.exports = ConnectDB;