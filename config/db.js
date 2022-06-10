const mongoose = require('mongoose');
const config = require('config');
const { defaults } = require('request');
const db = config.get('MONGOURI');

const connectDB = async()=>{
    try{
        await mongoose.connect(db,{
    
        });

        console.log("Connected to MongoDB...");
    }catch(err){
        console.error(err.message);
        // exit the process with failure
        process.exit(1);
    }
}

module.exports = connectDB;
