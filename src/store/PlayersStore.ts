import { observable, action } from 'mobx'

import { IPlayer } from '../engine/board'
import { MCTS } from '../engine/players/mcts'
import { Player } from '../engine/players/player'
import { PlayerAI } from '../engine/players/simple.ai'
import { PlayerAZ } from '../engine/players/playerAZ'
import { PlayerRandom } from '../engine/players/random'

export enum PlayerType {
  None = 'None',
  Human = 'Human',
  SimpleAI = 'Simple.AI',
  Random = 'Random',
  MCTS = 'MCTS',
  AZ = 'AZ',
}

class PlayersStore {
  @observable players: PlayerType[]

  constructor() {
    this.players = []
    this.players.push(PlayerType.Human)
    this.players.push(PlayerType.MCTS)
    this.players.push(PlayerType.None)
    this.players.push(PlayerType.None)
  }

  @action set = (index: number, player: PlayerType) => {
    this.players[index] = player
  }

  getGamePlayers = (): IPlayer[] => {
    return this.players.reduce<IPlayer[]>((players, player, index) => {
      switch (player) {
      case PlayerType.SimpleAI:
        players.push(new PlayerAI(index))
        break
      case PlayerType.Random:
        players.push(new PlayerRandom(index))
        break
      case PlayerType.MCTS:
        players.push(new MCTS(index))
        break
      case PlayerType.AZ:
        players.push(new PlayerAZ(index))
        break
      case PlayerType.Human:
        players.push(new Player(index))
        break
      }
      return players
    }, [])
  }
}

export default PlayersStore
