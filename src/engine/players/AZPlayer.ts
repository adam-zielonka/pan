import { Game, type Action } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayerType'
import { actionKey, evaluate, tacticalScore, MoveMemory } from './search'

/** MaxN: at every node the player on turn maximizes their own utility. */
export class AZPlayer extends Player {
  type = PlayerType.AZ
  depth = 4
  nodeBudget = 1400
  private visited = 0
  private memory = new MoveMemory()

  private search(game: Game, depth: number): number[] {
    if (!depth || game.isGameOver || this.visited >= this.nodeBudget)
      return evaluate(game)
    const actor = game.token
    const actions = game
      .getPossibleActions(game.players[actor])
      .sort((a, b) => tacticalScore(game, b) - tacticalScore(game, a))
    let best: number[] | undefined
    for (const [name] of actions) {
      if (this.visited++ >= this.nodeBudget) break
      const child = new Game(game)
      const action = child
        .getPossibleActions(child.players[child.token])
        .find(([candidate]) => actionKey(candidate) === actionKey(name))
      action?.[1]()
      const scores = this.search(child, depth - 1)
      if (!best || scores[actor] > best[actor]) best = scores
    }
    return best || evaluate(game)
  }

  play(game: Game, actions: Action[]): Action | undefined {
    if (actions.length < 2) return actions[0]
    // Each root candidate gets its own budget so action ordering cannot starve one.
    const scores = actions.map(action => {
      this.visited = 0
      const child = new Game(game)
      child.players[this.id].makeAction(child, action[0])
      return this.search(child, this.depth - 1)[this.id]
    })
    return this.memory.choose(game, actions, scores)
  }
}
