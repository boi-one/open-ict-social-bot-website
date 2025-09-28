module.exports = function initBKE(io, app) {
    let players = [];

    io.on('connection', (socket) => {
        console.log('Een speler is verbonden');

        // Bepaal speler rol
        if (players.length === 0) {
            socket.player = 'X';
            players.push(socket.id);
        } else if (players.length === 1) {
            socket.player = 'O';
            players.push(socket.id);
        }

        socket.emit('assignPlayer', socket.player);

        if (players.length < 2) {
            io.emit('waitingPlayer');
        } else if (players.length === 2) {
            io.emit('gameReady');
        }

        socket.on('requestRestart', () => {
            io.emit('restartGame');
        });

        socket.on('makeMove', (data) => {
            io.emit('updateBoard', data);
        });

        socket.on('roundEnded', () => {
            setTimeout(() => {
                io.emit('resetRound');
            }, 2000);
        });

        socket.on('disconnect', () => {
            console.log('Een speler is losgekoppeld');
            players = players.filter(id => id !== socket.id);
        });
    });
}