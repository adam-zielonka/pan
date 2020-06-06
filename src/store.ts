import { createContext, useContext } from 'react'
import { observable, action } from 'mobx'
import PlayersStore from './store/PlayersStore'
import { Board } from './engine/board'
import { Deck } from './engine/card'

class Store {
  playersStore: PlayersStore = new PlayersStore()
  @observable board: Board

  constructor() {
    this.newGame()
  }

  @action newGame = () => {
    this.board = new Board()
    this.board.addPlayers(this.playersStore.getGamePlayers())
    this.board.dealingCards(Deck.print(Deck.shuffle(Deck.generate())))
  }

  @action startGame = () => {
    this.board.start()
  }
}

const store = createContext(new Store())

export function useStore(): Store {
  return useContext(store)
}
