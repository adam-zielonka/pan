import { Game, type Action } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayerType'

export class SimplePlayer extends Player {
  type = PlayerType.Simple
  play(game: Game, actions: Action[]): Action {
    const firstCard = this.cards[0]
    if (firstCard && game.isPossibleToMoveCard(this, firstCard)) {
      return actions[0]
    }
    if (actions.length > 1) {
      return actions[actions.length - 2]
    }
    return actions[actions.length - 1]
  }
}
