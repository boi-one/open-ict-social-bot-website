const cells = document.querySelectorAll('.cell');
const score = document.getElementById('score');
const socket = io();
const turnDisplay = document.getElementById('turn');
const restartBtn = document.getElementById('restart');

let myPlayer;  // Wie ben IK
let currentPlayer = "X";  // Wie is er aan de beurt

let gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let scoreX = 0;
let scoreO = 0;
let gameActive = true;

// Ontvang welke speler je bent
socket.on('assignPlayer', (player) => {
    console.log('Ontvangen speler:', player);
    myPlayer = player;
    currentPlayer = 'X';  // Spel begint altijd met X
    updateTurnDisplay();
    console.log(`Je bent speler ${player}`);
});

// Volledige game restart (na best-of-3)
socket.on('restartGame', () => {
    scoreX = 0;
    scoreO = 0;
    score.textContent = `Score - X: ${scoreX}, O: ${scoreO}`;
    resetGame();
    gameActive = true;
    restartBtn.style.display = 'none';
});

// Reset alleen deze ronde
socket.on('resetRound', () => {
    resetGame();
    gameActive = true;
});

// Ontvang updates van het bord
socket.on('updateBoard', (data) => {
    gameBoard[data.row][data.col] = data.player;
    const cell = document.querySelector(`[data-row="${data.row}"][data-col="${data.col}"]`);
    cell.textContent = data.player;

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Wissel beurt
    updateTurnDisplay();
    
    let winner = checkWinner();
    
    // Check voor winnaar OF gelijkspel
    if (winner === "X" || winner === "O" || winner === "L") {
        gameActive = false;
        
        if (winner === "X") {
            scoreX++;
        } else if (winner === "O") {
            scoreO++;
        }
        
        score.textContent = `Score - X: ${scoreX}, O: ${scoreO}`;
        
        if (winner !== "L") {
            console.log(`${winner} heeft gewonnen!`);
        } else {
            console.log('Gelijkspel!');
        }
        
        // Check best-of-3
        if (scoreX === 2) {
            console.log(`X heeft de best of 3 gewonnen!`);
            restartBtn.style.display = 'block';
            return;
        }
        if (scoreO === 2) {
            console.log(`O heeft de best of 3 gewonnen!`);
            restartBtn.style.display = 'block';
            return;
        }

        // Vertel de server dat de ronde afgelopen is
        socket.emit('roundEnded');
    }
});

socket.on('waitingPlayer', () => {
    const popup = document.getElementById('popup-overlay');
    popup.classList.remove('hidden');  // Laat pop-up zien
});

socket.on('gameReady', () => {
    const popup = document.getElementById('popup-overlay');
    popup.classList.add('hidden');  // Verberg pop-up
});

function checkWinner() {
    // Check rijen
    if (gameBoard[0][0] === gameBoard[0][1] && gameBoard[0][1] === gameBoard[0][2] && gameBoard[0][0] !== "") {
        return gameBoard[0][0];
    }
    if (gameBoard[1][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[1][2] && gameBoard[1][0] !== "") {
        return gameBoard[1][0];
    }
    if (gameBoard[2][0] === gameBoard[2][1] && gameBoard[2][1] === gameBoard[2][2] && gameBoard[2][0] !== "") {
        return gameBoard[2][0];
    }

    // Check kolommen
    if (gameBoard[0][0] === gameBoard[1][0] && gameBoard[1][0] === gameBoard[2][0] && gameBoard[0][0] !== "") {
        return gameBoard[0][0];
    }
    if (gameBoard[0][1] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][1] && gameBoard[0][1] !== "") {
        return gameBoard[0][1];
    }
    if (gameBoard[0][2] === gameBoard[1][2] && gameBoard[1][2] === gameBoard[2][2] && gameBoard[0][2] !== "") {
        return gameBoard[0][2];
    }
   
    // Check diagonalen
    if (gameBoard[0][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][2] && gameBoard[0][0] !== "") {
        return gameBoard[1][1];
    }
    if (gameBoard[0][2] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][0] && gameBoard[0][2] !== "") {
        return gameBoard[1][1];
    }
    
    // Check gelijkspel
    if (gameBoard[0][0] !== '' && gameBoard[1][0] !== "" && gameBoard[2][0] !== '' && 
        gameBoard[0][1] !== '' && gameBoard[1][1] !== "" && gameBoard[2][1] !== '' && 
        gameBoard[0][2] !== '' && gameBoard[1][2] !== "" && gameBoard[2][2] !== '') {
        console.log(`geen winnaar dit potje!!`);
        return "L";
    }
    return null;
}

function resetGame() {
    gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    cells.forEach(cell => {
        cell.textContent = "";
    });

    currentPlayer = 'X';
    updateTurnDisplay();
}

function updateTurnDisplay() {
    console.log('currentPlayer:', currentPlayer, 'myPlayer:', myPlayer);
    if (currentPlayer === myPlayer) {
        turnDisplay.textContent = "Jouw beurt!";
    } else {
        turnDisplay.textContent = `Wacht op ${currentPlayer}...`;
    }
}

restartBtn.addEventListener('click', () => {
    socket.emit('requestRestart');
});

cells.forEach(cell => {
    cell.addEventListener('click', function() {
        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');
        
        if (gameBoard[row][col] === "") {
            if (!gameActive) return;
            if (currentPlayer !== myPlayer) {
                console.log('Het is niet jouw beurt!');
                return;
            }
            socket.emit('makeMove', { row: row, col: col, player: currentPlayer });
        } else {
            console.log('Dit vakje is al bezet');
        }
    });
});

score.textContent = `Score - X: ${scoreX}, O: ${scoreO}`;