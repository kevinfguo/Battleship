module aiService {
  /** Returns the move that the computer player should do for the given updateUI. */
  export function findComputerMove(updateUI: IUpdateUI): IMove {
    return createComputerMove(
        updateUI.stateAfterMove.board,
        updateUI.turnIndexAfterMove,
        // at most 1 second for the AI to choose a move (but might be much quicker)
        {millisecondsLimit: 1000})
  }

  /**
   * Returns all the possible moves for the given board and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
  export function getPossibleMoves(board: Board, turnIndexBeforeMove: number): IMove[] {
    let possibleMoves: IMove[] = [];
    for (let i = 0; i < gameLogic.ROWS; i++) {
      for (let j = 0; j < gameLogic.COLS; j++) {
        try {
          possibleMoves.push(gameLogic.createMove(board, i, j, turnIndexBeforeMove));
        } catch (e) {
          // The cell in that position was full.
        }
      }
    }
    return possibleMoves;
  }

  export function scoreMoves(moves : IMove[], turnIndexBeforeMove: number) : IMove{
    let scoredMoves: number[] = [];
    let bestMoves: IMove[] = [];
    let max : number = 0;
    for (let i = 0; i < moves.length; i++){
      scoredMoves[i] = getScoredMove(moves[i], turnIndexBeforeMove);
      if (scoredMoves[i] == max){
        bestMoves.push(moves[i]);
      }else if (scoredMoves[i] > max){
        bestMoves = [];
        bestMoves.push(moves[i]);
      }
    }
    let randomMove = Math.floor(Math.random()*bestMoves.length);
    return bestMoves[randomMove];
  }

  export function getScoredMove(move: IMove, turnIndexBeforeMove: number): number{
    let scoredMove : number = 0;
    let board : Board = move[1].set.value;
    let delta : BoardDelta = move[2].set.value;
    let row : number = delta.row;
    let col : number = delta.col;
    scoredMove += checkHit(board, row+1, col, turnIndexBeforeMove);
    scoredMove += checkHit(board, row-1, col, turnIndexBeforeMove);
    scoredMove += checkHit(board, row, col+1, turnIndexBeforeMove);
    scoredMove += checkHit(board, row, col-1, turnIndexBeforeMove);
    return scoredMove;
  }

  function checkHit(board: Board, row: number, column: number, turnIndexBeforeMove: number): number{
    if (row > 9 || column > 9 || row < 0 || column < 0){
      return 0;
    }
    if (board.gameBoard[turnIndexBeforeMove][row][column] === 'O'){
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
  export function createComputerMove(
      board: Board, playerIndex: number, alphaBetaLimits: IAlphaBetaLimits): IMove {
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

  export function randomGuess(possibleMoves: IMove[]) : IMove{
    var finalMove : IMove;
    var randomMove = Math.floor(Math.random()*possibleMoves.length);
    finalMove = possibleMoves[randomMove];
    //console.log(possibleMoves.length);
    // for (var possibleMove in possibleMoves){
    //
    // }
    return finalMove;
  }

  // function getStateScoreForIndex0(move: IMove, playerIndex: number): number {
  //   if (move[0].endMatch) {
  //     let endMatchScores = move[0].endMatch.endMatchScores;
  //     return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
  //         : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
  //         : 0;
  //   }
  //   return 0;
  // }

  // function getNextStates(move: IMove, playerIndex: number): IMove[] {
  //   return getPossibleMoves(move[1].set.value, playerIndex);
  // }
  //
  // function getDebugStateToString(move: IMove): string {
  //   return "\n" + move[1].set.value.join("\n") + "\n";
  // }
}
