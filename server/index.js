const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const shortid = require('shortid');

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const Room = function (user) {
  this.id = shortid.generate();
  this.users = new Set([user]);
  return this;
};
Room.prototype.addUser = function (newUser) {
  this.users.add(newUser);
  return this;
};
Room.prototype.removeUser = function (user) {
  this.users.delete(user);
  return this;
};
Room.prototype.getUserCount = function () {
  return this.users.size;
};
Room.prototype.getId = function () {
  return this.id;
};
Room.prototype.toString = function () {
  return `${this.id} - ${this.users.size}`;
};
const RoomList = function () {
  this.rooms = [];
};
RoomList.prototype.addRoom = function (user) {
  const newRoom = new Room(user);
  this.rooms.push(newRoom);
  return newRoom.id;
};
RoomList.prototype.removeRoom = function (roomId) {
  this.rooms.splice(this.rooms.findIndex(room => room.id === roomId), 1);
};
RoomList.prototype.removeUserFromRoom = function (user, roomId) {
  if (
    this
    .findById(roomId)
    .removeUser(user)
    .getUserCount() === 0
  ) {
    this.removeRoom(roomId);
  }
  return this;
};
RoomList.prototype.roomExist = function (roomId) {
  return Boolean(this.findById(roomId));
};
RoomList.prototype.addUserToRoom = function (user, roomId) {
  const room = this.findById(roomId);
  if (room.getUserCount() === 1) {
    room.addUser(user);
    return true;
  }
  return false;
};
RoomList.prototype.findById = function (roomId) {
  return this.rooms.find(room => room.getId() === roomId);
};
RoomList.prototype.toString = function () {
  return this.rooms.join(', ');
};
const roomList = new RoomList();

// app.use(express.static(`${__dirname}/../client`));

io.on('connection', socket => {
  let roomId = socket.handshake.query.roomId;
  console.log(`User Connected, roomId: ${roomId}`);

  if (roomList.roomExist(roomId)) {
    const added = roomList.addUserToRoom(socket.id, roomId);
    if (added) {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit('join');
      console.log(`User enter the room. ${roomList}`);
      return;
    }
    socket.emit('full');
  } else {
    roomId = roomList.addRoom(socket.id);
    socket.join(roomId);
    console.log(`New room added, user joined, roomList: ${roomList}`);
    socket.emit('room', roomId);
  }
  socket.on('message', msg => socket.broadcast.to(roomId).emit('message', msg));
  socket.on('disconnect', () => {
    roomList.removeUserFromRoom(socket.id, roomId);
    socket.broadcast.to(roomId).emit('leave');
    console.log(`User Disconnected, roomList: ${roomList}`);
  });
});

server.listen(port, () => {
  console.log(`[INFO] Listening on port: ${port}`);
});
