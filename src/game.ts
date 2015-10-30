module game {
  let animationEnded = false;
  let canMakeMove = false;
  let isComputerTurn = false;
  let lastUpdateUI: IUpdateUI = null;
  let state: IState = null;
  export let isHelpModalShown: boolean = false;

  export function init() {
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

  function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI:", params);
    animationEnded = false;
    lastUpdateUI = params;
    state = params.stateAfterMove;
    if (!state.board) {
      state.board = gameLogic.getInitialBoard();
    }
    canMakeMove = params.turnIndexAfterMove >= 0 && // game is ongoing
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

  export function cellClicked(row: number, col: number, board: number): void {
    log.info("Clicked on board:", board, "Clicked on cell:", row, col);
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    if (!canMakeMove || lastUpdateUI.turnIndexAfterMove != 1-board) {
      return;
    }
    try {
      let move = gameLogic.createMove(
          state.board, row, col, lastUpdateUI.turnIndexAfterMove);
      canMakeMove = false; // to prevent making another move
      gameService.makeMove(move);
    } catch (e) {
      log.info(["Cell is already full in position:", row, col]);
      return;
    }
  }

  export function shouldShowImage(row: number, col: number, player: number): boolean {
    let cell = state.board[1-player][row][col];
    return cell !== "";
  }

  export function isPieceX(row: number, col: number, player: number): boolean {
    return state.board[1-player][row][col] === 'X';
  }

  export function isPieceO(row: number, col: number, player: number): boolean {
    return state.board[1-player][row][col] === 'O';
  }

  export function shouldSlowlyAppear(row: number, col: number): boolean {
    return !animationEnded &&
        state.delta &&
        state.delta.row === row && state.delta.col === col;
  }

  export function isBattleship(row: number, col: number, player: number): boolean {
    if (lastUpdateUI.turnIndexBeforeMove != 1-player || isComputerTurn){
      return false;
    }
    return state.board[2+player][row][col] === 'X';
  }
}

angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
  .run(function () {
  $rootScope['game'] = game;
  translate.setLanguage('en',  {
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
