const Gameboard = (function() {
    const AIR = 0;
    const MARKER_P1 = 1;
    const MARKER_P2 = 2;
    const COLUMNS = 3;
    const ROWS = 3;

    const board = [];
    for(let r=0; r < ROWS; r++) {
        board[r] = new Array(COLUMNS).fill(0);
    }

    const getBoard = () => board;
    const updateBoard = (marker, row, col) => {
        if (row >= ROWS || col >= COLUMNS) 
            return;

        board[row][col] = marker;
    }
    const printBoard = () => {
        for(row of board) {
            console.log(row);
        }
    }

    return {
        getBoard,
        updateBoard,
        printBoard,
        MARKER_P1,
        MARKER_P2
    }
})();

Gameboard.printBoard();
Gameboard.updateBoard(Gameboard.MARKER_P1, 0, 1);
Gameboard.updateBoard(Gameboard.MARKER_P1, 1, 1);
Gameboard.updateBoard(Gameboard.MARKER_P1, 2, 1);
console.log("\n");
Gameboard.printBoard();