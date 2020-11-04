const utils = require('./utils')
const { MARK } = require('./enums')

// TODO can this be simpler?
class Coord {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}

// TODO should there be generic player and tic-tac-toe player classes?
// TODO I feel it's not a good idea to use getter/setter but why not?
// TODO how to best make stuff private within loosy js
class Player {
  constructor(mark) {
    // TODO how to make sure that player name is unique?
    // TODO should player name generation be a function and where it should be?
    this.name = 'Player#' + utils.random4DigitsStr()
    this.mark = mark
  }

  changeName(newName) {
    this.name = newName
  }
}

class Board {
  constructor() {
    this.cells = [[null, null, null], [null, null, null], [null, null, null]]
  }

  reset() {
    this.cells = [[null, null, null], [null, null, null], [null, null, null]]
    return true
  }

  getCell(coord) {
    return this.cells[coord.y][coord.x]
  }

  setCell(coord, mark) {
    this.cells[coord.y][coord.x] = mark
  }

  checkWin(mark) {
    for (let row of this.cells) {
      if (row.every(cell => cell == mark)) {
        return true
      }
    }

    for (let x in this.cells) {
      let all = true
      for (let y in this.cells) {
        if (this.cells[y][x] != mark) {
          all = false
          break
        }
      }
      if (all) return true
    }

    let cross = true
    for (let i of [0, 1, 2]) {
      if (this.cells[i][i] != mark) {
        cross = false
        break
      }
    }
    if (cross)
      return true

    cross = true
    for (let i of [0, 1, 2]) {
      if (this.cells[i][2 - i] != mark) {
        cross = false
        break
      }
    }
    if (cross)
      return true
    return false
  }

  print() {
    console.table(this.cells)
  }

  asResponse() {
    return this.cells
  }
}

class TicTacToeGame {
  constructor() {
    this.players = [
      new Player(MARK.X),
      new Player(MARK.O)
    ]
    this.currentPlayerSeat = 0;
    this.board = new Board()
    this.changeCount = 0
    this.turnTimestamp = Date.now()
  }

  reset() {
    this.board.reset()
    this.currentPlayerSeat = 0
    this.turnTimestamp = Date.now()
    this.changeCount++
    return true
  }

  placeMark(playerSeat, coord) {
    if (this.board.getCell(coord))
      return false;
    if (playerSeat != this.currentPlayerSeat)
      return false;
    if (this.checkWinnerSeat() != -1)
      return false;
    const player = this.getPlayerFromSeat(playerSeat)
    this.board.setCell(coord, player.mark)
    this.currentPlayerSeat += 1
    this.currentPlayerSeat %= this.players.length
    this.turnTimestamp = Date.now()
    this.changeCount++
    return true
  }

  getPlayerFromSeat(seat) {
    return this.players[seat]
  }

  checkWinnerSeat() {
    for (let seat in this.players) {
      const player = this.getPlayerFromSeat(seat)
      if (this.board.checkWin(player.mark)) {
        return seat
      }
    }
    return -1
  }

  checkTurn(seat) {
    return this.currentPlayerSeat === seat
  }

  skipTurn(seatId) {
    if (seatId != this.currentPlayerSeat)
      return false
    if (this.checkWinnerSeat() != -1)
      return false;

    this.currentPlayerSeat += 1
    this.currentPlayerSeat %= this.players.length
    this.turnTimestamp = Date.now()
    this.changeCount++
    return true;
  }
  getChangeCount() {
    return this.changeCount
  }

  asResponse() {
    return {
      playerNames: this.players.map(p => p.name),
      playerMarks: this.players.map(p => p.mark),
      board: this.board.asResponse(),
      winnerSeatId: this.checkWinnerSeat(),
      currentTurnSeatId: this.currentPlayerSeat,
      turnSeed: this.turnTimestamp
    }
  }
}

if (require.main === module) {
  const game = new TicTacToeGame()
  game.placeMark(0, new Coord(0, 2))
  game.placeMark(0, new Coord(0, 1))
  game.placeMark(1, new Coord(1, 1))
  game.placeMark(0, new Coord(0, 1))
  game.placeMark(1, new Coord(0, 0))
  game.placeMark(0, new Coord(1, 2))
  console.log(game.checkWinnerSeat())
  game.placeMark(1, new Coord(2, 2))
  game.board.print()
  game.reset()
  game.placeMark(0, new Coord(0, 2))
  console.log(game.skipTurn(1))
  game.placeMark(0, new Coord(0, 1))
  game.board.print()
}

module.exports = {
  TicTacToeGame,
  Coord
}