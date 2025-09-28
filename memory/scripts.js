const socket = io();
let myPlayerIndex;
let gameState = {};
const scoreDiv = document.querySelector('.score');
const gameDiv = document.querySelector('.game');
const turnDiv = document.getElementById('turn-indicator');
const waitingOverlay = document.getElementById('waiting-overlay');
const winnerOverlay = document.getElementById('winner-overlay');

socket.on('assignPlayer', (playerIndex) => {
    myPlayerIndex = playerIndex;
    console.log('You are player', playerIndex);
});

socket.on('waitingPlayer', () => {
    waitingOverlay.classList.remove('hidden');
});

socket.on('gameReady', (state) => {
    waitingOverlay.classList.add('hidden');
    gameState = state;
    renderBoard();
    updateScore();
    updateTurn();
});

socket.on('updateGame', (state) => {
    gameState = state;
    renderBoard();
    updateScore();
    updateTurn();
    
    // Check if game is over
    if (gameState.matched.length === gameState.cards.length) {
        setTimeout(() => {
            showWinnerPopup();
        }, 500);
    }
});

function renderBoard() {
    gameDiv.innerHTML = '';
    gameState.cards.forEach((emoji, i) => {
        const box = document.createElement('div');
        box.className = 'item';
        
        if (gameState.matched.includes(i)) {
            box.classList.add('boxMatch');
            box.textContent = emoji;
        } else if (gameState.open.includes(i)) {
            box.classList.add('boxOpen');
            box.textContent = emoji;
        } else {
            box.textContent = '?';
        }
        
        box.onclick = () => {
            if (myPlayerIndex === gameState.turn && 
                !gameState.matched.includes(i) && 
                !gameState.open.includes(i) &&
                gameState.open.length < 2) {
                socket.emit('flipCard', i);
            }
        };
        
        gameDiv.appendChild(box);
    });
}

function updateScore() {
    if (gameState.scores) {
        scoreDiv.textContent = `Score: ${gameState.scores[0]} - ${gameState.scores[1]}`;
    }
}

function updateTurn() {
    if (typeof gameState.turn === 'undefined') {
        turnDiv.textContent = "Waiting for players...";
        document.body.classList.remove('your-turn');
        return;
    }
    
    if (myPlayerIndex === gameState.turn) {
        turnDiv.textContent = "Your turn!";
        document.body.classList.add('your-turn');
    } else {
        turnDiv.textContent = `Player ${gameState.turn + 1}'s turn`;
        document.body.classList.remove('your-turn');
    }
}

function restartGame() {
    socket.emit('requestRestart');
}

function showWinnerPopup() {
    const winnerTitle = document.getElementById('winner-title');
    const winnerText = document.getElementById('winner-text');
    const finalScore = document.getElementById('final-score');
    
    let winner;
    if (gameState.scores[0] > gameState.scores[1]) {
        winner = 'Player 1';
    } else if (gameState.scores[1] > gameState.scores[0]) {
        winner = 'Player 2';
    } else {
        winner = 'It\'s a Tie';
    }
    
    winnerTitle.textContent = 'Game Over!';
    winnerText.textContent = `Winner: ${winner}`;
    finalScore.textContent = `Final Score: ${gameState.scores[0]} - ${gameState.scores[1]}`;
    
    winnerOverlay.classList.remove('hidden');
}

function closeWinnerPopup() {
    winnerOverlay.classList.add('hidden');
    socket.emit('requestRestart');
}