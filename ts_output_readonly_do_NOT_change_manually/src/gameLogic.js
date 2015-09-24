var gameLogic;
(function (gameLogic) {
    /** Returns the initial TicTacToe board, which is a 3x3 matrix containing ''. */
    // export function getInitialBoard(): Board {
    //   return [['', '', ''],
    //           ['', '', ''],
    //           ['', '', '']];
    // }
    function getInitialBoard() {
        return [
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
                ['', '', '', '', '', '', '', '', '', '']]
        ];
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
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var cell1 = board[3 - turnIndexBeforeMove][i][j];
                var cell2 = board[turnIndexBeforeMove][i][j];
                if (cell1 == 'X' && cell2 != 'X') {
                    return '';
                }
            }
        }
        if (turnIndexBeforeMove === 0) {
            return "P1";
        }
        else {
            return "P2";
        }
    }
    /**
     * Returns all the possible moves for the given board and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function getPossibleMoves(board, turnIndexBeforeMove) {
        var possibleMoves = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                try {
                    possibleMoves.push(createMove(board, i, j, turnIndexBeforeMove));
                }
                catch (e) {
                }
            }
        }
        return possibleMoves;
    }
    gameLogic.getPossibleMoves = getPossibleMoves;
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(board, row, col, turnIndexBeforeMove) {
        if (!board) {
            // Initially (at the beginning of the match), the board in state is undefined.
            board = getInitialBoard();
        }
        if (board[turnIndexBeforeMove][row][col] !== '') {
            throw new Error("One can only make a move in an empty position!");
        }
        if (getWinner(board, turnIndexBeforeMove) !== '') {
            throw new Error("Can only make a move if the game is not over!");
        }
        var boardAfterMove = angular.copy(board);
        boardAfterMove[turnIndexBeforeMove][row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
        var winner = getWinner(boardAfterMove, turnIndexBeforeMove);
        var firstOperation;
        if (winner !== '') {
            // Game over.
            firstOperation = { endMatch: { endMatchScores: winner === 'X' ? [1, 0] : winner === 'O' ? [0, 1] : [0, 0] } };
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
