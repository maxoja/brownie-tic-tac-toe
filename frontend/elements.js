const elems = {
  roomPage: document.getElementById('room-page'),
  gamePage: document.getElementById('game-page'),
  placeButton: document.getElementById('place-btn'),
  fetchButton: document.getElementById('fetch-btn'),
  resetButton: document.getElementById('reset-btn'),
  getCell: (x,y) => document.getElementById('cell-'+y.toString()+x.toString()),
  p1Text: document.querySelector('#first-player .name'),
  p2Text: document.querySelector('#second-player .name'),
  turnText: document.getElementById('turn-text'),
  switchBtn1: document.getElementById('switch-1-btn'),
  switchBtn2: document.getElementById('switch-2-btn'),
  p1Container: document.getElementById('first-player'),
  p2Container: document.getElementById('second-player'),
  // winnerBox: document.getElementById('winner-box'),
  body: document.body,
  aimBox:document.getElementById('aim-box'),
  crosshair:document.getElementById('crosshair'),
  timerBar:document.getElementById('timer-bar'),
  getWinnerOverlay: () => {
    return document.getElementById('winner-overlay')
  }
}
