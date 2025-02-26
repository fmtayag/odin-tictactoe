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
        AIR,
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
                return currentMarker;
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
                return currentMarker;
            }
        }

        // Diagonal check
        // -- Topleft to Bottomright
        let pointer = 0;
        let matches = 0;
        while (pointer < Gameboard.SIZE) {
            if (board[pointer][pointer] === currentMarker)
                matches++;
            else
                break;

            pointer++;
        }

        if (matches === MUST_MATCH) {
            console.log("Winner at diagonal topleft to bottomright");  
            return currentMarker;
        }

        // -- Topright to bottomleft
        pointer = 0;
        matches = 0;
        while (pointer < Gameboard.SIZE) {
            const col = (Gameboard.SIZE - 1) - pointer;

            if (board[pointer][col] === currentMarker)
                matches++;
            else
                break;

            pointer++;
        }

        console.log(matches);

        if (matches === MUST_MATCH) {
            console.log("Winner at diagonal topright to bottomleft");
            console.log(currentMarker);
            return currentMarker;
        }

        return null;
    }

    const switchMarker = () => {
        currentMarker = currentMarker === Gameboard.MARKER_P1 
            ? Gameboard.MARKER_P2
            : Gameboard.MARKER_P1;
    }

    const placeMarker = (row, col) => {
        if(Gameboard.getBoard()[row][col] === Gameboard.AIR) {
            Gameboard.updateBoard(currentMarker, row, col);
            console.log("\n");
            Gameboard.printBoard();
            switchMarker();
        }
        else {
            console.log("Can't place there!");
        }
    };

    const play = (row, col) => {
        placeMarker(row, col);
        let winner = checkWinner(Gameboard.getBoard(), currentMarker);
        if(winner !== null) {
            currentMarker === Gameboard.MARKER_P1 
                ? console.log("Winner is Player 1")
                : console.log("Winner is Player 2");
        }
    }

    const runGame = () => {
        Gameboard.printBoard();
        play(2, 0);
        play(0, 1);
        play(1, 1);
        play(0, 0);
        play(0, 2);
        
    };

    return {
        runGame,
        play,
    }
})();

const DOMHandler = (function () {
    const P1_TEXT_REPR = "X";
    const P2_TEXT_REPR = "O";
    const container = document.querySelector("#board");

    const createGrid = () => {

        for(let r=0; r < Gameboard.ROWS; r++) {
            for(let c=0; c< Gameboard.COLUMNS; c++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = `${r}`;
                cell.dataset.col = `${c}`;

                container.append(cell);
            }
        }

        container.addEventListener("click", (e) => {
            const target = e.target;
            const row = target.dataset.row;
            const col = target.dataset.col;

            GameController.play(row, col);
            reflectGrid();
        });
    }

    const reflectGrid = () => {
        for(const cell of container.children    ) {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            
            if(Gameboard.getBoard()[row][col] === Gameboard.MARKER_P1) {
                cell.textContent = P1_TEXT_REPR;
            }
            else if(Gameboard.getBoard()[row][col] === Gameboard.MARKER_P2) {
                cell.textContent = P2_TEXT_REPR;
            }
        }
    }

    return {
        createGrid,
    }
})();

// GameController.runGame();
DOMHandler.createGrid();
