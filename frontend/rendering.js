function showRoomPage() {
  const {roomPage, gamePage} = elems
  roomPage.style.display = 'block'
  gamePage.style.display = 'none'
}

function showGamePage() {
  const {roomPage, gamePage} = elems
  roomPage.style.display = 'none'
  gamePage.style.display = 'block'
}

function showPlaceButton(show) {
  elems.placeButton.disabled = !show
}

let prevState = null
function renderGame(gameState) {
  // console.log('rendering game state')
  // console.log(gameState)
  const {marksOnBoard, playerNames, currentTurnSeatId, winnerSeatId, playerMarks, turnTimestamp} = gameState
  _renderBoard(marksOnBoard)
  _renderPlayer(playerNames, currentTurnSeatId, winnerSeatId)
  _renderWinner(playerMarks, winnerSeatId)
  _renderTimer(turnTimestamp, currentTurnSeatId)
  prevState = gameState
}

function _renderWinner(marks, winnerSeat) {
  const {winnerBox, body, turnText} = elems
  removeClass(body, 'x')
  removeClass(body, 'o')
  if(winnerSeat == -1)
    return

  const mark = marks[winnerSeat]
  body.classList.add(mark)
  turnText.textContent = 'The game has ended'
  
  if(prevState.winnerSeatId == -1 && winnerSeat == currentSeat) {
    const lot = document.createElement('lottie-player')
    lot.id = 'win-overlay'
    lot.src = "https://assets7.lottiefiles.com/packages/lf20_OX0Ts3.json"
    lot.background='transparent'
    lot.speed='1'
    lot.autoplay=true
    document.body.appendChild(lot)
    setTimeout(() => {
      const overlay = elems.getWinnerOverlay()
      console.log('overlay', overlay)
      if(overlay) {
        console.log('remove', overlay)
        overlay.remove()
      }
    },4*1000)
  }
}

function _renderBoard(board) {
  // console.log('rendering board')
  for(let y in board) {
    for(let x in board[y]) {
      const classList = elems.getCell(x,y).classList
      for(let mark of ['x','o','null']) {
        if(classList.contains(mark))
          classList.remove(mark)
      }
      classList.add(''+board[y][x])
      // console.log(classList)
    }
  }
}

function _renderPlayer(names, turnSeatId, winnerSeat) {
  // console.log('rendering players')
  const {p1Text, p2Text, turnText, p1Container, p2Container} = elems
  p1Text.textContent = names[0]
  p2Text.textContent = names[1]
  turnText.textContent = 'Now is ' + names[turnSeatId]+'\'s turn'

  showPlaceButton(turnSeatId === currentSeat && winnerSeat == -1)
  removeClass(p1Container, 'myself')
  removeClass(p2Container, 'myself')
  const target = [p1Container, p2Container][currentSeat]
  target.classList.add('myself')
}

function _renderTimer(timestamp, turnSeat) {
  const bar = elems.timerBar;
  // console.log(timestamp, turnSeat)
  if(turnSeat != currentSeat || Date.now()-timestamp >= 10*1000) {
    bar.style.width = "0%"
    if(turnSeat == currentSeat)
      skipTurn(currentSeat)
    return;
  }
  bar.style.width = (100 - (Date.now()-timestamp)/10/1000*100).toFixed(2)+'%'
}

let crossX = 0
let crossY = 0
let lastPlacing = 0
function _renderCrosshair(turnSeatId, winnerSeat) {
  const cross = elems.crosshair
  if(winnerSeat != -1 || turnSeatId != currentSeat || Date.now()-lastPlacing <= 1000) {
    cross.style.visibility = 'hidden'
    return;
  } else {
    cross.style.visibility = 'visible'
  }
  const size = 4;
  const rX = Math.random()*100
  const rY = Math.random()*100
  crossX = Math.floor(rX/(100/3))
  crossY = Math.floor(rY/(100/3))

  function m(x) { return (x*0.92+4).toFixed(2)+'%' }
  cross.style.left = m(rX-size/2)
  cross.style.right = m(100-rX-size/2)
  cross.style.top = m(rY-size/2)
  cross.style.bottom = m(100-rY-size/2)
}

function removeClass(e, className) {
  if(e.classList.contains(className))
    e.classList.remove(className)
}

async function realTime() {
  while(true) {
    await sleep(400)
    if(!prevState)
      continue
    
    _renderCrosshair(prevState.currentTurnSeatId, prevState.winnerSeatId)
  }
}

realTime()