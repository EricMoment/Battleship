const Ship = (length) => {
  let positions = []
  let hits = 0;
  let sunk = false
  const addPos = (row, column) => {
    positions.push([row, column])
  }
  //get all positions of each ship
  const getPos = () => positions
  const status = () => sunk
  const getLength = () => length
  const counted = () => sunk = 'Counted'
  // if hit, the ship's hit will up by 1, and if hits = length, the ship is sunk
  const isSunk = () => {
    hits++
    if (hits === length) {
      sunk = true
      //console.log(`Ship with length of ${length} has sunk`)
    }
    //console.log(`A ship has been hit`)
  }
  return { isSunk, status, addPos, getPos, counted, getLength }
}

const Gameboard = (player) => {
  const board = [ //O, X, '*', ' ' 
    //c 0    1    2    3    4    5    6    7    8    9      r
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //0
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //1
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //2
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //3
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //4
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //5
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //6
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //7
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //8
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']  //9
  ]; //10*10 board
  const getBoard = () => board
  //checking four directions. If there are edges or ships on each side, then the ship can't
  //be placed towards that direction
  const checkDirections = (row, column, length) => {
    let directions = ['left', 'up', 'right', 'down'] //four directions to place ship, randomize later

    const checkLeftOverlap = () => {
      for (let i = 1; i < length; i++) { //3 -> 2, 1
        if (board[row][column - i] === 'O') { return true }
      }
      return false
    }
    if (column < length - 1 || checkLeftOverlap()) { //check 'left'
      const index = directions.indexOf('left')
      if (index > -1) { // only splice array when item is found
        directions.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

    const checkUpOverlap = () => {
      for (let i = 1; i < length; i++) { //3 -> 2, 1
        if (board[row - i][column] === 'O') { return true }
      }
      return false
    }
    if (row < length - 1 || checkUpOverlap()) { //check 'up'
      const index = directions.indexOf('up')
      if (index > -1) { // only splice array when item is found
        directions.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

    const checkRightOverlap = () => {
      for (let i = 1; i < length; i++) { //3 -> 1, 2
        if (board[row][column + i] === 'O') { return true }
      }
      return false
    }
    if (column + length - 1 > 9 || checkRightOverlap()) { //check 'right'
      const index = directions.indexOf('right')
      if (index > -1) { // only splice array when item is found
        directions.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

    const checkDownOverlap = () => {
      for (let i = 1; i < length; i++) { //3 -> 1, 2
        if (board[row + i][column] === 'O') { return true }
      }
      return false
    }
    if (row + length - 1 > 9 || checkDownOverlap()) { //check 'down'
      const index = directions.indexOf('down')
      if (index > -1) { // only splice array when item is found
        directions.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    return directions
  }
  const placeShips = (length, index) => { //randomize
    let row;
    let column;
    let directions;
    do {
      //row col is the beginning point to place the ship
      row = Math.floor(Math.random() * 10)
      column = Math.floor(Math.random() * 10)
      //[left, up, right, down]
      directions = checkDirections(row, column, length) //check which d is available
      //there is a situation where first 4 ships surround 1 spot in the center. 
      //To prevent the row/column from gerenating there, we check length inside.
    } while (board[row][column] === 'O' && directions.length)
    //choose one of the doable directions
    let direction = directions[Math.floor(Math.random() * directions.length)]
    //every time #addships is called, a ship from factory is added in player's ships object
    player.addShips(index, length)
    switch (direction) {
      // two things, update board and update ships possessed by player/AI
      case 'left':
        for (let i = 0; i < length; i++) {
          board[row][column - i] = 'O'
          player.ships[index].addPos(row, column - i)
        }
        break;
      case 'up':
        for (let i = 0; i < length; i++) {
          board[row - i][column] = 'O'
          player.ships[index].addPos(row - i, column)
        }
        break;
      case 'right':
        for (let i = 0; i < length; i++) {
          board[row][column + i] = 'O'
          player.ships[index].addPos(row, column + i)
        }
        break;
      case 'down':
        for (let i = 0; i < length; i++) {
          board[row + i][column] = 'O'
          player.ships[index].addPos(row + i, column)
        }
        break;
    }
  }
  const boardHit = (row, column) => { //update board
    if (board[row][column] === 'O') {
      board[row][column] = 'X'
      return
    }
    board[row][column] = '*'
  }
  return { placeShips, boardHit, getBoard }
}

const Player = (userName) => {
  let comShipDestroyed = 0;
  const name = () => userName
  const ships = {}
  const addShips = (index, length) => ships[index] = Ship(length)
  const winCon = () => {
    if (comShipDestroyed === Object.keys(ships).length) return true
  }
  const playerDownsComShips = () => comShipDestroyed++
  const getComShipdestroyed = () => comShipDestroyed //maybe remove later
  return { name, ships, addShips, playerDownsComShips, winCon, getComShipdestroyed }
}
function directionFilter(board, lastShipHit) {
  //filtering out directions if the target has been struck.
  let directions = ['left', 'up', 'right', 'down']
  if (lastShipHit[1] - 1 < 0 || board[lastShipHit[0]][lastShipHit[1] - 1] === 'X' ||
    board[lastShipHit[0]][lastShipHit[1] - 1] === '*') {
    const index = directions.indexOf('left')
    if (index > -1) { // only splice array when item is found
      directions.splice(index, 1); // 2nd parameter means remove one item only
    }
  }
  if (lastShipHit[0] - 1 < 0 || board[lastShipHit[0] - 1][lastShipHit[1]] === 'X' ||
    board[lastShipHit[0] - 1][lastShipHit[1]] === '*') {
    const index = directions.indexOf('up')
    if (index > -1) { // only splice array when item is found
      directions.splice(index, 1); // 2nd parameter means remove one item only
    }
  }
  if (lastShipHit[1] + 1 > 9 || board[lastShipHit[0]][lastShipHit[1] + 1] === 'X' ||
    board[lastShipHit[0]][lastShipHit[1] + 1] === '*') {
    const index = directions.indexOf('right')
    if (index > -1) { 
      directions.splice(index, 1);
    }
  }
  if (lastShipHit[0] + 1 > 9 || board[lastShipHit[0] + 1][lastShipHit[1]] === 'X' ||
    board[lastShipHit[0] + 1][lastShipHit[1]] === '*') {
    const index = directions.indexOf('down')
    if (index > -1) { 
      directions.splice(index, 1); 
    }
  }
  let direction = directions.length && directions[Math.floor(Math.random() * directions.length)]

  //randomly choose one of available directions. If there is none, then randomly.
  let row;
  let column;
  if (direction === 'left') {
    row = lastShipHit[0]
    column = lastShipHit[1] - 1
  } else if (direction === 'up') {
    row = lastShipHit[0] - 1
    column = lastShipHit[1]
  } else if (direction === 'right') {
    row = lastShipHit[0]
    column = lastShipHit[1] + 1
  } else if (direction === 'down') {
    row = lastShipHit[0] + 1
    column = lastShipHit[1]
  } else {
    row = Math.floor(Math.random() * 10)
    column = Math.floor(Math.random() * 10)
  }
  return [row, column]
}
const Computer = () => {
  let playerShipDestroyed = 0
  const ships = {}
  const addShips = (index, length) => {
    ships[index] = Ship(length)
  }
  const MessageToPlayer = document.querySelector('.messFromCom')
  const MessageDestroyedShips = document.querySelector('.your_ships_destroyed')
  const previousHit = { cell: null, symbol: null }
  let lastShipHit
  let hasJustSunkaShip = false
  //**board = playerBoard = Gameboard(playersGen)
  const moves = (playerBoard, playersShips) => {
    let row;
    let column;
    const board = playerBoard.getBoard()
    //console.log('previous hit: ' + previousHit.cell)
    //console.log('last ship hit: ' + lastShipHit)
    do {
      /*simple AI. If computer hits 'O', it will hit surrounding cells until another 'O'
      then it repeats. If a ship sinks as a result, it will go back to random squares. */
      if ((previousHit.symbol === 'O' && hasJustSunkaShip === false) ||
        (previousHit.symbol === ' ' && !!lastShipHit &&
          /*If the distance between the 'X' and the 'O' equals one, then it strikes another
          direction from the last ship strike*/
          (Math.abs(previousHit.cell[0] - lastShipHit[0]) + Math.abs(previousHit.cell[1] - lastShipHit[1])) === 1)) {
        [row, column] = directionFilter(board, lastShipHit)
        //console.log(row, column)
      } else {
        row = Math.floor(Math.random() * 10)
        column = Math.floor(Math.random() * 10)
      }
    } while (board[row][column] === 'X' || board[row][column] === '*')
    let cell = document.getElementById(`${row},${column}p`)
    if (board[row][column] === ' ') {
      cell.textContent = '*'
      previousHit.cell = [row, column]/* */
      previousHit.symbol = ' '/* */
      hasJustSunkaShip = false/* */
    }
    if (board[row][column] === 'O') {
      cell.textContent = 'X'
      let shipIndex;
      for (const index in playersShips) {
        //check every position of computer's ships. 
        //If the point you click matches one of them, then hit/sunk
        playersShips[index].getPos().forEach(point => {
          if (point[0] === Number(row) && point[1] === Number(column)) {
            playersShips[index].isSunk()
            shipIndex = index
            return
          }
        })
      }
      if (playersShips[shipIndex].status() === true) {
        playerShipDestroyed++
        //change status to counted so the playerShipDestroyed is not incred every loop.
        playersShips[shipIndex].counted()
        hasJustSunkaShip = true /* */
        lastShipHit = null /* */
        MessageToPlayer.textContent = `Computer has destroyed your ship of length ${playersShips[shipIndex].getLength()}`
        MessageDestroyedShips.textContent = `Player Ships Destroyed: ${playerShipDestroyed}`
        //console.log('Player Ships Destroyed:' + playerShipDestroyed)
      } else { 
        hasJustSunkaShip = false 
        MessageToPlayer.textContent = ' '
      } /* */
      previousHit.cell = [row, column] /* */
      previousHit.symbol = 'O' /* */
      lastShipHit = [row, column] /* */
    }
    //update board with players' ships
    playerBoard.boardHit(row, column)
    //console.log('left board:')
    //console.log(board)
    //win condition and message
    if (playerShipDestroyed === Object.keys(playersShips).length) {
      MessageToPlayer.textContent = 'Computer has won~'
      document.querySelectorAll('.computer_square').forEach(square => {
        square.replaceWith(square.cloneNode(true))
      })
    }
  }
  return { addShips, ships, moves }
}

function printBoard() {
  const playersGen = Player('Arcas')
  const comGen = Computer()
  const playerBoard = Gameboard(playersGen)
  const comBoard =  Gameboard(comGen)
  const shiplist = [5, 4, 3, 3, 2, 1, 1, 1] //change ships here
  for (let i = 0; i < shiplist.length; i++) {
    playerBoard.placeShips(shiplist[i], i)
    comBoard.placeShips(shiplist[i], i)
  }
  //now that js boards have been generated, time to put them on HTML.
  //player_squares is your ships, hit by AI; 
  //computer_squares is computer ships, hit by you.
  let player_board = playerBoard.getBoard()
  //console.log(player_board)
  document.querySelectorAll('.player_square').forEach(square => { //print your board to com's side
    square.textContent = player_board[square.id.charAt(0)][square.id.charAt(2)]
  })
  return { playersGen, comGen, playerBoard, comBoard }
}
//The precedure: first create players and AI, assign them respective boards
//and ships. Ships are stored in both factories, boards store the players
//Then, print your ships to left/up side for AI to hit,
//print AI's ships to right/down side for you to hit.
(function game() {
  const { playersGen, comGen, playerBoard, comBoard } = printBoard()
  const playersShips = playersGen.ships
  const computersShips = comGen.ships
  const computer_board = comBoard.getBoard()
  const MessageToComputer = document.querySelector('.messFromPlayer')
  const MessageDestroyedShips = document.querySelector('.computer_ships_destroyed')
  //player moves. You have to use QSelectorAll because you need to remove each square's listener
  const computerSquaresHTML = document.querySelectorAll('.computer_square')
  computerSquaresHTML.forEach(square => {
    square.addEventListener('click', function e() { //you click on com boards
      const x = square.id.charAt(0)
      const y = square.id.charAt(2)
      if (computer_board[x][y] === ' ') {
        square.textContent = '*'
      } else if (computer_board[x][y] === 'O') {
        square.textContent = 'X'
        let shipIndex;
        for (const index in computersShips) {
          //check every position of computer's ships. 
          //If the point you click matches one of them, then hit/sunk
          computersShips[index].getPos().forEach(point => {
            if (point[0] === Number(x) && point[1] === Number(y)) {
              computersShips[index].isSunk()
              shipIndex = index
              return
            }
          })
        }
        if (computersShips[shipIndex].status() === true) {
          playersGen.playerDownsComShips()
          //change status to counted so the playerShipDestroyed is not incred every loop.
          computersShips[shipIndex].counted()
          MessageToComputer.textContent = `Player has destroyed computer's ship of length ${computersShips[shipIndex].getLength()}`
          MessageDestroyedShips.textContent = `Computer Ships Destroyed: ${playersGen.getComShipdestroyed()}`
          //console.log('Computer Ships Destroyed:' + playersGen.getComShipdestroyed())
        } else {MessageToComputer.textContent = ' '}
      }
      comBoard.boardHit(x, y) //update board on Board
      //console.log('Right Board: ')
      //console.log(computer_board)
      //So we dont accidentally click same square twice
      square.removeEventListener('click', e)
      if (playersGen.winCon()) {
        MessageToComputer.textContent = `Player ${playersGen.name()} has won!!`
        //remove all e listeners after a result is decided
        //credits: https://bobbyhadz.com/blog/javascript-remove-all-event-listeners-from-element
        computerSquaresHTML.forEach(square => square.replaceWith(square.cloneNode(true)))
        return // to prevent comGen.moves
      }
      //After player moves, AI will move
      comGen.moves(playerBoard, playersShips)
    })
  })
  //restart button  
  document.querySelector('.restart').addEventListener('click', function event() {
    /* note you can't use computerSquaresHTML here because 'return' above gets you out of function,
    hence computerSquaresHTML loses its reference. so have to queryall*/
    document.querySelectorAll('.computer_square').forEach(square => {
      square.textContent = ' ' //neccessary to clear right side (computer) board
      square.replaceWith(square.cloneNode(true)) //neccessary to clear repeated listeners
    })
    //neccessary to prevent repeated clicks 
    document.querySelector('.restart').removeEventListener('click', event)
    document.querySelector('.messFromCom').textContent = 'Any ship destroyed will be showed here'
    document.querySelector('.messFromPlayer').textContent = 'Any ship destroyed will be showed here'
    document.querySelector('.your_ships_destroyed').textContent = 'Player Ships Destroyed: 0'
    document.querySelector('.computer_ships_destroyed').textContent = 'Computer Ships Destroyed: 0'
    game()
  })
})()
