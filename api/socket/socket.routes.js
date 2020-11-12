module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', (socket) => {
        const address = socket.handshake.address;
        const userAgent = socket.handshake.headers['user-agent'];

        socket.on('logout', () => {
            socket.leave('room');
            socket.disconnect(0);
            io.to('room').emit('update', { userAgent, address })

        })
        socket.on('renderDashboard', () => {
            socket.join('room');
            io.to('room').emit('update', { userAgent, address })
        })

    });
}

