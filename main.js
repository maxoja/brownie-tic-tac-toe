const cors = require('cors')
const express = require('express');
const model = require('./model')
const {PORT, BASE_PATH} = require('./settings')

const app = express();
app.use(express.json());
app.use(cors())

// middle ware for logging path of every request before passing to an endpoint handler
app.use((req, res, next) => {
  console.log('Request with path', req.path);
  console.log('Params', req.params)
  console.log('Body', req.body)
  next();
})

app.get(BASE_PATH + '/xo/health', (req, res) => {
  res.sendStatus(200)
})

app.get(BASE_PATH + '/xo/:id/state', (req, res) => {
  const game = games[req.params.id]
  res.json(game.asResponse())
})

// gameId, seatId
app.post(BASE_PATH + '/xo/:id/skip', (req, res) => {
  const game = games[req.params.id]
  res.json({ path: req.path, success: game.skipTurn(req.body.seatId) })
})

// gameId, seatId, x, y
app.post(BASE_PATH + '/xo/:id/mark', (req, res) => {
  const { seatId, x, y } = req.body
  const game = games[id]
  res.json({ path: req.path, success: game.placeMark(seatId, new model.Coord(x, y)) })
})

// gameId
app.post(BASE_PATH + '/xo/:id/reset', (req, res) => {
  const game = games[req.params.id]
  game.reset()
  res.json({ path: req.path, success: true })
})

const games = []
for (let i = 0; i < 100; i++) {
  games.push(new model.TicTacToeGame())
}

app.listen(PORT, () => console.log(`Started server at http://localhost:${port}`));
