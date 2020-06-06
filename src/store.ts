import { createContext, useContext } from 'react'
import PlayersStore from './store/PlayersStore'
import GameStore from './store/GameStore'

class Store {
  playersStore: PlayersStore
  gameStore: GameStore

  constructor() {
    this.playersStore = new PlayersStore()
    this.gameStore = new GameStore(this.playersStore);
    (window as any).render = () => this.gameStore.render(this.gameStore.board)
  }
}

const store = createContext(new Store())

export function useStore(): Store {
  return useContext(store)
}
