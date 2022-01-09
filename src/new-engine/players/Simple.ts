import { Game, PossibleAction } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

export class Simple extends Player {
  type = PlayerType.Simple
  play(game: Game, actions: PossibleAction[]): PossibleAction {
    return actions[0]
  }
}
