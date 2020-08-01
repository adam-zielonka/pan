import { createContext, useContext } from 'react'
import PlayersStore from './PlayersStore'
import GameStore from './GameStore'

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

export function useGameStore(): GameStore {
  return useContext(store).game
}

export function usePlayersStore(): PlayersStore {
  return useContext(store).players
}
