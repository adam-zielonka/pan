import { Game } from './Game'

class Store {
  game: Game

  constructor() {
    this.game = new Game()
  }
}

export const store = new Store()

declare global {
  interface Window {
    store: Store
  }
}
window.store = store
