var gameLogic;
(function (gameLogic) {
    gameLogic.ROWS = 10;
    gameLogic.COLS = 10;
    /** Returns the initial TicTacToe board, which is a 3x3 matrix containing ''. */
    // export function getInitialBoard(): Board {
    //   return [['', '', ''],
    //           ['', '', ''],
    //           ['', '', '']];
    // Battleship returns 4 10X10 matrix, where 0 board is P1's move board,
    // 1 board is P2's move board, 2 board is P1's ship board, 3 board is P2's
    // ship board
    // }
    function getInitialBoard() {
        return { "gameBoard": [
                [['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '']],
                [['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '']],
                // [['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','','']],
                // [['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','',''],
                // ['','','','','','','','','','']]
                [['X', '', '', '', '', '', '', '', '', ''],
                    ['X', '', '', '', '', '', '', 'X', 'X', 'X'],
                    ['X', '', '', '', '', '', '', '', '', ''],
                    ['X', '', '', '', '', '', '', '', '', ''],
                    ['X', '', '', '', '', '', '', '', '', ''],
                    ['', '', 'X', 'X', 'X', '', '', '', '', ''],
                    ['', 'X', '', '', '', '', '', '', '', ''],
                    ['', 'X', '', '', '', '', '', '', '', ''],
                    ['', 'X', '', '', '', '', '', '', 'X', ''],
                    ['', 'X', '', '', '', '', '', '', 'X', '']],
                [['', '', '', '', '', 'X', '', '', '', ''],
                    ['X', '', '', '', '', 'X', '', '', '', ''],
                    ['X', '', '', '', '', 'X', '', '', '', ''],
                    ['X', '', '', '', '', '', '', '', '', ''],
                    ['X', '', '', '', '', '', '', '', '', ''],
                    ['X', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', 'X', 'X', 'X', '', ''],
                    ['', '', '', '', '', '', '', '', '', ''],
                    ['X', 'X', 'X', 'X', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', 'X', 'X']]
            ],
            "phase": 2 };
    }
    gameLogic.getInitialBoard = getInitialBoard;
    /**
     * Returns true if the game ended in a tie because there are no empty cells.
     * E.g., isTie returns true for the following board:
     *     [['X', 'O', 'X'],
     *      ['X', 'O', 'O'],
     *      ['O', 'X', 'X']]
     */
    // There is no such thing as a "tie" in Battleship!
    // function isTie(board: Board, turnIndexBeforeMove: number): boolean {
    //   for (var i = 0; i < 3; i++) {
    //     for (var j = 0; j < 3; j++) {
    //       if (board[i][j] === '') {
    //         // If there is an empty cell then we do not have a tie.
    //         return false;
    //       }
    //     }
    //   }
    //   // No empty cells, so we have a tie!
    //   return true;
    // }
    /**
     * Return the winner (either 'X' or 'O') or '' if there is no winner.
     * The board is a matrix of size 3x3 containing either 'X', 'O', or ''.
     * E.g., getWinner returns 'X' for the following board:
     *     [['X', 'O', ''],
     *      ['X', 'O', ''],
     *      ['X', '', '']]
     * Return the winner (either P1 or P2) or '' if there is no winner.
     * The board is composed of 4 10x10 matrices, 2 containing either 'X' or
     * "O", or ''. The other 2 contain locations of ships marked by 'X'.
     * Retruns the player for which there are 'X' on all spaces of the opposing
     * player's ships
     */
    function getWinner(board, turnIndexBeforeMove) {
        var P1 = true;
        var P2 = true;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var cell1 = board.gameBoard[3][i][j];
                var cell2 = board.gameBoard[0][i][j];
                if (cell1 == 'X' && cell2 != 'O') {
                    P1 = false;
                }
            }
        }
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var cell1 = board.gameBoard[2][i][j];
                var cell2 = board.gameBoard[1][i][j];
                if (cell1 == 'X' && cell2 != 'O') {
                    P2 = false;
                }
            }
        }
        if (P1) {
            return "P1";
        }
        else if (P2) {
            return "P2";
        }
        else {
            return "";
        }
    }
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(board, row, col, turnIndexBeforeMove) {
        if (!board) {
            // Initially (at the beginning of the match), the board in state is undefined.
            board = getInitialBoard();
        }
        if (board.phase === 1) {
            var boardAfterMove = angular.copy(board);
            boardAfterMove.gameBoard[3 - turnIndexBeforeMove][row][col] = 'X';
            var firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
            var delta = { row: row, col: col };
            return [firstOperation,
                { set: { key: 'board', value: boardAfterMove } },
                { set: { key: 'delta', value: delta } }];
        }
        else {
            if (board.gameBoard[turnIndexBeforeMove][row][col] !== '') {
                throw new Error("One can only make a move in an empty position!");
            }
            if (getWinner(board, turnIndexBeforeMove) !== '') {
                throw new Error("Can only make a move if the game is not over!");
            }
            var boardAfterMove = angular.copy(board);
            if (boardAfterMove.gameBoard[3 - turnIndexBeforeMove][row][col] === 'X') {
                boardAfterMove.gameBoard[turnIndexBeforeMove][row][col] = 'O';
            }
            else {
                boardAfterMove.gameBoard[turnIndexBeforeMove][row][col] = 'X';
            }
            var winner = getWinner(boardAfterMove, turnIndexBeforeMove);
            var firstOperation;
            if (winner !== '') {
                // Game over.
                firstOperation = { endMatch: { endMatchScores: winner === 'P1' ? [1, 0] : [0, 1] } };
            }
            else {
                // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
                firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
            }
            var delta = { row: row, col: col };
            return [firstOperation,
                { set: { key: 'board', value: boardAfterMove } },
                { set: { key: 'delta', value: delta } }];
        }
    }
    gameLogic.createMove = createMove;
    function isMoveOk(params) {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
        // The state and turn after move are not needed in Battleship since attacks
        // are all logged on the player's own hit board, so all non-empty spaces
        // are valid moves
        //var turnIndexAfterMove = params.turnIndexAfterMove;
        //var stateAfterMove = params.stateAfterMove;
        // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
        // to verify that move is legal.
        try {
            // Example move:
            // [{setTurn: {turnIndex : 1},
            //  {set: {key: 'board', value: [['X', '', ''], ['', '', ''], ['', '', '']]}},
            //  {set: {key: 'delta', value: {row: 0, col: 0}}}]
            var deltaValue = move[2].set.value;
            var row = deltaValue.row;
            var col = deltaValue.col;
            var board = stateBeforeMove.board;
            var expectedMove = createMove(board, row, col, turnIndexBeforeMove);
            if (!angular.equals(move, expectedMove)) {
                return false;
            }
        }
        catch (e) {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
})(gameLogic || (gameLogic = {}));
;var game;
(function (game) {
    var animationEnded = false;
    var canMakeMove = false;
    var isComputerTurn = false;
    var lastUpdateUI = null;
    var state = null;
    game.isHelpModalShown = false;
    var draggingPiece;
    var gameArea;
    var realGameArea;
    var draggingLines;
    var verticalDraggingLine;
    var horizontalDraggingLine;
    var draggingSquare;
    var rowsNum = 10;
    var colsNum = 20;
    var ship = 0;
    function init() {
        console.log("Translation of 'RULES_OF_BATTLESHIP' is " + translate('RULES_OF_BATTLESHIP'));
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        // See http://www.sitepoint.com/css3-animation-javascript-event-handlers/
        document.addEventListener("animationend", animationEndedCallback, false); // standard
        document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
        document.addEventListener("oanimationend", animationEndedCallback, false); // Opera
        dragAndDropService.addDragListener("boardArea", handleDragEvent);
    }
    game.init = init;
    function handleDragEvent(type, clientX, clientY) {
        gameArea = document.getElementById("boardArea");
        realGameArea = document.getElementById("gameArea");
        draggingLines = document.getElementById("draggingLines");
        verticalDraggingLine = document.getElementById("verticalDraggingLine");
        horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
        draggingSquare = null;
        // Center point in gameArea
        var x = clientX - realGameArea.offsetLeft;
        var y = clientY - Math.floor(gameArea.offsetTop + gameArea.offsetTop * 0.05);
        // Is outside gameArea?
        if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
            draggingLines.style.display = "none";
            return;
        }
        draggingLines.style.display = "inline";
        // Inside gameArea. Let's find the containing square's row and col
        var col = Math.floor(colsNum * x / gameArea.clientWidth);
        var row = Math.floor(rowsNum * y / gameArea.clientHeight);
        var centerXY = getSquareCenterXY(row, col);
        verticalDraggingLine.setAttribute("x1", String(centerXY.x));
        verticalDraggingLine.setAttribute("x2", String(centerXY.x));
        horizontalDraggingLine.setAttribute("y1", String(centerXY.y));
        horizontalDraggingLine.setAttribute("y2", String(centerXY.y));
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
            // drag ended
            draggingLines.style.display = "none";
            var board = 0;
            if (col > 9) {
                col = col - 10;
                board = 1;
            }
            log.info("Targeted row: " + row + " and column: " + col);
            cellClicked(row, col, board);
        }
    }
    game.handleDragEvent = handleDragEvent;
    function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
            x: col * size.width + size.width / 2,
            y: row * size.height + size.height / 2
        };
    }
    function getSquareWidthHeight() {
        return {
            width: gameArea.clientWidth / colsNum,
            height: gameArea.clientHeight / rowsNum
        };
    }
    function animationEndedCallback() {
        $rootScope.$apply(function () {
            log.info("Animation ended");
            animationEnded = true;
            if (isComputerTurn) {
                sendComputerMove();
            }
        });
    }
    function sendComputerMove() {
        gameService.makeMove(aiService.findComputerMove(lastUpdateUI));
    }
    function updateUI(params) {
        log.info("Game got updateUI:", params);
        animationEnded = false;
        lastUpdateUI = params;
        state = params.stateAfterMove;
        if (!state.board) {
            state.board = gameLogic.getInitialBoard();
        }
        canMakeMove = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        // Is it the computer's turn?
        isComputerTurn = canMakeMove &&
            params.playersInfo[params.yourPlayerIndex].playerId === '';
        if (isComputerTurn) {
            // To make sure the player won't click something and send a move instead of the computer sending a move.
            canMakeMove = false;
            // We calculate the AI move only after the animation finishes,
            // because if we call aiService now
            // then the animation will be paused until the javascript finishes.
            if (!state.delta) {
                // This is the first move in the match, so
                // there is not going to be an animation, so
                // call sendComputerMove() now (can happen in ?onlyAIs mode)
                sendComputerMove();
            }
        }
    }
    function cellClicked(row, col, board) {
        log.info("Clicked on board:", board, "Clicked on cell:", row, col);
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        if (!canMakeMove || lastUpdateUI.turnIndexAfterMove != 1 - board) {
            return;
        }
        try {
            var move = gameLogic.createMove(state.board, row, col, lastUpdateUI.turnIndexAfterMove);
            canMakeMove = false; // to prevent making another move
            gameService.makeMove(move);
        }
        catch (e) {
            log.info(["Cell is already full in position:", row, col]);
            return;
        }
    }
    game.cellClicked = cellClicked;
    function shouldShowImage(row, col, player) {
        var cell = state.board.gameBoard[1 - player][row][col];
        return cell !== "";
    }
    game.shouldShowImage = shouldShowImage;
    function isPieceX(row, col, player) {
        return state.board.gameBoard[1 - player][row][col] === 'X';
    }
    game.isPieceX = isPieceX;
    function isPieceO(row, col, player) {
        return state.board.gameBoard[1 - player][row][col] === 'O';
    }
    game.isPieceO = isPieceO;
    function shouldSlowlyAppear(row, col) {
        return !animationEnded &&
            state.delta &&
            state.delta.row === row && state.delta.col === col;
    }
    game.shouldSlowlyAppear = shouldSlowlyAppear;
    function isBattleship(row, col, player) {
        if (lastUpdateUI.turnIndexBeforeMove != 1 - player || isComputerTurn) {
            return false;
        }
        return state.board.gameBoard[2 + player][row][col] === 'X';
    }
    game.isBattleship = isBattleship;
})(game || (game = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    translate.setLanguage('en', {
        RULES_OF_BATTLESHIP: "Rules of Battleship",
        RULES_SLIDE1: "First, you and your opponent place your 5 battleships on your own board.",
        RULES_SLIDE2: "You and your opponent then take turns to fire upon the enemy board. If you hit an enemy battleship, you will score a X. If you miss, you will score a O.",
        RULES_SLIDE3: "The first player to eliminate all opposing battleships is declared the winner.",
        // RULES_SLIDE1: "You and your opponent take turns to mark the grid in an empty spot. The first mark is X, then O, then X, then O, etc.",
        // RULES_SLIDE2: "The first to mark a whole row, column or diagonal wins.",
        CLOSE: "Close"
    });
    game.init();
});
;var aiService;
(function (aiService) {
    /** Returns the move that the computer player should do for the given updateUI. */
    function findComputerMove(updateUI) {
        return createComputerMove(updateUI.stateAfterMove.board, updateUI.turnIndexAfterMove, 
        // at most 1 second for the AI to choose a move (but might be much quicker)
        { millisecondsLimit: 1000 });
    }
    aiService.findComputerMove = findComputerMove;
    /**
     * Returns all the possible moves for the given board and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function getPossibleMoves(board, turnIndexBeforeMove) {
        var possibleMoves = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                try {
                    possibleMoves.push(gameLogic.createMove(board, i, j, turnIndexBeforeMove));
                }
                catch (e) {
                }
            }
        }
        return possibleMoves;
    }
    aiService.getPossibleMoves = getPossibleMoves;
    function scoreMoves(moves, turnIndexBeforeMove) {
        var scoredMoves = [];
        var bestMoves = [];
        var max = 0;
        for (var i = 0; i < moves.length; i++) {
            scoredMoves[i] = getScoredMove(moves[i], turnIndexBeforeMove);
            if (scoredMoves[i] == max) {
                bestMoves.push(moves[i]);
            }
            else if (scoredMoves[i] > max) {
                bestMoves = [];
                bestMoves.push(moves[i]);
            }
        }
        var randomMove = Math.floor(Math.random() * bestMoves.length);
        return bestMoves[randomMove];
    }
    aiService.scoreMoves = scoreMoves;
    function getScoredMove(move, turnIndexBeforeMove) {
        var scoredMove = 0;
        var board = move[1].set.value;
        var delta = move[2].set.value;
        var row = delta.row;
        var col = delta.col;
        scoredMove += checkHit(board, row + 1, col, turnIndexBeforeMove);
        scoredMove += checkHit(board, row - 1, col, turnIndexBeforeMove);
        scoredMove += checkHit(board, row, col + 1, turnIndexBeforeMove);
        scoredMove += checkHit(board, row, col - 1, turnIndexBeforeMove);
        return scoredMove;
    }
    aiService.getScoredMove = getScoredMove;
    function checkHit(board, row, column, turnIndexBeforeMove) {
        if (row > 9 || column > 9 || row < 0 || column < 0) {
            return 0;
        }
        if (board[turnIndexBeforeMove][row][column] === 'O') {
            return 1;
        }
        return 0;
    }
    /**
     * Returns the move that the computer player should do for the given board.
     * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
     * and it has either a millisecondsLimit or maxDepth field:
     * millisecondsLimit is a time limit, and maxDepth is a depth limit.
     */
    function createComputerMove(board, playerIndex, alphaBetaLimits) {
        // We use alpha-beta search, where the search states are TicTacToe moves.
        // Recal that a TicTacToe move has 3 operations:
        // 0) endMatch or setTurn
        // 1) {set: {key: 'board', value: ...}}
        // 2) {set: {key: 'delta', value: ...}}]
        // return alphaBetaService.alphaBetaDecision(
        //     [null, {set: {key: 'board', value: board}}],
        //     playerIndex, getNextStates, getStateScoreForIndex0,
        //     // If you want to see debugging output in the console, then surf to index.html?debug
        //     window.location.search === '?debug' ? getDebugStateToString : null,
        //     alphaBetaLimits);
        return randomGuess(getPossibleMoves(board, playerIndex));
    }
    aiService.createComputerMove = createComputerMove;
    function randomGuess(possibleMoves) {
        var finalMove;
        var randomMove = Math.floor(Math.random() * possibleMoves.length);
        finalMove = possibleMoves[randomMove];
        //console.log(possibleMoves.length);
        // for (var possibleMove in possibleMoves){
        //
        // }
        return finalMove;
    }
    aiService.randomGuess = randomGuess;
})(aiService || (aiService = {}));
