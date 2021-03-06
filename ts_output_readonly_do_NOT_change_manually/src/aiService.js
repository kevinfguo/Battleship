var aiService;
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
        //if (board.phase == )
        var possibleMoves = [];
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                try {
                    possibleMoves.push(gameLogic.createMove(board, i, j, 1, turnIndexBeforeMove));
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
        if (board.gameBoard[turnIndexBeforeMove][row][column] === 'O') {
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
        log.info(finalMove);
        return finalMove;
    }
    aiService.randomGuess = randomGuess;
})(aiService || (aiService = {}));
