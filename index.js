const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");
const modeRadios = document.querySelectorAll('input[name="mode"]');

let currentPlayer;
let gameGrid;
let gameMode = "PvP"; // Default mode

const winningPositions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize the game
function initGame() {
  currentPlayer = "X";
  gameGrid = ["", "", "", "", "", "", "", "", ""];

  boxes.forEach((box, index) => {
    box.innerText = "";
    box.style.pointerEvents = "all";
    box.className = `box box${index + 1}`;
  });

  newGameBtn.classList.remove("active");
  gameInfo.innerText = `Current Player: ${currentPlayer}`;
}

// Handle mode selection
modeRadios.forEach(radio => {
  radio.addEventListener("change", (e) => {
    gameMode = e.target.value;
    initGame();
  });
});

// Handle box clicks
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    handleClick(index);
  });
});

function handleClick(index) {
  if (gameGrid[index] === "") {
    boxes[index].innerText = currentPlayer;
    gameGrid[index] = currentPlayer;
    boxes[index].style.pointerEvents = "none";
    checkGameOver();

    if (!isGameOver()) {
      if (gameMode === "PvP") {
        swapTurn();
      } else if (gameMode === "PvC" && currentPlayer === "X") {
        swapTurn();
        setTimeout(() => {
          const bestMove = getBestMove();
          if (bestMove !== -1) {
            boxes[bestMove].innerText = currentPlayer;
            gameGrid[bestMove] = currentPlayer;
            boxes[bestMove].style.pointerEvents = "none";
            checkGameOver();
            if (!isGameOver()) {
              swapTurn();
            }
          }
        }, 500);
      }
    }
  }
}

// Swap turns between players
function swapTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameInfo.innerText = `Current Player: ${currentPlayer}`;
}

// Check if the game is over
function checkGameOver() {
  let winner = null;
  winningPositions.forEach((position) => {
    if (
      gameGrid[position[0]] !== "" &&
      gameGrid[position[0]] === gameGrid[position[1]] &&
      gameGrid[position[1]] === gameGrid[position[2]]
    ) {
      winner = gameGrid[position[0]];
      boxes[position[0]].classList.add("win");
      boxes[position[1]].classList.add("win");
      boxes[position[2]].classList.add("win");
    }
  });

  if (winner) {
    gameInfo.innerText = `Winner: ${winner}`;
    boxes.forEach((box) => box.style.pointerEvents = "none");
    newGameBtn.classList.add("active");
  } else if (!gameGrid.includes("")) {
    gameInfo.innerText = "Game Tied!";
    newGameBtn.classList.add("active");
  }
}

// Check if the game has ended
function isGameOver() {
  return gameInfo.innerText.includes("Winner") || gameInfo.innerText.includes("Tied");
}

// Get the best move for AI using Minimax
function getBestMove() {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < gameGrid.length; i++) {
    if (gameGrid[i] === "") {
      gameGrid[i] = "O";
      let score = minimax(gameGrid, 0, false);
      gameGrid[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
  let result = evaluate(board);
  if (result !== null) {
    return result;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Evaluate the board state
function evaluate(board) {
  for (let position of winningPositions) {
    const [a, b, c] = position;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === "O" ? 10 : -10;
    }
  }
  if (!board.includes("")) {
    return 0;
  }
  return null;
}

// Reset the game when the new game button is clicked
newGameBtn.addEventListener("click", initGame);

// Initialize the game on page load
initGame();
