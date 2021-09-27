const baseUrl = `https://twnz.dev/gameApi/xo/v1`
let gameId = 0
let currentSeat = 0

async function testConnection() {
  console.log('testing connection')
  axios.get(`${baseUrl}/getHealth`)
  .then(res => console.log('server reachable', res.data))
  .catch(err => console.log(err))
}

async function getGameState() {
  const res = await axios.post(`${baseUrl}/getRoomState`, {roomId:gameId})
  return res.data
}

async function skipTurn(seatId) {
  const res = await axios.post(`${baseUrl}/skipTurn`, {
    roomId: gameId,
    seatId
  })
  return res.data
}

async function placeMark(seatId, x, y) {
  const res = await axios.post(`${baseUrl}/placeMark`, {
    roomId: gameId,
    seatId,
    x, y
  })
  return res.data
}

async function resetGame(seatId, x, y) {
  const res = await axios.post(`${baseUrl}/resetGame`, {
    roomId: gameId
  })
  return res.data
}

function changeSeat(newSeat) {
  console.log('change seat to',newSeat)
  currentSeat = newSeat
}