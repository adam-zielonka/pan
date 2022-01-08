import { Game } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

export class Simple extends Player {
  type = PlayerType.Simple
  play(game: Game): void {
    const possibleActions = game.getPossibleActions(this)
    possibleActions[0]()
  }
}
