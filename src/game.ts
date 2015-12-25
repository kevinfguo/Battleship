module game {
  let animationEnded = false;
  let canMakeMove = false;
  let isComputerTurn = false;
  let lastUpdateUI: IUpdateUI = null;
  let state: IState = null;
  export let isHelpModalShown: boolean = false;

  var draggingPiece: HTMLElement;
  let gameArea:HTMLElement;
  let realGameArea:HTMLElement;
  let draggingLines:HTMLElement;
  let verticalDraggingLine:HTMLElement;
  let horizontalDraggingLine:HTMLElement;
  let draggingSquare:HTMLElement;
  var rowsNum: number = 10;
  var colsNum: number = 20;
  var ship: number = 5;

  var startRow: number;
  var startCol: number;
  var startBoard: number;
  var direction: number = 0;

  export function init() {
    console.log("Translation of 'RULES_OF_BATTLESHIP' is " + translate('RULES_OF_BATTLESHIP'));
    resizeGameAreaService.setWidthToHeight(2);
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

  export function handleDragEvent(type: string, clientX: number, clientY: number){
    gameArea = document.getElementById("boardArea");
    realGameArea = document.getElementById("gameArea");
    draggingLines = document.getElementById("draggingLines");
    verticalDraggingLine = document.getElementById("verticalDraggingLine");
    horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
    draggingSquare = null;

    if (canMakeMove){

      // Center point in gameArea
      var x = clientX - realGameArea.offsetLeft;
      var y = clientY - Math.floor(gameArea.offsetTop+gameArea.offsetTop*0.05);
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
      var board : number = 0;
      if (col > 9){
        col = col - 10;
        board = 1;
      }
      var phase : number = gameLogic.getGamePhase(state.board);
      if (phase < 10){

        var shipLength = gameLogic.getShipLength(phase);
        if (type === "touchstart"){
          //log.info("Targeted row: " + row + " and column: " + col);
          direction = 0;
          startBoard = board;
          startRow = row;
          startCol = col;
          if (isValidConfig(shipLength, board, startRow, startCol, direction)){
            makeBattleShip(shipLength, board, row, col, direction);
          }
        }else if (type === "touchmove"){
          //log.info("Targeted row: " + row + " and column: " + col);
          if (row > startRow){
            direction = 1;
          }else if (col > startCol){
            direction = 0;
          }else if (col < startCol){
            direction = 2;
          }else if (row < startRow){
            direction = 3;
          }
          reDraw();
          if (isValidConfig(shipLength, board, startRow, startCol, direction)){

            makeBattleShip(shipLength, board, startRow, startCol, direction);
          }
        } else if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
          // drag ended
          draggingLines.style.display = "none";
          //log.info("Ended on row: " + row + " and column: " + col);
          if (isValidConfig(shipLength, board, startRow, startCol, direction)){
            cellClicked(startRow,startCol,board,direction, phase);
          }
          //dragDone(row, col);
        }

      }else{
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
          // drag ended
          draggingLines.style.display = "none";
          cellClicked(row,col,board,direction, phase);
        }
      }
    }

  }

  function isValidConfig(shipLength: number, board: number, row: number, col: number, direction: number){
    var phase : number = gameLogic.getGamePhase(state.board);
    if (board != startBoard || (phase < 5 && board != 0) || (phase > 4 && phase < 10 && board != 1)){
      return false;
    }
    if (direction == 0){
      if (col + shipLength <= 10){
        for (var i = 0; i < shipLength; i++){
          if (isBattleship(row, col+i, board, phase)){
            return false;
          }
        }
        return true;
      }
    }else if (direction == 1){
      if (row + shipLength <= 10){
        for (var i = 0; i < shipLength; i++){
          if (isBattleship(row+i, col, board, phase)){
            return false;
          }
        }
        return true;
      }
    }else if (direction == 2){
      if (col - shipLength >= -1){
        for (var i = 0; i < shipLength; i++){
          if (isBattleship(row, col-i, board, phase)){
            return false;
          }
        }
        return true;
      }
    }else if (direction == 3){
      if (row - shipLength >= -1){
        for (var i = 0; i < shipLength; i++){
          if (isBattleship(row-i, col, board, phase)){
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  function reDraw(){
    var phase : number = gameLogic.getGamePhase(state.board);
    if (phase < 5){
      for (var board = 0; board < 2; board++){
        for (var i = 0; i < 10; i++){
          for (var j = 0; j < 10; j++){
            if (game.isBattleship(i,j,board, phase)){
              document.getElementById("e2e_test_div_"+board+":"+i+"x"+(j)).style.backgroundColor = "grey";
            }else{
              document.getElementById("e2e_test_div_"+board+":"+i+"x"+(j)).style.backgroundColor = "#89CFF0";
            }
          }
        }
      }
    }else if (phase < 10){
      for (var board = 0; board < 2; board++){
        for (var i = 0; i < 10; i++){
          for (var j = 0; j < 10; j++){
            if (board == 0){
              document.getElementById("e2e_test_div_"+board+":"+i+"x"+(j)).style.backgroundColor = "#89CFF0";
            }else{
              if (game.isBattleship(i,j,board, phase)){
                document.getElementById("e2e_test_div_"+board+":"+i+"x"+(j)).style.backgroundColor = "grey";
              }else{
                document.getElementById("e2e_test_div_"+board+":"+i+"x"+(j)).style.backgroundColor = "#89CFF0";
              }
            }
          }
        }
      }
    }else{
      for (var board = 0; board < 2; board++){
        for (var i = 0; i < 10; i++){
          for (var j = 0; j < 10; j++){
              document.getElementById("e2e_test_div_"+board+":"+i+"x"+(j)).style.backgroundColor = "#89CFF0";

          }
        }
      }
    }
  }

  function makeBattleShip(shipLength: number, board: number, row: number, col: number, direction: number){
    //TODO Shield oob errors
      if (direction == 0){
        for (var i = 0; i < shipLength; i++){
            draggingSquare = document.getElementById("e2e_test_div_"+board+":"+row+"x"+(col+i));
            draggingSquare.style.backgroundColor = "grey";
        }
      }else if (direction == 1){
        for (var i = 0; i < shipLength; i++){
            draggingSquare = document.getElementById("e2e_test_div_"+board+":"+(row+i)+"x"+(col));
            draggingSquare.style.backgroundColor = "grey";
        }
      }else if (direction == 2){
        for (var i = 0; i < shipLength; i++){
            draggingSquare = document.getElementById("e2e_test_div_"+board+":"+row+"x"+(col-i));
            draggingSquare.style.backgroundColor = "grey";
        }
      }else if (direction == 3){
        for (var i = 0; i < shipLength; i++){
            draggingSquare = document.getElementById("e2e_test_div_"+board+":"+(row-i)+"x"+(col));
            draggingSquare.style.backgroundColor = "grey";
        }
      }
  }

  function getSquareCenterXY(row:number, col:number) {
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
      // if (isComputerTurn) {
      //   sendComputerMove();
      // }
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
    log.info("Is computer turn?", isComputerTurn);
    if (isComputerTurn) {
      // To make sure the player won't click something and send a move instead of the computer sending a move.
      canMakeMove = false;
      // We calculate the AI move only after the animation finishes,
      // because if we call aiService now
      // then the animation will be paused until the javascript finishes.
      // if (!state.delta || params.stateBeforeMove.board.phase < 10) {
      //   // This is the first move in the match, so
      //   // there is not going to be an animation, so
      //   // call sendComputerMove() now (can happen in ?onlyAIs mode)
      //   sendComputerMove();
      // }
      sendComputerMove();
    }
    if (state != null){
      if (gameLogic.getGamePhase(state.board) > 0){
        reDraw();
      }
    }
  }

  export function cellClicked(row: number, col: number, board: number, direction:number, phase:number): void {
    log.info("Clicked on board:", board, "Clicked on cell:", row, col);
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    if (!canMakeMove || (phase == 10 && lastUpdateUI.turnIndexAfterMove != 1-board) || (phase < 10 && lastUpdateUI.turnIndexAfterMove != board)) {
      return;
    }
    try {
      let move = gameLogic.createMove(
          state.board, row, col, direction, lastUpdateUI.turnIndexAfterMove);
      canMakeMove = false; // to prevent making another move
      gameService.makeMove(move);
    } catch (e) {
      log.info(["Cell is already full in position:", row, col]);
      return;
    }
  }

  export function shouldShowImage(row: number, col: number, player: number): boolean {
    let cell = state.board.gameBoard[1-player][row][col];
    return cell !== "";
  }

  export function isPieceX(row: number, col: number, player: number): boolean {
    return state.board.gameBoard[1-player][row][col] === 'X';
  }

  export function isPieceO(row: number, col: number, player: number): boolean {
    return state.board.gameBoard[1-player][row][col] === 'O';
  }

  export function shouldSlowlyAppear(row: number, col: number): boolean {
    return !animationEnded &&
        state.delta &&
        state.delta.row === row && state.delta.col === col;
  }

  export function isBattleship(row: number, col: number, player: number, phase: number): boolean {
    if ( (phase == 10 && lastUpdateUI.turnIndexBeforeMove != 1-player) || isComputerTurn){
      return false;
    }
    return state.board.gameBoard[2+player][row][col] === 'X';
  }

  export function isABattleship(row: number, col: number, player: number) : boolean{
    if (lastUpdateUI.turnIndexBeforeMove != 1-player || isComputerTurn){
      return false;
    }
    return state.board.gameBoard[2+player][row][col] === 'X';
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
    CLOSE: "Close"
  });
  game.init();
});
