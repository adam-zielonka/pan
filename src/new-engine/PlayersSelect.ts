import { Player } from './Player'
import { AZPlayer } from './players/AZPlayer'
import { HumanPlayer } from './players/HumanPlayer'
import { NonePlayer } from './players/NonePlayer'
import { RandomPlayer } from './players/RandomPlayer'
import { SimplePlayer } from './players/SimplePlayer'

export enum PlayerType {
  None = 'None',
  Human = 'Human',
  Simple = 'Simple',
  Random = 'Random',
  // MCTS = 'MCTS',
  AZ = 'AZ',
}

export class PlayersSelect extends Array<PlayerType> {
  constructor() {
    super()
    this.push(PlayerType.Human, PlayerType.Random, PlayerType.AZ, PlayerType.Simple)
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
        // case PlayerType.MCTS:
        //   return new MCTS(index)
        case PlayerType.AZ:
          return new AZPlayer(index)
        case PlayerType.Human:
          return new HumanPlayer(index)
        default:
          return new NonePlayer(index)
      }
    })
  }
}
