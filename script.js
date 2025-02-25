const Gameboard = (function () {
    const AIR = 0;
    const MARKER_P1 = 1;
    const MARKER_P2 = 2;
    const SIZE = 3;
    const COLUMNS = SIZE;
    const ROWS = SIZE;

    const board = [];
    for (let r = 0; r < ROWS; r++) {
        board[r] = new Array(COLUMNS).fill(0);
    }

    const getBoard = () => board;
    const updateBoard = (marker, row, col) => {
        if (row >= ROWS || col >= COLUMNS)
            return;

        board[row][col] = marker;
    }
    const printBoard = () => {
        for (row of board) {
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
        SIZE,
    }
})();

const GameController = (function () {
    const MUST_MATCH = 3;
    let currentMarker = Gameboard.MARKER_P1;
    let winner = null;

    const checkWinner = (board, currentMarker) => {
        // Vertical check
        for (let c = 0; c < Gameboard.COLUMNS; c++) {
            let matches = 0;
            for (let r = 0; r < Gameboard.ROWS; r++) {
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
        for (let r = 0; r < Gameboard.ROWS; r++) {
            let matches = 0;
            for (let c = 0; c < Gameboard.COLUMNS; c++) {
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

        // Diagonal check
        // -- Topleft to Bottomright
        (
            () => {
                let pointer = 0;
                let matches = 0;
                while (pointer < Gameboard.SIZE) {
                    if (board[pointer][pointer] === currentMarker)
                        matches++;
                    else
                        break;

                    pointer++;
                }

                if (matches === MUST_MATCH)
                    console.log("Winner at diagonal topleft to bottomright");
            }
        )();

        // -- Topright to bottomleft
        (
            () => {
                let pointer = 0;
                let matches = 0;
                while (pointer < Gameboard.SIZE) {
                    const col = (Gameboard.SIZE - 1) - pointer;

                    if (board[pointer][col] === currentMarker)
                        matches++;
                    else
                        break;

                    pointer++;
                }

                console.log(matches);

                if (matches === MUST_MATCH)
                    console.log("Winner at diagonal topright to bottomleft");
            }
        )();
    }
    const runGame = () => {
        Gameboard.printBoard();
        Gameboard.updateBoard(Gameboard.MARKER_P1, 2, 0);
        // Gameboard.updateBoard(Gameboard.MARKER_P2, 0, 2);
        Gameboard.updateBoard(Gameboard.MARKER_P1, 1, 1);
        // Gameboard.updateBoard(Gameboard.MARKER_P2, 0, 0);
        Gameboard.updateBoard(Gameboard.MARKER_P1, 0, 2);
        console.log("\n");
        Gameboard.printBoard();
        checkWinner(Gameboard.getBoard(), currentMarker);
    };

    return {
        runGame,
    }
})();

GameController.runGame();