import type { Game, Action } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayerType'
import { tacticalScore, MoveMemory } from './search'

export class TacticalPlayer extends Player {
  type = PlayerType.Tactical
  private memory = new MoveMemory()
  play(game: Game, actions: Action[]): Action | undefined {
    return this.memory.choose(
      game,
      actions,
      actions.map(action => tacticalScore(game, action)),
    )
  }
}
