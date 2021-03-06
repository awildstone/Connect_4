/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7; //width of board
const HEIGHT = 6; //height of board
let gameInPlay = true; //boolean to track if game is in play
let score1 = 0; //counter for player1 score
let score2 = 0; //counter for player2 score
let currPlayer = 1; //current active player: 1 or 2
const board = []; //array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < WIDTH; x++) {
      const rowItem = null;
      row.push(rowItem);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

 // Create the top row of our board which will act as the game controller for the players. Top row contains a control-row id and a click event listener.
  const controlRow = document.createElement("tr");
  controlRow.setAttribute("id", "control-row");
  controlRow.addEventListener("click", handleClick);

  // Add our top(controller) row. Each cell has a unique id indicating the column order. Create each td and add to our html game board.
  for (let x = 0; x < WIDTH; x++) {
    const controlCell = document.createElement("td");
    controlCell.setAttribute("id", x);
    controlRow.append(controlCell);
  }
  htmlBoard.append(controlRow);

  // Build each column and row for our html game board. Y represents the height of each column, and X represents the width of rows. Each table row with the specified row width is added to the htmlBoard.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // Starting at the bottom of our memory board, find the first coordinate that returns null (falsey).
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if(!board[y][x]) {
      return y;
    }
  }
  // if all cells are played, change the control cell bg color  
    allPlayed(x);
    return null;
}

/* Changes the color of the player control for the provided control row if all cells have been played */
function allPlayed(x) {
  const xCol = document.getElementById(`${x}`);
  xCol.style.background = '#333333';
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // make a div and insert into specified table cell id
  const piece = document.createElement('div');

  // set a class for piece and for the current player
  piece.setAttribute('class', `piece p${currPlayer}`);

  // select the target spot in the DOM by id using the y & x coordinates
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/* updateScore checks which player just won, and updates that player's score. When there is a draw no players get points. */
function updateScore(){
  // select each player score div
  const player1 = document.getElementById('score1');
  const player2 = document.getElementById('score2');

  if (currPlayer === 1) {
    player1.innerText = `Player 1 Score: ${score1 = score1 + 1}`;
  } else {
    player2.innerText = `Player 2 Score: ${score2 = score2 + 1}`;
  }
}

/** endGame: announce game end */
function endGame(msg) {
  // alert users the game is over and if there is a winner or draw. Delay so piece can fall before alert runs.
  setTimeout(function() {alert(msg);}, 350);

  // set game over to prevent futher playing
  gameInPlay = false;

  // update score if not a draw
  if (msg !== 'Player 1 & Player 2 draw!') {
    updateScore();
  }

  //offer players option to play again
  makePlayAgainButton();
}

/* makePlayAgainButton creates a button to allow players the option to play again once game is over */
function makePlayAgainButton() {
  const div = document.querySelector('#button');
  let button = document.createElement('button');
  button.innerText = 'Play Again?';
  button.addEventListener('click', playAgain);
  div.append(button);
}

/* Handler for makePlayAgainButton button click event. PlayAgain resets the game values and builds a new memory and html board*/
function playAgain(e) {
  gameInPlay = true; //set gameplay true
  currPlayer = 1; //start new game with player 1
  board.length = 0; //reset memory board

  //target and remove old html board
  const oldBoard = document.querySelectorAll('table tr');
  oldBoard.forEach(tr => tr.remove());

  //target and remove play again button
  const button = document.querySelector('button');
  button.remove();
  
  //make new memory and html board
  makeBoard();
  makeHtmlBoard();
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x coordinate from id of target event. + is parsing to int
  const x = +evt.target.id;

  // if the game is over, prevent playing
  if (gameInPlay === false) return;

  // get y coordinate (if null, ignore click)
  const y = findSpotForCol(x);
  if (y === null) return;

   // update in-memory board
   board[y][x] = currPlayer;

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win, if winner end game
  if (checkForWin(y, x)) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for draw
  checkForDraw();

  // switch currPlayer 1 <-> 2
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/* Check for draw. If all cells in memory board are filled notify players of draw and end the game */
function checkForDraw() {
  if (board.every(arr => arr.every(val => val))) {
    return endGame('Player 1 & Player 2 draw!');
  }
}

/** checkForWin: accepts the coordindates of the current play and checks for win*/
function checkForWin(y, x) {
  // Check four cells to see if they are within valid range and played by the current player.
  function _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 && //confirm y coord is within the valid height range 0-5
        y < HEIGHT &&
        x >= 0 && //confirm x coord is within the valid width range 0-6
        x < WIDTH &&
        board[y][x] === currPlayer //check if current coordinate was played by current player
    );
  }
  //checks every possible direction from the current play to see if there is a win
  let horizLeft = [[y, x], [y, x - 1], [y, x - 2], [y, x - 3]];
  let horizRight = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
  let vertUp = [[y, x], [y - 1, x], [y - 2, x], [y - 3, x]];
  let vertDown = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
  let diagUR = [[y, x], [y - 1, x + 1], [y - 2, x + 2], [y - 3, x + 3]];
  let diagLR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
  let diagUL = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];
  let diagLL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

  if (_win(horizLeft) || _win(horizRight) || _win(vertUp) || _win(vertDown) || _win(diagUR) || _win(diagLR) || _win(diagUL) || _win(diagLL)) {
    return true;
  }
}

makeBoard();
makeHtmlBoard();