'use strict';

if(process.env.NODE_ENV === 'production'){
    module.exports = {
        host: process.env.host || "",
        dbURI: process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        fb: {
            clientID: process.env.fbClientID,
            clientSecret: process.env.fbClientSecret,
            callbackURL: prrocess.env.host + "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        tw: {
            consumerKey: process.env.twConsumerKey,
            consumerSecret: process.env.twConsumerSecret,
            callbackURL: process.env.host + "/auth/twitter/callback",
            profileFields: ['id', 'displayName', 'photos']
        }
    }
}else{
    module.exports = require('./development.json');
}
