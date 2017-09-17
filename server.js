'use strict';

const express = require('express');
const app = express();
const chatCat = require('./app');
const passport = require('passport');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(chatCat.session);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', chatCat.router);


chatCat.ioServer(app).listen(process.env.PORT || 3000);
