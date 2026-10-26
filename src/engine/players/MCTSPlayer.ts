import { Game, type Action, type ActionName } from '../Game'
import { Player } from '../Player'
import { PlayerType } from '../PlayerType'
import { actionKey, rollout, sampleHiddenHands } from './search'

class Node {
  visits = 0
  rewards: number[] = []
  children = new Map<string, Node>()
}

/** Root-sampled information-set MCTS: hidden hands are resampled each iteration. */
export class MCTSPlayer extends Player {
  type = PlayerType.MCTS
  iterations = 180

  findNextMove(game: Game): ActionName | undefined {
    const actions = game.getPossibleActions(game.players[this.id])
    if (actions.length < 2) return actions[0]?.[0]
    const root = new Node()

    for (let iteration = 0; iteration < this.iterations; iteration++) {
      const sample = sampleHiddenHands(game, this.id)
      let node = root
      const path = [root]

      for (let depth = 0; depth < 60 && !sample.isGameOver; depth++) {
        const legal = sample.getPossibleActions(sample.players[sample.token])
        if (!legal.length) break
        const unexplored = legal.filter(([name]) => !node.children.has(actionKey(name)))
        let action: Action
        let expand = false
        if (unexplored.length) {
          action = unexplored[Math.floor(Math.random() * unexplored.length)]
          expand = true
        } else {
          const actor = sample.token
          const score = ([name]: Action): number => {
            const child = node.children.get(actionKey(name))!
            return (
              child.rewards[actor] / child.visits +
              Math.SQRT2 * Math.sqrt(Math.log(node.visits + 1) / child.visits)
            )
          }
          action = legal.reduce((best, candidate) =>
            score(candidate) > score(best) ? candidate : best,
          )
        }
        const key = actionKey(action[0])
        action[1]() // A move advances the turn exactly once, including series.
        if (expand) node.children.set(key, new Node())
        node = node.children.get(key)!
        path.push(node)
        if (expand) break
      }

      const rewards = rollout(sample)
      for (const visited of path) {
        visited.visits++
        rewards.forEach((reward, id) => {
          visited.rewards[id] = (visited.rewards[id] || 0) + reward
        })
      }
    }

    return actions.reduce((best, candidate) => {
      const visits = (action: Action) =>
        root.children.get(actionKey(action[0]))?.visits || 0
      return visits(candidate) > visits(best) ? candidate : best
    })[0]
  }

  play(game: Game, actions: Action[]): Action | undefined {
    const result = this.findNextMove(game)
    return actions.find(([name]) => name === result) || actions[0]
  }
}
