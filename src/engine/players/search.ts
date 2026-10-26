import { Card } from '../Card'
import { Deck } from '../Deck'
import { Game, type Action, type ActionName } from '../Game'

export function actionKey(action: ActionName): string {
  return action instanceof Card ? action.text : action
}

/** Remember only public information and our own hand; break repeated positions. */
export class MoveMemory {
  private positions = new Map<string, Map<string, number>>()

  choose(game: Game, actions: Action[], scores: number[]): Action | undefined {
    if (!actions.length) return
    const key = JSON.stringify([
      game.token,
      game.isComboModeRady,
      game.isComboMode,
      [...game.stack].map(card => card.text),
      game.players.map(player =>
        player.id === game.token
          ? player.cards.map(card => card.text)
          : player.cards.length,
      ),
    ])
    const counts = this.positions.get(key) || new Map<string, number>()
    const visits = [...counts.values()].reduce((sum, count) => sum + count, 0)
    const leastUsed = Math.min(
      ...actions.map(([name]) => counts.get(actionKey(name)) || 0),
    )
    let best = -1
    let ties = 0
    actions.forEach(([name], index) => {
      // After three identical positions, explore an alternative legal move.
      if (visits >= 3 && (counts.get(actionKey(name)) || 0) > leastUsed) return
      if (best < 0 || scores[index] > scores[best] + 1e-9) {
        best = index
        ties = 1
      } else if (Math.abs(scores[index] - scores[best]) <= 1e-9) {
        if (Math.random() < 1 / ++ties) best = index
      }
    })
    const selected = actions[best]
    const name = actionKey(selected[0])
    counts.set(name, (counts.get(name) || 0) + 1)
    this.positions.set(key, counts)
    if (this.positions.size > 96)
      this.positions.delete(this.positions.keys().next().value!)
    return selected
  }
}

/** Each player wants to leave the game before becoming the last card holder. */
export function evaluate(game: Game): number[] {
  const burdens = game.players.map(player =>
    player.cards.reduce((sum, card) => sum + 15 - card.figure, 0),
  )
  const total = burdens.reduce((sum, burden) => sum + burden, 0)
  return burdens.map(burden => {
    if (!burden) return 1
    if (game.isGameOver) return 0
    return 1 - burden / total
  })
}

/** Sample unknown hands, preserving our own hand and every opponent's card count. */
export function sampleHiddenHands(game: Game, playerId: number): Game {
  const sample = new Game(game)
  const opponents = sample.players.filter(player => player.id !== playerId)
  const unknown = Deck.shuffle(opponents.flatMap(player => player.cards))
  for (const player of opponents) {
    player.cards = unknown.splice(0, player.cards.length).sort((a, b) => a.compare(b))
  }
  return sample
}

export function tacticalScore(game: Game, action: Action): number {
  const card = action[0]
  if (card === 'stack') return -100 - game.stack.numberOfCardsThatCanBeGetFromStack
  if (card === 'skip') return -50
  const hand = game.players[game.token].cards
  if (hand.length === 1) return 1000
  const sameRank = hand.filter(c => c.figure === card.figure).length
  // A low card is harder to shed later; a complete rank can be played as a series.
  const canSeries = sameRank === 4 || (card.figure === 9 && sameRank >= 3)
  let score = (15 - card.figure) * 3 + (canSeries ? 10 : 0)
  const direction = card.isPik ? -1 : 1
  let next = (game.token + direction + game.players.length) % game.players.length
  while (!game.players[next].isPlaying) {
    next = (next + direction + game.players.length) % game.players.length
  }
  if (game.players[next].cards.length <= 2) score += card.figure - 9
  return score
}

/** A bounded rollout; limits also stop cyclic take/replay sequences. */
export function rollout(game: Game, limit = 100): number[] {
  for (let step = 0; step < limit && !game.isGameOver; step++) {
    const actions = game.getPossibleActions(game.players[game.token])
    if (!actions.length) break
    const action =
      Math.random() < 0.25
        ? actions[Math.floor(Math.random() * actions.length)]
        : actions.reduce((best, candidate) =>
            tacticalScore(game, candidate) > tacticalScore(game, best) ? candidate : best,
          )
    action[1]()
  }
  return evaluate(game)
}
