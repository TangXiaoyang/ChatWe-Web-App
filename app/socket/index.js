'use strict';
const u = require('../utils');

module.exports = (io, app) => {
    let allRooms = app.locals.chatrooms;

    io.of('/roomlist').on('connection', socket => {
        socket.on('getRoomList', () => {
            socket.emit('roomlist', JSON.stringify(allRooms));
        });
        socket.on('createNewRoom', newRoom => {
            if(!u.hasRoom(allRooms, newRoom)){
                allRooms.push({
                    roomName: newRoom,
                    roomID: u.randomID(),
                    users: []
                });
                socket.emit('roomlist', JSON.stringify(allRooms));
                socket.broadcast.emit('roomlist', JSON.stringify(allRooms));
            }
        });
    });

    io.of('/chatters').on('connection', socket => {
        socket.on('join', data => {
            let updatedRoom = u.addUserToRoom(allRooms, data, socket);

            socket.emit('updateChatters', JSON.stringify(updatedRoom.users));
            socket.broadcast.to(data.roomID).emit('updateChatters', JSON.stringify(updatedRoom.users));
        });

        socket.on('disconnect', () => {
            let updatedRoom = u.removeUserFromRoom(allRooms, socket);

            socket.broadcast.to(updatedRoom.roomID).emit('updateChatters', JSON.stringify(updatedRoom.users));
        });

        socket.on('newMessage', data => {
            socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
        });
    });
}
