const { Server } = require("socket.io");
let io;

let users = [];

const addNewUser = (userEmail, socketId) => {
  !users.some((user) => user.userEmail === userEmail) &&
  users.push({ userEmail, socketId });
  console.log(users);
};


const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

exports.socketConnection = (server) => {
    io = new Server(server, {
        cors: {
            origin: "localhost:19002"
        },
        });
    
  io.on('connection', (socket) => {
    socket.on('newUser', (data) => {
      console.info("user email is: " + data.userEmail);
      addNewUser(data.userEmail, socket.id);
    })

    console.info(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);

    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
      removeUser(socket.id);
    });
  });
};

exports.sendMessage = (id, key, message) => io.to(id).emit(key, message);
exports.getAllusers = () => {return users};
exports.getUser = (userEmail, users) => {
  return users.find((user) => user.userEmail === userEmail);
};