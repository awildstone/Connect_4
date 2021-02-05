describe('Connect 4 Tests', function() {
    beforeEach(function() {
        makeBoard();
        makeHtmlBoard();
    });

    it('should build a new gameboard in memory on makeBoard()', function() {
        expect(board.length).not.toEqual(0);
        expect(board[0][0]).toEqual(null);
    });

    it ('should create rows and add them to a table on makeHtmlBoard()', function() {
        const rows = document.querySelectorAll('table tr');
        expect(rows[0].id).toEqual('column-top');
        expect(rows.length).toEqual(7);
    });

    it('should create new table cells for the HTML board on makeHtmlBoard()', function() {
        const gameCells = document.querySelectorAll('table tr td');
        expect(gameCells.length).toEqual(49);
        expect(gameCells[7].id).toEqual('0-0');
        expect(gameCells[48].id).toEqual('5-6');
    });

    it('it should return the first available y coordinate on the board on findSpotForCol(x)', function() {
       expect(findSpotForCol(0)).toEqual(5);
       expect(findSpotForCol(1)).toEqual(5);
       expect(findSpotForCol(2)).toEqual(5);
       expect(findSpotForCol(3)).toEqual(5);
       expect(findSpotForCol(4)).toEqual(5);
       expect(findSpotForCol(5)).toEqual(5);
    });

    it('should place a piece on the board with the provided coordindates on placeInTable(y, x)', function() {
        placeInTable(0, 0);
        placeInTable(5, 6);
        placeInTable(2, 4);
        placeInTable(4, 1);
        const gameCells = document.querySelectorAll('table tr td');
        expect(gameCells[7].innerHTML).toEqual('<div class="piece p1"></div>');
        expect(gameCells[48].innerHTML).toEqual('<div class="piece p1"></div>');
        expect(gameCells[25].innerHTML).toEqual('<div class="piece p1"></div>');
        expect(gameCells[36].innerHTML).toEqual('<div class="piece p1"></div>');
    });

    it('should update the current player score on updateScore()', function() {
        const player1 = document.getElementById('score1');
        const player2 = document.getElementById('score2');

        updateScore();
        expect(player1.innerText).toEqual('Player 1 Score: 1');
        player1.innerText = 'Player 1 Score: 0';

        currPlayer = 2;
        updateScore();
        expect(player2.innerText).toEqual('Player 2 Score: 1');
        player2.innerText = 'Player 2 Score: 0';
    });

    it('should end the game in play and notify players of game end on endGame(msg)', function() {

        // spyOn(component, 'endGame').withArgs('Player 1 wins!');
        // spyOn(window, 'alert');
        endGame('Player 1 wins!');
        // expect(window, 'alert').toHaveBeenCalledWith('Player 1 wins!');
        expect(gameInPlay).toEqual(false);
        const button = document.querySelector('button');
        button.remove();
    });

    it('should create and add a button to allow players to play again on gameOver()', function() {
        gameOver();
        const button = document.querySelector('button');
        expect(button).not.toEqual(undefined);
        expect(button.innerText).toEqual('Play Again?');
        button.remove();
    });

    it('should check the memory board for a draw, and end game if draw on checkForDraw()', function() {
        checkForDraw();
        expect(gameInPlay).toEqual(true);

        board.forEach((row, y) => row.forEach((cell, x) => board[y][x] = currPlayer));
        checkForDraw();
        expect(gameInPlay).toEqual(false);
    });

    it('should check board for win and return true if current player has won on checkForWin()', function() {
        board[5][0] = currPlayer;
        board[5][1] = currPlayer;
        board[5][2] = currPlayer;
        board[5][3] = currPlayer;
        expect(checkForWin()).toEqual(true);
    });

    it('should check the board for win and return undefined if there is no win on checkForWin()', function() {
        expect(checkForWin()).toEqual(undefined);
    });

    afterEach(function() {
        currPlayer = 1;
        gameInPlay = true;
        score1 = 0;
        score2 = 0;
        board.length = 0;
        const oldBoard = document.querySelectorAll('table tr');
        oldBoard.forEach(tr => tr.remove());
    });

});