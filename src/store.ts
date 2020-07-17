import { createContext, useContext } from 'react'
import PlayersStore from './store/PlayersStore'
import GameStore from './store/GameStore'

class Store {
  players: PlayersStore
  game: GameStore

  constructor() {
    this.players = new PlayersStore()
    this.game = new GameStore(this.players)
    ;(window as any).render = () => this.game.render(this.game.board)
  }
}

const store = createContext(new Store())

export function useStore(): Store {
  return useContext(store)
}
