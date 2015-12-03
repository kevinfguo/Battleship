var game;
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
