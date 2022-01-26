// Mongoose's Object Document Mapper(ODM) simplifies working with MongoDB
// import mongoose library
const mongoose = require("mongoose");

const connect = DB_HOST => {
    // Connect to the DB
    mongoose.connect(DB_HOST);
    
    // log error on failure to connect
    mongoose.connection.on('error', err => {
        console.error(err);
        console.log(
            'MongoDB connection error. Please make sure MongoDB is running.'
        );
        process.exit();
    })
}

// close connection with the DB
const close = () => { mongoose.connection.close() }

module.exports = {
    connect,
    close
}