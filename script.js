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
    const resetBoard = () => {
        for(let r=0; r < ROWS; r++) {
            for(let c=0; c < COLUMNS; c++) {
                updateBoard(AIR, r, c);
            }
        }
    }

    return {
        getBoard,
        updateBoard,
        printBoard,
        resetBoard,
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
    const ST_PLAY = "play";
    const ST_HASTIE = "has tie";
    const ST_HASWINNER = "has winner";
    let status = ST_PLAY;
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

    const hasFreeSpace = () => {
        for(const col of Gameboard.getBoard()) {
            if(col.includes(Gameboard.AIR)) 
                return true;
            else
                continue;
        }

        return false;
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

            return true;
        }
        else {
            console.log("Can't place there!");
            return false;
        }
    };

    const play = (row, col) => {
        if(status === ST_PLAY) {
            const isValidMove = placeMarker(row, col);

            if(isValidMove) {
                let winner = checkWinner(Gameboard.getBoard(), currentMarker);
                if(winner !== null) {
                    currentMarker === Gameboard.MARKER_P1 
                        ? console.log("Winner is Player 1")
                        : console.log("Winner is Player 2");

                    status = ST_HASWINNER;
                    winner = currentMarker;
                }
                
                hasFreeSpace()
                    ? console.log("Has free space")
                    : status = ST_HASTIE;

                switchMarker();
            }
        }
    }

    const reset = () => {
        winner = null;
        status = ST_PLAY;
        currentMarker = Gameboard.MARKER_P1;
        Gameboard.resetBoard();
    }

    const getStatus = () => {
        return status;
    }

    const getWinner = () => {
        return winner;
    }

    return {
        play,
        getStatus,
        getWinner,
        reset,
        ST_PLAY,
        ST_HASTIE,
        ST_HASWINNER,
    }
})();

const DOMHandler = (function () {
    const P1_TEXT_REPR = "close"; // Based on Google Material Icons
    const P2_TEXT_REPR = "circle";
    const container = document.querySelector("#board");

    const listenToGameController = () => {
        let gcStatus = GameController.getStatus();
        console.log("Listening");

        switch(gcStatus) {
            case GameController.ST_PLAY:
                break; 
            case GameController.ST_HASTIE:
                // TODO: Show the button for reset
                GameController.reset();
                reflectGrid();
                break;
            case GameController.ST_HASWINNER:
                // TODO: Show the button for reset
                // TODO: Display the game winner
                GameController.reset();
                reflectGrid();
                break;
        }
    }

    const createGrid = () => {

        for(let r=0; r < Gameboard.ROWS; r++) {
            for(let c=0; c< Gameboard.COLUMNS; c++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = `${r}`;
                cell.dataset.col = `${c}`;

                const para = document.createElement("p");
                para.classList.add("material-symbols-outlined");
                cell.append(para);

                container.append(cell);
            }
        }

        container.addEventListener("click", (e) => {
            const target = e.target;
            const isACell = target.classList.contains("cell");

            if(isACell) {
                console.log(e.target);
                const row = target.dataset.row;
                const col = target.dataset.col;

                GameController.play(row, col);
                reflectGrid();
                listenToGameController();
            }
            
        });
    }

    const reflectGrid = () => {
        for(const cell of container.children    ) {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            const para = cell.querySelector("p");
            
            if(Gameboard.getBoard()[row][col] === Gameboard.MARKER_P1) {
                para.textContent = P1_TEXT_REPR;
            }
            else if(Gameboard.getBoard()[row][col] === Gameboard.MARKER_P2) {
                para.textContent = P2_TEXT_REPR;
            }
            else {
                para.textContent = "";
            }
        }
    }

    return {
        createGrid,
    }
})();

// GameController.runGame();
DOMHandler.createGrid();
