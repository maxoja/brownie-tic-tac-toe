const utils = require('./utils')
const { MARK } = require('./enums')
const assert = require('assert').strict
const { pickRandomItem } = require('./utils')

class Coord {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static origin() {
    return new Coord(0, 0)
  }
}

class Clonable {
  getCloneObject() {
    throw new Error("Implementation missing")
  }
}

class Identity extends Clonable {
  constructor(name) {
    super()
    this._name = name
    this._tagCode = utils.randomDigitsStr(4)
    this._uid = utils.randomHexStr(16)
  }

  get displayName() {
    return `${this._name} #${this._tagCode}`
  }

  get uid() {
    return this._uid
  }

  getCloneObject() {
    return {
      displayName: this.displayName,
      uid: this.uid
    }
  }
}

class Player extends Clonable {
  constructor(name) {
    super()
    this._identity = new Identity(name)
  }

  get identity() {
    return this._identity
  }

  sameAs(anotherPlayer) {
    return anotherPlayer.identity.uid === this._identity.uid
  }

  getCloneObject() {
    return {
      ...this.identity.getCloneObject()
    }
  }
}

class TicTacToePlayer extends Player {
  constructor(name, mark) {
    super(name)
    this._mark = mark
  }

  get mark() {
    return this._mark
  }

  getCloneObject() {
    return {
      ...super.getCloneObject(),
      mark: this.mark
    }
  }
}

const _winPatterns = [
  [new Coord(0, 0), new Coord(0, 1), new Coord(0, 2)],
  [new Coord(1, 0), new Coord(1, 1), new Coord(1, 2)],
  [new Coord(2, 0), new Coord(2, 1), new Coord(2, 2)],
  [new Coord(0, 0), new Coord(1, 0), new Coord(2, 0)],
  [new Coord(0, 1), new Coord(1, 1), new Coord(2, 1)],
  [new Coord(0, 2), new Coord(1, 2), new Coord(2, 2)],
  [new Coord(0, 0), new Coord(1, 1), new Coord(2, 2)],
  [new Coord(0, 2), new Coord(1, 1), new Coord(2, 0)],
]

class TicTacToeBoard extends Clonable {
  constructor() {
    super()
    this._marks = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  }

  static getWinPatterns() { return _winPatterns; }

  reset() {
    this._marks = [[null, null, null], [null, null, null], [null, null, null]]
    return true
  }

  getMark(coord) {
    return this._marks[coord.y][coord.x]
  }

  placeMark(coord, mark) {
    this._marks[coord.y][coord.x] = mark
  }


  checkWin(targetMark) {
    for (const pattern of TicTacToeBoard.getWinPatterns()) {
      const cellMarks = pattern.map(coord => this.getMark(coord))
      if (cellMarks.every(mark => mark === targetMark)) {
        return true
      }
    }
    return false
  }

  print() {
    console.table(this._marks)
  }

  getCloneObject() {
    return {
      marksOnBoard: this._marks
    }
  }
}

// How to double inheritance?
class TicTacToeGame extends Clonable {
  constructor() {
    super()
    this.players = [
      new TicTacToePlayer('PlayerX', MARK.X),
      new TicTacToePlayer('PlayerO', MARK.O)
    ]
    this.currentPlayerSeat = 0;
    this.board = new TicTacToeBoard()
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
    if (this.board.getMark(coord))
      return false;
    if (playerSeat != this.currentPlayerSeat)
      return false;
    if (this.checkWinnerSeat() != -1)
      return false;
    const player = this.getPlayerFromSeat(playerSeat)
    this.board.placeMark(coord, player.mark)
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
    //Why seat is type of string?
    for (let seat in this.players) {
      seat = parseInt(seat)
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

  produceDeepClone() {
    return {
      playerNames: this.players.map(p => p.identity.displayName),
      playerMarks: this.players.map(p => p.mark),
      winnerSeatId: this.checkWinnerSeat(),
      currentTurnSeatId: this.currentPlayerSeat,
      turnTimestamp: this.turnTimestamp,
      ...this.board.getCloneObject(),
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
  assert.equal(game.checkWinnerSeat(), -1)

  game.placeMark(1, new Coord(2, 2))
  assert.equal(game.checkWinnerSeat(), 1)

  game.board.print()
  game.reset()
  assert.equal(game.checkWinnerSeat(), -1)

  game.placeMark(0, new Coord(0, 2))
  assert.equal(game.skipTurn(1), true)

  game.placeMark(0, new Coord(0, 1))
  assert.equal(game.checkWinnerSeat(), -1)
  
  game.board.print()
}

module.exports = {
  TicTacToeGame,
  Coord
}