import { Game, PossibleAction } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayersSelect'

export class Simple extends Player {
  type = PlayerType.Simple
  play(game: Game, actions: PossibleAction[]): PossibleAction {
    const firstCard = this.cards[0]
    if (firstCard && game.isPossibleToMoveCard(this, firstCard)) {
      return actions[0]
    }
    return actions[actions.length - 1]
  }
}
