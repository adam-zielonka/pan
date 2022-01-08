import { Player } from './Player'
import { Human } from './players/Human'
import { None } from './players/None'
import { Random } from './players/Random'
import { Simple } from './players/Simple'

export enum PlayerType {
  None = 'None',
  Human = 'Human',
  Simple = 'Simple',
  Random = 'Random',
  // MCTS = 'MCTS',
  // AZ = 'AZ',
}

export class PlayersSelect extends Array<PlayerType> {
  constructor() {
    super()
    this.push(
      ...[PlayerType.Human, PlayerType.Simple, PlayerType.Random, PlayerType.Simple],
    )
  }

  set = (index: number, player: PlayerType): void => {
    this[index] = player
  }

  getGamePlayers = (): Player[] => {
    return this.reduce<Player[]>((players, player, index) => {
      switch (player) {
        case PlayerType.Simple:
          players.push(new Simple(index))
          break
        case PlayerType.Random:
          players.push(new Random(index))
          break
        // case PlayerType.MCTS:
        //   players.push(new MCTS(index))
        //   break
        // case PlayerType.AZ:
        //   players.push(new PlayerAZ(index))
        //   break
        case PlayerType.Human:
          players.push(new Human(index))
          break
        default:
          players.push(new None(index))
      }
      return players
    }, [])
  }
}
