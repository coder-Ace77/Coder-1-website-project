let socket;

exports.makeConnection = (server) => {
    const io = require('socket.io')(server);
    io.on('connection', Socket => {
        console.log("connected via socket");
        socket = Socket;
    });
}

exports.getSocket = () => {
    return socket;
}