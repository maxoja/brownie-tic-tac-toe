elems.fetchButton.addEventListener('click', async (e) => {
  console.log('fetch button clicked')
  const gameState = await getGameState()
  renderGame(gameState)
})

elems.resetButton.addEventListener('click', async (e) => {
  console.log('reset button clicked')
  const result = await resetGame()
  console.log(result)
})

elems.placeButton.addEventListener('click', async (e) => {
  console.log('click place button')
  lastPlacing = Date.now()
  let res = await placeMark(currentSeat, crossX, crossY)
  console.log(res)
  if(!res.success) {
    res = await skipTurn(currentSeat)
    console.log(res)
  }
})

for(let y of [0,1,2]) {
  for(let x of [0,1,2]) {
    const cell = elems.getCell(x,y)
    cell.addEventListener('click', async (e) => {
      const cell = e.target
      const x = parseInt(cell.getAttribute('x'))
      const y = parseInt(cell.getAttribute('y'))
      const res = await placeMark(currentSeat, x, y)
      console.log(res)
    })
  }
}
//switchBtn1
elems.p1Container.addEventListener('click', () => {
  changeSeat(0)
})

elems.p2Container.addEventListener('click', () => {
  changeSeat(1)
})