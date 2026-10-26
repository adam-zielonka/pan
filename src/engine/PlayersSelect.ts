import type { Player } from './Player'
import { AZPlayer } from './players/AZPlayer'
import { HumanPlayer } from './players/HumanPlayer'
import { MCTSPlayer } from './players/MCTSPlayer'
import { NonePlayer } from './players/NonePlayer'
import { RandomPlayer } from './players/RandomPlayer'
import { SimplePlayer } from './players/SimplePlayer'
import { TacticalPlayer } from './players/TacticalPlayer'
import { RolloutPlayer } from './players/RolloutPlayer'

export { PlayerType } from './PlayerType'
import { PlayerType } from './PlayerType'

export class PlayersSelect extends Array<PlayerType> {
  // Array methods must not construct a fresh, prefilled player selection.
  static get [Symbol.species](): ArrayConstructor {
    return Array
  }

  constructor() {
    super()
    this.push(PlayerType.Human, PlayerType.Simple, PlayerType.MCTS, PlayerType.AZ)
  }

  set = (index: number, player: PlayerType): void => {
    this[index] = player
  }

  getGamePlayers = (): Player[] => {
    return this.map((player, index) => {
      switch (player) {
        case PlayerType.Simple:
          return new SimplePlayer(index)
        case PlayerType.Random:
          return new RandomPlayer(index)
        case PlayerType.MCTS:
          return new MCTSPlayer(index)
        case PlayerType.AZ:
          return new AZPlayer(index)
        case PlayerType.Tactical:
          return new TacticalPlayer(index)
        case PlayerType.Rollout:
          return new RolloutPlayer(index)
        case PlayerType.Human:
          return new HumanPlayer(index)
        default:
          return new NonePlayer(index)
      }
    })
  }
}
