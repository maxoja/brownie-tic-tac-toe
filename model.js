const utils = require('./utils')
const { MARK } = require('./enums')

class Coord {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static origin() {
    return new Coord(0, 0)
  }
}

class JsonParsable {
  asJson() {
    throw new Error("Implementation missing")
  }
}

class Identity extends JsonParsable {
  constructor(name) {
    super()
    this._name = name
    this._tagCode = utils.randomDigitsStr(4)
  }

  get displayName() {
    return `${this._name} #${this._tagCode}`
  }

  asJson() {
    return {
      displayName: this.displayName,
    }
  }
}

class Player extends JsonParsable {
  constructor(name) {
    super()
    this._identity = new Identity(name)
  }

  get identity() {
    return this._identity
  }

  asJson() {
    return {
      ...this.identity.asJson()
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

  asJson() {
    return {
      ...super.asJson(),
      mark: this.mark
    }
  }
}

class Board extends JsonParsable {
  constructor() {
    super()
    this._marks = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  }

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

  static _winPatterns = [
    [new Coord(0, 0), new Coord(0, 1), new Coord(0, 2)],
    [new Coord(1, 0), new Coord(1, 1), new Coord(1, 2)],
    [new Coord(2, 0), new Coord(2, 1), new Coord(2, 2)],
    [new Coord(0, 0), new Coord(1, 0), new Coord(2, 0)],
    [new Coord(0, 1), new Coord(1, 1), new Coord(2, 1)],
    [new Coord(0, 2), new Coord(1, 2), new Coord(2, 2)],
    [new Coord(0, 0), new Coord(1, 1), new Coord(2, 2)],
    [new Coord(0, 2), new Coord(1, 1), new Coord(2, 0)],
  ]

  checkWin(targetMark) {
    for (const pattern of Board._winPatterns) {
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

  asJson() {
    return {
      marksOnBoard: this._marks
    }
  }
}

class TicTacToeGame {
  constructor() {
    this.players = [
      new TicTacToePlayer('PlayerX', MARK.X),
      new TicTacToePlayer('PlayerO', MARK.O)
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
      playerNames: this.players.map(p => p.identity.displayName),
      playerMarks: this.players.map(p => p.mark),
      winnerSeatId: this.checkWinnerSeat(),
      currentTurnSeatId: this.currentPlayerSeat,
      turnTimestamp: this.turnTimestamp,
      ...this.board.asJson(),
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