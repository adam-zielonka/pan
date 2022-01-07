import { IPlayer } from '../engine/board'
import { MCTS } from '../engine/players/mcts'
import { Player } from '../engine/players/player'
import { PlayerAI } from '../engine/players/simple.ai'
import { PlayerAZ } from '../engine/players/playerAZ'
import { PlayerRandom } from '../engine/players/random'
import { SubscribableStore } from './storeUtils'

export enum PlayerType {
  None = 'None',
  Human = 'Human',
  SimpleAI = 'Simple.AI',
  Random = 'Random',
  MCTS = 'MCTS',
  AZ = 'AZ',
}

class PlayersStore extends SubscribableStore {
  players: PlayerType[]

  constructor() {
    super()
    this.players = [PlayerType.Human, PlayerType.AZ, PlayerType.MCTS, PlayerType.AZ]
  }

  get playerOne(): PlayerType {
    return this.players[0]
  }

  set = (index: number, player: PlayerType): void => {
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
