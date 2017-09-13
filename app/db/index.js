'use strict';

const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

Mongoose.connection.on('error', error => {
    console.log("MongoDB Error:", error);
});

const chatUser = new Mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
})

let userModel = Mongoose.model('chatUser', chatUser);

module.exports = {
    Mongoose,
    userModel
}
