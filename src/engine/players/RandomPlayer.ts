import { Game, Action } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

function getRandomElementFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export class RandomPlayer extends Player {
  type = PlayerType.Random
  play(game: Game, actions: Action[]): Action {
    return getRandomElementFromArray(actions)
  }
}
