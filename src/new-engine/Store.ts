import { Game } from './Game'
import { Player } from './Player'

class Store {
  game: Game

  constructor() {
    this.game = new Game([new Player(0), new Player(1), new Player(2), new Player(3)])
  }

  newGame = (): void => {
    this.game = new Game([new Player(0), new Player(1), new Player(2), new Player(3)])
  }
}

export const store = new Store()

declare global {
  interface Window {
    store: Store
  }
}
window.store = store
