const cors = require('cors')
const express = require('express');
const model = require('./model')
const { PORT, BASE_PATH } = require('./settings')

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

app.get(BASE_PATH + '/getHealth', (req, res) => {
  res.json({
    status: 'not functional',
    message: 'The server is running but still in development. It might not be fully functional'
  })
})

app.post(BASE_PATH + '/getRoomState', (req, res) => {
  const { roomId } = req.body;
  const room = rooms[roomId]
  res.json(room.asResponse())
})

app.post(BASE_PATH + '/skipTurn', (req, res) => {
  const { roomId, seatId } = req.body
  const room = rooms[roomId]
  const success = room.skipTurn(seatId)
  res.json({ success })
})

app.post(BASE_PATH + '/placeMark', (req, res) => {
  const { roomId, seatId, x, y } = req.body
  const room = rooms[roomId]
  const success = room.placeMark(seatId, new model.Coord(x, y))
  res.json({ success })
})

app.post(BASE_PATH + '/resetGame', (req, res) => {
  const { roomId } = req.body
  const room = rooms[roomId]
  const success = room.reset()
  res.json({ success })
})

const rooms = []
for (let i = 0; i < 100; i++) {
  rooms.push(new model.TicTacToeGame())
}

app.listen(PORT, () => console.log(`Started server at http://localhost:${PORT}`));
