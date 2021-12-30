import PlayersStore from './PlayersStore'
import GameStore from './GameStore'

class Store {
  players: PlayersStore
  game: GameStore

  constructor() {
    this.players = new PlayersStore()
    this.game = new GameStore(this.players)
    window.render = () => this.game.render(this.game.board)
  }
}

export const store = new Store()

declare global {
  interface Window {
    store: Store
    render: () => void
  }
}
window.store = store
