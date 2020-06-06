import { createContext, useContext } from 'react'
import { observable, action } from 'mobx'
import PlayersStore from './store/PlayersStore'

class Store {
  playersStore: PlayersStore = new PlayersStore()
}

const store = createContext(new Store())

export function useStore(): Store {
  return useContext(store)
}
