'use strict';
const router = require('express').Router();
const passport = require('passport');
const u = require('../utils');
const config = require('../config');

router.get('/', (req, res, next) => res.render('login'));
router.get('/rooms', [u.isAuthenticated, (req, res, next) => res.render('rooms', {
    user: req.user,
    host: config.host
})]);
router.get('/chatroom/:id', [u.isAuthenticated, (req, res, next) => {
    let findRoom = u.findRoomById(req.app.locals.chatrooms, req.params.id);
    if(findRoom !== undefined){
        res.render('chatroom', {
            user: req.user,
            host: config.host,
            roomName: findRoom.roomName,
            roomID: findRoom.roomID
        });
    }else{
        return next();
    }
}]);
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/rooms',
        failureRedirect: '/'
    }));
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/rooms',
    failureRedirect: '/'
}));
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.use((req, res, next) => res.render('404'));

module.exports = {
    router: router
}
