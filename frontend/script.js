showPlaceButton(false)
elems.fetchButton.style.display = 'none'
elems.switchBtn1.style.display = 'none'
elems.switchBtn2.style.display = 'none'

// alert('Please click on a player name to pick a side')
async function printBoard() {
  console.log(await getGameState())
}

async function fetchAndRenderForever() {
  while(true) {
    try {
      const gameState = await getGameState()
      renderGame(gameState)
    } catch(e) {
      console.log(e)
    }
    // break;
    await sleep(200)
  }
}

testConnection();
fetchAndRenderForever()