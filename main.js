const cors = require('cors')
const express = require('express');
const model = require('./model')

const port = 4001

const app = express();
app.use(express.json());
app.use(cors())

// middle ware for logging path of every request before passing to an endpoint handler
app.use((req, res, next) => {
  console.log('Incoming request with path', req.path);
  console.log('params', req.params)
  console.log('body', req.body)
  next();
})

app.get('/xo/health', (req, res) => {
  res.sendStatus(200)
})

app.post('/xo/post-test', (req, res) => {
  res.sendStatus(200);
});

app.get('/xo/gameState/:gameId', (req, res) => {
  const game = games[req.params.gameId]
  res.json(game.asResponse())
})

// gameId, seatId
app.post('/xo/skipTurn', (req, res) => {
  const game = games[req.body.gameId]
  res.json({ path: req.path, success: game.skipTurn(req.body.seatId) })
})

// gameId, seatId, x, y
app.post('/xo/placeMark', (req, res) => {
  const { gameId, seatId, x, y } = req.body
  const game = games[gameId]
  res.json({ path: req.path, success: game.placeMark(seatId, new model.Coord(x, y)) })
})

// gameId
app.post('/xo/resetGame', (req, res) => {
  const game = games[req.body.gameId]
  game.reset()
  res.json({ path: req.path, success: true })
})

const games = []
for (let i = 0; i < 100; i++) {
  games.push(new model.TicTacToeGame())
}

app.listen(port, () => console.log(`Started server at http://localhost:${port}`));
