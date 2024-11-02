const socket = io(); // Ensure Socket.IO is loaded before this
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

if (!boardElement) {
    console.error("Chessboard element not found!"); // Check if the board element exists
}

// Initialize global variables
let draggedPiece = null;
let sourcesquare = null;
let playerRole = null; // You'll need to set this based on your game's logic


const renderBoard = () => {
    console.log("Rendering board..."); // Debug log
    const board = chess.board();
    console.log(board); // Log the board state

    boardElement.innerHTML = ""; // Clear existing board content

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add("square", (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark");
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === 'w' ? "white" : "black");
                pieceElement.innerText = getPieceUnicode(square); // Get piece Unicode
                pieceElement.draggable = playerRole === square.color; // Allow dragging for current player's pieces

                // Drag events
                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourcesquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourcesquare = null;
                });

                squareElement.appendChild(pieceElement); // Add piece to the square
            }

            // Event listeners for drag-and-drop
            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourcesquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement); // Append the square to the board
        });
    });
    
    if(playerRole==='b'){
        boardElement.classList.add("flipped");
    }
    else{
        boardElement.classList.remove("flipped");
    }

};

// Call renderBoard initially to display the board // Ensure this is called to display the chessboard

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        r: "♜", // Black Rook
        n: "♞", // Black Knight
        b: "♝", // Black Bishop
        q: "♛", // Black Queen
        k: "♚", // Black King
        p: "♟", // Black Pawn
        P: "♙", // White Pawn
        R: "♖", // White Rook
        N: "♘", // White Knight
        B: "♗", // White Bishop
        Q: "♕", // White Queen
        K: "♔"  // White King
    };
    return unicodePieces[piece.type] || ""; // Return Unicode character
}


socket.on("playerRole", function(role) {
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole", function() {
    playerRole = null;
    renderBoard();
});

// Assuming `fen` is defined somewhere globally or passed correctly
socket.on("boardState", function(fen) { // Ensure `fen` is passed here
    chess.load(fen);
    renderBoard();
});

// This function listens for moves and updates the board
socket.on("move", function(move) {
    chess.move(move);
    renderBoard();
});

const handleMove = (source, target) => {
    // Implement move logic here

    const move={
        from:`${String.fromCharCode(97+source.col)}${8-source.row}`,
        to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
        promotion:'q'
    };

    socket.emit("move",move);
}

renderBoard();