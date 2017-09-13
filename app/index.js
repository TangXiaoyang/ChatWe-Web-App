'use strict';
require('./auth')();

let ioServer = app => {
    app.locals.chatrooms = [];
    const httpServer = require('http').Server(app);
    const io = require('socket.io')(httpServer);
    // io.use((socket, next) => {
    //     require('./session')(socket.request, {}, next);
    // });
    require('./socket')(io, app);
    return httpServer;
}

module.exports = {
    router: require('./routes').router,
    session: require('./session'),
    ioServer
}
