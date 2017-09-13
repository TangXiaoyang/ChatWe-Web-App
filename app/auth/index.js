'use strict';

const passport = require('passport');
const config = require('../config');
const u = require('../utils');
const logger = require('../logger');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

module.exports = () => {
    // save the id of this user (from database) to the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    // when the a request comes find it by the id saved in the session
    passport.deserializeUser((id, done) => {
        u.findById(id)
            .then(user => done(null, user))
            .catch(error => logger.log('error', 'Error in deserializing user: ' + error));
    });

    let authProcessor = (accessToken, refreshToken, profile, done) => {
        // find a user at the db by profile.id
        // if the use is found then return the user by done()
        // else create a new one
        u.findOne(profile.id)
            .then(result => {
                if(result){
                    done(null, result);
                }else{
                    u.createNewUser(profile)
                        .then(newUser => done(null, newUser))
                        .catch(error => logger.log('error', "Error in creating a new user:" + error));
                }
            });
    }

    passport.use(new FacebookStrategy(config.fb, authProcessor));
    passport.use(new TwitterStrategy(config.tw, authProcessor));
}
