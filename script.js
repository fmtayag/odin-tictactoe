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

    let scores = {
        "p1": 0,
        "p2": 0,
        "ties": 0,
    }

    const play = (row, col) => {
        if(status === ST_PLAY) {
            const isValidMove = placeMarker(row, col);

            if(isValidMove) {
                winner = checkWinner(Gameboard.getBoard(), currentMarker);
                if(winner !== null) {
                    status = ST_HASWINNER;
                    winner = currentMarker;
                    addScore();
                    
                }
                else {
                    hasFreeSpace()
                    ? null
                    : (() => {
                        status = ST_HASTIE;
                        addScore();
                    }) ();

                    switchMarker();
                }
            }
        }
    }

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


        if (matches === MUST_MATCH) {
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
            // Gameboard.printBoard();

            return true;
        }
        else {
            return false;
        }
    };

    const addScore = () => {
        switch(status) {
            case ST_HASWINNER:
                winner === Gameboard.MARKER_P1 ? scores["p1"]++ : scores["p2"]++;
                break;
            case ST_HASTIE:
                scores["ties"]++;
                break;
        }
    }

    const reset = () => {
        winner = null;
        status = ST_PLAY;
        currentMarker = Gameboard.MARKER_P1;
        Gameboard.resetBoard();
    }

    const getScore = (query) => {
        return scores[query];
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
        getScore,
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
        const pWinner = document.querySelector("p#winner");

        switch(gcStatus) {
            case GameController.ST_PLAY:
                break; 
            case GameController.ST_HASTIE:
                showResetButton(true);
                pWinner.textContent = "Tie!";
                updateScores();
                break;
            case GameController.ST_HASWINNER:
                showResetButton(true);
                const theWinner = GameController.getWinner() === Gameboard.MARKER_P1 ? 'X' : 'O';
                pWinner.textContent = `Winner is ${theWinner}`;
                updateScores();
                break;
        }

    }

    const updateScores = () => {
        const pScoreP1 = document.querySelector("p#scoreP1");
        const pScoreP2 = document.querySelector("p#scoreP2");
        const pTies = document.querySelector("p#ties");

        pScoreP1.textContent = GameController.getScore("p1");
        pScoreP2.textContent = GameController.getScore("p2");
        ties.textContent = GameController.getScore("ties");
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

    const createButton = () => {
        const resetButton = document.querySelector("#reset");
        showResetButton(false);

        resetButton.addEventListener("click", (e) => {
            GameController.reset();
            reflectGrid();
            showResetButton(false);

            const pWinner = document.querySelector("p#winner");
            pWinner.textContent = "";
        });
    }

    const showResetButton = (doShow) => {
        const resetButton = document.querySelector("#reset");
        doShow ? resetButton.classList.remove("hidden") : resetButton.classList.add("hidden");
    }

    return {
        createGrid,
        createGUI: createButton,
    }
})();

DOMHandler.createGrid();
DOMHandler.createButton();
