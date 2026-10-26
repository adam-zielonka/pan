import type { Game, Action } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayerType'
import { rollout, sampleHiddenHands } from './search'

/** Flat Monte Carlo gives each legal move the same number of sampled playouts. */
export class RolloutPlayer extends Player {
  type = PlayerType.Rollout
  samples = 36
  play(game: Game, actions: Action[]): Action | undefined {
    if (actions.length < 2) return actions[0]
    const scores = actions.map(action => {
      let total = 0
      for (let iteration = 0; iteration < this.samples; iteration++) {
        const sample = sampleHiddenHands(game, this.id)
        sample.players[this.id].makeAction(sample, action[0])
        total += rollout(sample)[this.id]
      }
      return total / this.samples
    })
    return actions[scores.indexOf(Math.max(...scores))]
  }
}
