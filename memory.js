module.exports = function initMemory(io, app) {

    let players = [];
    let gameState = {
        cards: [], // shuffled emojis
        matched: [], // indices of matched cards
        open: [], // indices of currently open cards
        turn: 0, // 0 or 1
        scores: [0, 0]
    };

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {
        const emojis = ["🤢", "🤢", "😜", "😜", "👍", "👍", "🐱", "🐱", "👀", "👀", "🤑", "🤑", "🎈", "🎈", "🍕", "🍕"];
        gameState.cards = shuffle([...emojis]);
        gameState.matched = [];
        gameState.open = [];
        gameState.turn = 0;
        gameState.scores = [0, 0];
    }

    io.on('connection', (socket) => {
        if (players.length < 2) {
            players.push(socket.id);
            socket.playerIndex = players.length - 1;
            socket.emit('assignPlayer', socket.playerIndex);
        }

        if (players.length === 2) {
            startGame();
            io.emit('gameReady', gameState);
        } else {
            socket.emit('waitingPlayer');
        }

        socket.on('flipCard', (index) => {
            // Only allow current player to flip
            if (players[gameState.turn] !== socket.id) return;

            // Ignore if already matched or open
            if (gameState.matched.includes(index) || gameState.open.includes(index)) return;

            gameState.open.push(index);

            // If two cards are open, check for match
            if (gameState.open.length === 2) {
                const [i1, i2] = gameState.open;
                if (gameState.cards[i1] === gameState.cards[i2]) {
                    // Match found
                    gameState.matched.push(i1, i2);
                    gameState.scores[gameState.turn]++;
                    gameState.open = []; // Clear immediately for matches
                    io.emit('updateGame', { ...gameState, lastMove: { index, match: true } });
                    // Current player gets another turn (don't change gameState.turn)
                } else {
                    // No match - show both cards briefly then flip back
                    io.emit('updateGame', { ...gameState, lastMove: { index, match: false } });
                    setTimeout(() => {
                        gameState.open = [];
                        gameState.turn = gameState.turn === 0 ? 1 : 0;
                        io.emit('updateGame', { ...gameState });
                    }, 1200);
                }
            } else {
                // First card flipped
                io.emit('updateGame', { ...gameState, lastMove: { index } });
            }
        });

        socket.on('requestRestart', () => {
            startGame();
            io.emit('gameReady', gameState);
        });

        socket.on('disconnect', () => {
            players = players.filter(id => id !== socket.id);
            io.emit('waitingPlayer');
        });
    });
}