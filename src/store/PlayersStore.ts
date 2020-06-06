import { observable, action } from 'mobx'

export enum PlayerType {
  Human = 'Human',
  SimpleAI = 'Simple.AI',
  Random = 'Random',
  MCTS = 'MCTS',
  AZ = 'AZ'
}

class PlayersStore {
  @observable players: PlayerType[]

  constructor() {
    this.players = []
    this.players.push(PlayerType.Human)
    this.players.push(PlayerType.MCTS)
  }

  @action add = () => {
    this.players.push(PlayerType.SimpleAI)
  }

  @action remove = (index: number) => {
    this.players.splice(index, 1)
  }

  @action set = (index: number, player: PlayerType) => {
    this.players[index] = player
  }
}

export default PlayersStore
