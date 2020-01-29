let io;

module.exports = {
    init: function (httpServer) {
        io = require('socket.io')(httpServer);
        return io;
    },
    getIO: function () {
        if (!io) {
            throw Error('Socket is not working')
        }
        return io;
    }
};

