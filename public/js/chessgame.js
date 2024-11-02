const socket=io();
const chess=new Chess();
const boardElement=document.querySelector(".chessboard");
let draggedPiece=null;
let sourcesquare=null;
let playerRole=null;

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
                pieceElement.innerHTML = square.type; // Assuming `square.type` holds the piece character
                pieceElement.draggable = playerRole === square.color;

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

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourcesquare, targetSource);
                }
            });

            boardElement.appendChild(squareElement); // This should be inside the row loop
        });
    });
}

renderBoard();

const handleMove=()=>{

}

const getPieceUnicode=()=>{

}