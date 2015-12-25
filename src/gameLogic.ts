type Board = {gameBoard: string[][][], phase: number};
interface BoardDelta {
  row: number;
  col: number;
  direction : number;
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
            ['','','','','','','','','','']]
          ],
        "phase":0};
  }

  export function getGamePhase(board: Board) : number{
    return board.phase;
  }

  export function getShipLength(phase: number){
    if (phase == 0 || phase == 5){
      return 5;
    }else if (phase == 1 || phase == 6){
      return 4;
    }else if (phase == 2 || phase == 3 || phase == 7 || phase == 8){
      return 3;
    }else if (phase == 4 || phase == 9){
      return 2;
    }
  }

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
      board: Board, row: number, col: number, direction: number, turnIndexBeforeMove: number): IMove {
    if (!board) {
      // Initially (at the beginning of the match), the board in state is undefined.
      board = getInitialBoard();
    }
    if (board.phase === 0 || board.phase === 1 || board.phase === 2 || board.phase === 3 || board.phase === 4){
      var boardAfterMove = angular.copy(board);
      var firstOperation: IOperation = {setTurn: {turnIndex: 0}};
      var delta: BoardDelta = {row: row, col: col, direction: direction};
      //Right
      if (direction == 0){
        for (var i = 0; i < getShipLength(board.phase); i++){
          boardAfterMove.gameBoard[2+turnIndexBeforeMove][row][col+i] = 'X';
        }
      //Down
      }else if (direction == 1){
        for (var i = 0; i < getShipLength(board.phase); i++){
          boardAfterMove.gameBoard[2+turnIndexBeforeMove][row+i][col] = 'X';
        }
      //Left
      }else if (direction == 2){
        for (var i = 0; i < getShipLength(board.phase); i++){
          boardAfterMove.gameBoard[2+turnIndexBeforeMove][row][col-i] = 'X';
        }
      //Up
      }else if (direction == 3){
        for (var i = 0; i < getShipLength(board.phase); i++){
          boardAfterMove.gameBoard[2+turnIndexBeforeMove][row-i][col] = 'X';
        }
      }
      boardAfterMove.phase = board.phase + 1;
      if (boardAfterMove.phase == 5){
        firstOperation = {setTurn: {turnIndex: 1}}
      }
      return [firstOperation,
              {set: {key: 'board', value: boardAfterMove}},
              {set: {key: 'delta', value: delta}}];
    }else if (board.phase === 5 || board.phase === 6 || board.phase === 7 || board.phase === 8 || board.phase === 9){
      var boardAfterMove = angular.copy(board);
      var firstOperation: IOperation = {setTurn: {turnIndex: 1}};
      var delta: BoardDelta = {row: row, col: col, direction: direction};
      var clean : boolean = true;
      if (direction == 0){
        for (var i = 0; i < getShipLength(board.phase); i++){
          if (boardAfterMove.gameBoard[2+turnIndexBeforeMove][row][col+i] == 'X'){
            throw new Error("A ship is already here!");
            clean = false;
          }
        }
        if (clean){
          for (var i = 0; i < getShipLength(board.phase); i++){
            boardAfterMove.gameBoard[2+turnIndexBeforeMove][row][col+i] = 'X';
          }
        }
      }else if (direction == 1){
        for (var i = 0; i < getShipLength(board.phase); i++){
          if (boardAfterMove.gameBoard[2+turnIndexBeforeMove][row+i][col] == 'X'){
            throw new Error("A ship is already here!");
            clean = false;
          }
        }
        if (clean){
          for (var i = 0; i < getShipLength(board.phase); i++){
            boardAfterMove.gameBoard[2+turnIndexBeforeMove][row+i][col] = 'X';
          }
        }
      }else if (direction == 2){
        for (var i = 0; i < getShipLength(board.phase); i++){
          if (boardAfterMove.gameBoard[2+turnIndexBeforeMove][row][col-i] == 'X'){
            throw new Error("A ship is already here!");
            clean = false;
          }
        }
        if (clean){
          for (var i = 0; i < getShipLength(board.phase); i++){
            boardAfterMove.gameBoard[2+turnIndexBeforeMove][row][col-i] = 'X';
          }
        }
      }else if (direction == 3){
        for (var i = 0; i < getShipLength(board.phase); i++){
          if (boardAfterMove.gameBoard[2+turnIndexBeforeMove][row-i][col] == 'X'){
            throw new Error("A ship is already here!");
            clean = false;
          }
        }
        if (clean){
          for (var i = 0; i < getShipLength(board.phase); i++){
            boardAfterMove.gameBoard[2+turnIndexBeforeMove][row-i][col] = 'X';
          }
        }
      }
      boardAfterMove.phase = board.phase + 1;
      if (boardAfterMove.phase == 10){
        firstOperation = {setTurn: {turnIndex: 0}}
      }
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
        log.info("Game over! Winner is: ", winner);
        firstOperation = {endMatch: {endMatchScores:
          winner === 'P1' ? [1, 0] : [0, 1]}};
      } else {
        // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
        firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
      }
      var delta: BoardDelta = {row: row, col: col, direction: direction};
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
      var direction = deltaValue.direction;
      var board = stateBeforeMove.board;
      var expectedMove = createMove(board, row, col, direction, turnIndexBeforeMove);
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
