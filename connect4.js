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

 // Create the top row of our board which will act as the game controller for the players. Top row contains a column-top id and a click event listener.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Add our top(controller) row. Each cell has a unique id indicating the column order. Create each td and add to our html game board.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

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
  // select all td elements in column x using queryselector. Add 1 to select valid nth-child.
  const xCol = document.querySelectorAll(`tr td:nth-child(${x + 1})`);

  // starting at the end of the list (bottom of column), find the first available td without a child div element and return the index - 1 for valid coordinate number (first row is reserved for control). Otherwise return null if all tds contain chid div.
  for (let i = xCol.length - 1; i >= 1; i--) {
    if (xCol[i].firstChild === null) {
      return i - 1;
    }
  }
  // if all cells are played, change the control cell bg color
  xCol[0].style.background = '#333333';
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // make a div and insert into specified table cell id
  const piece = document.createElement('div');

  // set a class for piece and for the current player
  piece.setAttribute('class', `piece p${currPlayer}`);

  // select the target td by id using the y & x coordinates
  const td = document.getElementById(`${y}-${x}`);
  td.append(piece);
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
  gameOver();
}

/* gameOver creates a button to allow players the option to play again once game is over */
function gameOver() {
  const div = document.querySelector('#button');
  let button = document.createElement('button');
  button.innerText = 'Play Again?';
  button.addEventListener('click', playAgain);
  div.append(button);
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

/* Handler for gameOver button click event. PlayAgain resets the game values and builds a new memory and html board*/
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
  // if the game is over, prevent playing
  if (gameInPlay === false) return;

  // get x coordinate from id of target event
  const x = +evt.target.id;

  // get y coordinate (if null, ignore click)
  const y = findSpotForCol(x);
  if (y === null) return;

  // place piece in board and add to HTML table
  placeInTable(y, x);

 // update in-memory board
  board[y][x] = currPlayer;

  // check for win, if winner end game
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for draw. if all cells in memory board are filled notify draw and end game
  if (board.every(arr => arr.every(val => val !== null))) {
    return endGame('Player 1 & Player 2 draw!');
  }

  // switch currPlayer 1 <-> 2
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 && //confirm y coord is within the valid height range 0-6
        y < HEIGHT &&
        x >= 0 && //confirm x coord is within the valid width range 0-5
        x < WIDTH &&
        board[y][x] === currPlayer //check if current coordinate was played by current player
    );
  }

  // to check if there is a win, we iterate over the entire board to check if there is any win combination for horizonal, vertical, down-right diagonal, or down-left diagonal. 
  // I improved the speed of this progam by about 100ms by iterating from the bottom right of the board to the top left because our board pieces are played from the bottom up we will find the win faster with less iterations if we iterate from the bottom up.
  for (let y = HEIGHT - 1; y >= 0; y--) { //iterate over each row in table
    console.log(`CURRENT Y COORD: ${y}`);
    for (let x = WIDTH - 1; x >= 0; x--) { //iterate over each td in row
      console.log(`\tCURRENT X COORD: ${x}`);
      // on current y & x coordinate, select 3 squares to the right of this current coordinate
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // on current y & x coordinate, select 3 squares below this current coordinate
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // on current y & x coordinate, select 3 squares diagonally-right below this current coordinate
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // on current y & x coordinate, select 3 squares diagonally-left below this current coordinate
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // pass each group of coordindates to _win to confirm if they meet win criteria
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();