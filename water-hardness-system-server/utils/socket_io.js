const { Server } = require("socket.io");
let io;
exports.socketConnection = (server) => {
    io = new Server(server, {
        cors: {
            origin: "localhost:19002"
        },
        });
    
  io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);
    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

exports.sendMessage = (key, message) => io.sockets.emit(key, message);