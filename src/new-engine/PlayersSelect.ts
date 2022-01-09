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
      // ...[PlayerType.Human, PlayerType.None, PlayerType.None, PlayerType.None],
    )
  }

  set = (index: number, player: PlayerType): void => {
    this[index] = player
  }

  getGamePlayers = (): Player[] => {
    return this.map((player, index) => {
      switch (player) {
        case PlayerType.Simple:
          return new Simple(index)
        case PlayerType.Random:
          return new Random(index)
        // case PlayerType.MCTS:
        //   return new MCTS(index)
        // case PlayerType.AZ:
        //   return new PlayerAZ(index)
        case PlayerType.Human:
          return new Human(index)
        default:
          return new None(index)
      }
    })
  }
}
