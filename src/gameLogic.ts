type Board = {gameBoard: string[][][], phase: number};
interface BoardDelta {
  row: number;
  col: number;
}
interface IState {
  board?: Board;
  delta?: BoardDelta;
}

module gameLogic {

  export const ROWS = 10;
  export const COLS = 10;

  /** Returns the initial TicTacToe board, which is a 3x3 matrix containing ''. */
  // export function getInitialBoard(): Board {
  //   return [['', '', ''],
  //           ['', '', ''],
  //           ['', '', '']];
  // Battleship returns 4 10X10 matrix, where 0 board is P1's move board,
  // 1 board is P2's move board, 2 board is P1's ship board, 3 board is P2's
  // ship board
  // }
  export function getInitialBoard() : Board{
    return {"gameBoard":[
            [['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','','']],
            [['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','',''],
            ['','','','','','','','','','']],
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
            [['X','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['','','X','X','X','','','','',''],
            ['','X','','','','','','','',''],
            ['','X','','','','','','','',''],
            ['','X','','','','','','','X',''],
            ['','X','','','','','','','X','']],
            [['','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['X','','','','','','','','',''],
            ['','','','','','X','X','X','',''],
            ['','','','','','','','','',''],
            ['X','X','X','X','','','','','',''],
            ['','','','','','','','','X','X']]
          ],
        "phase":2};
  }

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
  function getWinner(board: Board, turnIndexBeforeMove: number): string {
    var P1 = true;
    var P2 = true;
    for (var i = 0; i < 10; i++){
      for (var j = 0; j < 10; j++) {
        var cell1 = board.gameBoard[3][i][j];
        var cell2 = board.gameBoard[0][i][j];
        if (cell1 == 'X' && cell2 != 'O'){
          P1 = false;
        }
      }
    }
    for (var i = 0; i < 10; i++){
      for (var j = 0; j < 10; j++) {
        var cell1 = board.gameBoard[2][i][j];
        var cell2 = board.gameBoard[1][i][j];
        if (cell1 == 'X' && cell2 != 'O'){
          P2 = false;
        }
      }
    }
    if (P1){
      return "P1";
    }else if (P2){
      return "P2";
    }else{
      return "";
    }
  }

  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  export function createMove(
      board: Board, row: number, col: number, turnIndexBeforeMove: number): IMove {
    if (!board) {
      // Initially (at the beginning of the match), the board in state is undefined.
      board = getInitialBoard();
    }
    if (board.phase === 1){
      var boardAfterMove = angular.copy(board);
      boardAfterMove.gameBoard[3-turnIndexBeforeMove][row][col] = 'X';
      var firstOperation: IOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
      var delta: BoardDelta = {row: row, col: col};
      return [firstOperation,
              {set: {key: 'board', value: boardAfterMove}},
              {set: {key: 'delta', value: delta}}];
    }else{
      if (board.gameBoard[turnIndexBeforeMove][row][col] !== '') {
        throw new Error("One can only make a move in an empty position!");
      }
      if (getWinner(board,turnIndexBeforeMove) !== '') {
        throw new Error("Can only make a move if the game is not over!");
      }
      var boardAfterMove = angular.copy(board);
      if (boardAfterMove.gameBoard[3-turnIndexBeforeMove][row][col] === 'X'){
        boardAfterMove.gameBoard[turnIndexBeforeMove][row][col] = 'O';
      }else{
        boardAfterMove.gameBoard[turnIndexBeforeMove][row][col] = 'X';
      }
      var winner = getWinner(boardAfterMove,turnIndexBeforeMove);
      var firstOperation: IOperation;
      if (winner !== '') {
        // Game over.
        firstOperation = {endMatch: {endMatchScores:
          winner === 'P1' ? [1, 0] : [0, 1]}};
      } else {
        // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
        firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
      }
      var delta: BoardDelta = {row: row, col: col};
      return [firstOperation,
              {set: {key: 'board', value: boardAfterMove}},
              {set: {key: 'delta', value: delta}}];
    }
  }

  export function isMoveOk(params: IIsMoveOk): boolean {
    var move = params.move;
    var turnIndexBeforeMove = params.turnIndexBeforeMove;
    var stateBeforeMove: IState = params.stateBeforeMove;
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
      var deltaValue: BoardDelta = move[2].set.value;
      var row = deltaValue.row;
      var col = deltaValue.col;
      var board = stateBeforeMove.board;
      var expectedMove = createMove(board, row, col, turnIndexBeforeMove);
      if (!angular.equals(move, expectedMove)) {
        return false;
      }
    } catch (e) {
      // if there are any exceptions then the move is illegal
      return false;
    }
    return true;
  }
}
