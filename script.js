const Gameboard = (function() {
    const AIR = 0;
    const MARKER_P1 = 1;
    const MARKER_P2 = 2;
    const COLUMNS = 3;
    const ROWS = 3;

    const board = Array(ROWS).fill( Array(COLUMNS).fill(AIR) );

    const getBoard = () => board;

    return {
        getBoard,
        MARKER_P1,
        MARKER_P2
    }
})();

console.log(Gameboard.getBoard());