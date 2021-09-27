showPlaceButton(false)
elems.fetchButton.style.display = 'none'
elems.switchBtn1.style.display = 'none'
elems.switchBtn2.style.display = 'none'
// alert('Please click on a player name to pick a side')

class Game {
  breakSignal = false;
  state = null;

  async startUpdateLoopAsync() {
    while(!this.breakSignal) {
      let lock = true
      
      getGameState()
        .then(s => {
          this.state = s;
          renderGame(s);
          lock = false;
        })
        .catch(e => {
          console.log(e)
          lock = false;
        })

      while(lock)
        await sleep(50)

      // try {
      //   this.state = await getGameState()
      //   renderGame(this.state)
      // } catch(e) {
      //   console.log(e)
      // }
      // await sleep(200)
    }
  }

  breakGameLoop() {
    this.breakSignal = true;
  }

  printBoard() {
    console.log(this.state);
  }
}

testConnection();
const game = new Game()
game.startUpdateLoopAsync()