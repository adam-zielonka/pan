import { Card } from '../Card'
import type { Game, Action } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayerType'

export class SimplePlayer extends Player {
  type = PlayerType.Simple
  play(_game: Game, actions: Action[]): Action | undefined {
    // Hands are sorted: shed the lowest legal card and preserve higher ranks.
    return actions.find(([name]) => name instanceof Card) || actions[0]
  }
}
