const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model')

const port = 4001

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
// middle ware for logging path of every request before passing to an endpoint handler
app.use((req, res, next) => {
  console.log('Incoming request with path', req.path);
  next();
})

app.get('/xo/health', (req, res) => {
  res.sendStatus(200)
})
app.post('/xo/post-test', (req, res) => {
  console.log('Got body:', req.body);
  res.sendStatus(200);
});
app.get('/xo/get/gameState', (req, res) => {
  const game = games[req.body.gameId]
  res.json(game.asResponse())
})

const games = [new model.TicTacToeGame()]

app.listen(port, () => console.log(`Started server at http://localhost:${port}`));
