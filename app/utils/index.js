'use strict';

const db = require('../db');
const crypto = require('crypto');


let findOne = id => {
    return db.userModel.findOne({
        'profileId': id
    });
}

let createNewUser = profile => {
    return new Promise((resolve, reject) => {
        let newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ''
        });
        newChatUser.save(error => {
            if(error){
                reject(error);
            }else{
                resolve(newChatUser);
            }
        });
    });
}

let findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (error, user) => {
            if(error){
                reject(error);
            }else{
                resolve(user);
            }
        });
    });
}

let isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
}

let hasRoom = (allRooms, room) => {
    for(let r of allRooms){
        if(room === r.roomName) return true;
    }
    return false;
}

let randomID = () => {
    return crypto.randomBytes(24).toString('hex');
}

let findRoomById = (allRooms, roomID) => {
    for(let room of allRooms){
        if(room.roomID === roomID) return room;
    }
    return undefined;
}

let addUserToRoom = (allRooms, data, socket) => {
    let room = findRoomById(allRooms, data.roomID);
    if(room !== undefined) {
        let userIndex = room.users.findIndex((element, index, array) => {
            if(element.userID === data.userID) return true;
            else return false;
        });
        if(userIndex > -1){
            room.users.splice(userIndex, 1);
        }
        room.users.push({
            socketID: socket.id,
            userID: data.userID,
            userName: data.userName,
            userPic: data.userPic
        });

        socket.join(data.roomID);

        return room;
    }

}

let removeUserFromRoom = (allRooms, socket) => {
    for(let room of allRooms){
        let userIndex = room.users.findIndex((element, index, array) => {
            if(element.socketID == socket.id) return true;
            else return false;
        });

        if(userIndex > -1){
            room.users.splice(userIndex, 1);
            socket.leave(room.roomID);
            return room;
        }
    }
}


module.exports = {
    findOne,
    createNewUser,
    findById,
    isAuthenticated,
    hasRoom,
    randomID,
    findRoomById,
    addUserToRoom,
    removeUserFromRoom
};
