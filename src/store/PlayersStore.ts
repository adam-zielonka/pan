import { observable, action } from 'mobx'

import { IPlayer } from '../engine/board'
import { MCTS } from '../engine/players/mcts'
import { Player } from '../engine/players/player'
import { PlayerAI } from '../engine/players/simple.ai'
import { PlayerAZ } from '../engine/players/playerAZ'
import { PlayerRandom } from '../engine/players/random'

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

  getGamePlayers = (): IPlayer[] => {
    const players: IPlayer[] = []
    for (const player of this.players) {
      switch (player) {
        case PlayerType.SimpleAI:
          players.push(new PlayerAI())
          break
        case PlayerType.Random:
          players.push(new PlayerRandom())
          break
        case PlayerType.MCTS:
          players.push(new MCTS())
          break
        case PlayerType.AZ:
          players.push(new PlayerAZ())
          break
        default:
          players.push(new Player())
          break
      }
    }
    return players
  }
}

export default PlayersStore
