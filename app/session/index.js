'use strict';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db')

if(process.env.NODE_ENV === 'production'){
    console.log('runing in production mode');
    module.exports = session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: db.Mongoose.connection
        })
    });
}else{
    console.log('runing in development mode');
    module.exports = session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
    });
}
