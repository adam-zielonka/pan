import { it, expect, vi } from 'vitest'
import { Game } from '../../engine/Game'
import { PlayerType } from '../../engine/PlayerType'

it('initializes the complete game module graph and independent cloned state', () => {
  vi.useFakeTimers()
  try {
    const game = new Game()
    expect(Array.from(game.players, player => player.type)).toEqual([
      PlayerType.Human, PlayerType.Simple, PlayerType.MCTS, PlayerType.AZ,
    ])
    expect(game.deck.length).toBe(24)
    const clone = new Game(game)
    clone.deck.pop()
    expect(game.deck.length).toBe(24)
    expect(clone.deck.length).toBe(23)
  } finally {
    vi.clearAllTimers()
    vi.useRealTimers()
  }
})
