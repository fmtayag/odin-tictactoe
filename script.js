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
        MARKER_P2,
        COLUMNS,
        ROWS,
    }
})();

const GameController = (function() {
    const MUST_MATCH = 3;
    let currentMarker = Gameboard.MARKER_P1;
    let winner = null;

    const checkWinner = (board, currentMarker) => {
        // Vertical check
        for(let c=0; c < Gameboard.COLUMNS; c++) {
            let matches = 0;
            for(let r=0; r < Gameboard.ROWS; r++) {
                if (board[r][c] === currentMarker) {
                    matches++;
                }
                else {
                    break;
                }
            }

            if (matches === MUST_MATCH) {
                console.log(`Found a winner at column ${c + 1}`);
            }
        }

        // Horizontal check
        for(let r=0; r < Gameboard.ROWS; r++) {
            let matches = 0;
            for(let c=0; c < Gameboard.COLUMNS; c++) {
                if (board[r][c] === currentMarker) {
                    matches++;
                }
                else {
                    break;
                }
            }

            if (matches === MUST_MATCH) {
                console.log(`Found a winner at row ${r + 1}`);
            }
        }
    }
    const runGame = () => {
        Gameboard.printBoard();
        Gameboard.updateBoard(Gameboard.MARKER_P1, 2, 0);
        // Gameboard.updateBoard(Gameboard.MARKER_P2, 0, 2);
        Gameboard.updateBoard(Gameboard.MARKER_P1, 2, 1);
        // Gameboard.updateBoard(Gameboard.MARKER_P2, 0, 0);
        Gameboard.updateBoard(Gameboard.MARKER_P1, 2, 2);
        console.log("\n");
        Gameboard.printBoard();
        checkWinner(Gameboard.getBoard(), currentMarker);
    };
    
    return {
        runGame,
    }
})();

GameController.runGame();