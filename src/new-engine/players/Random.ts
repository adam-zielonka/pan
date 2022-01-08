import { Game } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

function getRandomElementFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export class Random extends Player {
  type = PlayerType.Random
  play(game: Game): void {
    const possibleActions = game.getPossibleActions(this)
    getRandomElementFromArray(possibleActions)()
  }
}
