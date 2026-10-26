import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Card, Color, Figure } from '../../engine/Card'
import { Game } from '../../engine/Game'
import { PlayerType } from '../../engine/PlayerType'
import { PlayersSelect } from '../../engine/PlayersSelect'
import { Stack } from '../../engine/Stack'
import { AZPlayer } from '../../engine/players/AZPlayer'
import { MCTSPlayer } from '../../engine/players/MCTSPlayer'
import { RolloutPlayer } from '../../engine/players/RolloutPlayer'
import { TacticalPlayer } from '../../engine/players/TacticalPlayer'
import { SimplePlayer } from '../../engine/players/SimplePlayer'
import { RandomPlayer } from '../../engine/players/RandomPlayer'
import { actionKey, sampleHiddenHands, MoveMemory } from '../../engine/players/search'

beforeEach(() => {
  vi.useFakeTimers()
  let seed = 12345
  vi.spyOn(Math, 'random').mockImplementation(() => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
    return seed / 4294967296
  })
})
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function fixture(): Game {
  const live = new Game()
  clearTimeout(live.timeout)
  const game = new Game(live)
  game.deck = []
  game.token = 0
  game.stack = new Stack()
  game.stack.push(new Card(Figure.f9, Color.Kier))
  game.players[0].cards = [
    new Card(Figure.f10, Color.Kier),
    new Card(Figure.A, Color.Pik),
  ]
  game.players[1].cards = [new Card(Figure.J, Color.Karo), new Card(Figure.K, Color.Kier)]
  game.players[2].cards = [new Card(Figure.Q, Color.Trefl)]
  game.players[3].cards = []
  return game
}
function snapshot(game: Game): string {
  return JSON.stringify({
    cards: game.players.map(p => p.cards.map(c => c.text)),
    stack: [...game.stack].map(c => c.text),
    token: game.token,
    moves: game.moveCount,
    ready: game.isComboModeRady,
    combo: game.isComboMode,
  })
}
function allCards(game: Game): string[] {
  return [...game.stack, ...game.deck, ...game.players.flatMap(player => player.cards)]
    .map(c => c.text)
    .sort()
}

describe('isolated simulations and rules', () => {
  it('advances a cloned move exactly once without scheduling an AI turn or notifying the live game', () => {
    const source = fixture()
    const before = snapshot(source)
    const simulation = new Game(source)
    const notify = vi.fn()
    source.subscribe(notify)
    notify.mockClear()
    simulation.players[0].makeAction(simulation, simulation.players[0].cards[0])
    expect(simulation.token).toBe(1)
    expect(snapshot(source)).toBe(before)
    expect(notify).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('plays a full series before handing over the turn and never loses cards', () => {
    const game = fixture()
    game.players[0].cards = [Color.Kier, Color.Karo, Color.Trefl, Color.Pik].map(
      color => new Card(Figure.f10, color),
    )
    const before = allCards(game)
    const [first, ...rest] = game.players[0].cards
    game.players[0].makeAction(game, first)
    expect(game.isComboModeRady).toBe(true)
    expect(game.token).toBe(0)
    expect(
      game.getPossibleActions(game.players[0]).some(([name]) => name === 'skip'),
    ).toBe(true)
    for (const card of rest) game.players[0].makeAction(game, card)
    expect(game.isComboMode).toBe(false)
    expect(game.isComboModeRady).toBe(false)
    // The final spade sends play left, skipping the empty fourth seat.
    expect(game.token).toBe(2)
    expect(game.players[0].cards).toHaveLength(0)
    expect(allCards(game)).toEqual(before)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('allows declining an optional series', () => {
    const game = fixture()
    game.players[0].cards = [Color.Kier, Color.Karo, Color.Trefl, Color.Pik].map(
      color => new Card(Figure.f10, color),
    )
    game.players[0].makeAction(game, game.players[0].cards[0])
    game.players[0].makeAction(game, 'skip')
    expect(game.token).toBe(1)
    expect(game.isComboModeRady).toBe(false)
    expect(game.players[0].cards).toHaveLength(3)
  })

  it('refuses an out-of-turn action and a card absent from the hand', () => {
    const game = fixture()
    const before = snapshot(game)
    game.players[1].makeAction(game, 'stack')
    expect(
      game.isPossibleToMoveCard(game.players[0], new Card(Figure.A, Color.Kier)),
    ).toBe(false)
    expect(snapshot(game)).toBe(before)
  })

  it('samples unknown cards without changing the visible hand, stack, or opponent counts', () => {
    const game = fixture()
    const before = snapshot(game)
    const sample = sampleHiddenHands(game, 0)
    expect(sample.players[0].cards).toEqual(game.players[0].cards)
    expect([...sample.stack]).toEqual([...game.stack])
    expect(sample.players.map(player => player.cards.length)).toEqual(
      game.players.map(player => player.cards.length),
    )
    expect(allCards(sample)).toEqual(allCards(game))
    expect(snapshot(game)).toBe(before)
  })

  it('restarts with exactly one complete deck and rejects fewer than two players', () => {
    const game = fixture()
    game.playersSelect.set(0, PlayerType.Human)
    game.playersSelect.set(1, PlayerType.Simple)
    game.playersSelect.set(2, PlayerType.None)
    game.playersSelect.set(3, PlayerType.None)
    game.newGame()
    expect(new Set(allCards(game)).size).toBe(24)
    expect(allCards(game)).toHaveLength(24)
    expect(game.players[0].cards).toHaveLength(12)
    expect(game.players[2].cards).toHaveLength(0)
    const before = snapshot(game)
    game.playersSelect.set(1, PlayerType.None)
    game.newGame()
    expect(snapshot(game)).toBe(before)
  })
})

describe('strategies', () => {
  it('explores another legal move after a position repeats without reading hidden hands', () => {
    const game = fixture()
    const actions = game.getPossibleActions(game.players[0])
    const memory = new MoveMemory()
    const scores = actions.map((_, index) => (index === 0 ? 10 : 0))
    for (let repeat = 0; repeat < 3; repeat++) {
      expect(memory.choose(game, actions, scores)).toBe(actions[0])
      // Swap hidden cards while preserving counts: this is the same known position.
      ;[game.players[1].cards[0], game.players[2].cards[0]] = [
        game.players[2].cards[0],
        game.players[1].cards[0],
      ]
    }
    const choice = memory.choose(game, actions, scores)
    expect(actions).toContain(choice)
    expect(choice).not.toBe(actions[0])
  })

  const algorithms = [
    SimplePlayer,
    RandomPlayer,
    TacticalPlayer,
    AZPlayer,
    MCTSPlayer,
    RolloutPlayer,
  ]
  for (const Algorithm of algorithms) {
    it(`${Algorithm.name} chooses a legal move without mutating the game or creating timers`, () => {
      const game = fixture()
      const player = new Algorithm(0)
      const before = snapshot(game)
      const actions = game.getPossibleActions(game.players[0])
      const result = player.play(game, actions)
      expect(result).toBeDefined()
      expect(actions).toContain(result)
      expect(snapshot(game)).toBe(before)
      expect(vi.getTimerCount()).toBe(0)
    })
  }

  for (const Algorithm of [TacticalPlayer, AZPlayer, MCTSPlayer, RolloutPlayer]) {
    it(`${Algorithm.name} takes an immediate exit instead of drawing cards`, () => {
      const game = fixture()
      game.players[0].cards = [new Card(Figure.f10, Color.Kier)]
      const player = new Algorithm(0)
      const result = player.play(game, game.getPossibleActions(game.players[0]))
      expect(result?.[0]).toBe(game.players[0].cards[0])
    })
  }

  it('greedy play chooses the lowest legal card when the lowest held card is blocked', () => {
    const game = fixture()
    game.stack.push(new Card(Figure.Q, Color.Kier))
    game.players[0].cards = [
      new Card(Figure.J, Color.Kier),
      new Card(Figure.K, Color.Karo),
      new Card(Figure.A, Color.Pik),
    ]
    expect(
      new SimplePlayer(0).play(game, game.getPossibleActions(game.players[0]))?.[0],
    ).toBe(game.players[0].cards[1])
  })

  it('all strategies handle a terminal state with no actions', () => {
    const game = fixture()
    game.players.forEach(player => {
      player.cards = []
    })
    for (const Algorithm of algorithms)
      expect(new Algorithm(0).play(game, [])).toBeUndefined()
  })

  it.each([7, 91, 281])(
    'finishes a seeded mixed-strategy game while preserving cards (seed %i)',
    seed => {
      vi.mocked(Math.random).mockImplementation(() => {
        seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
        return seed / 4294967296
      })
      const initial = new Game()
      clearTimeout(initial.timeout)
      initial.playersSelect = new PlayersSelect()
      initial.playersSelect.splice(
        0,
        4,
        PlayerType.Tactical,
        PlayerType.MCTS,
        PlayerType.Rollout,
        PlayerType.AZ,
      )
      initial.newGame()
      clearTimeout(initial.timeout)
      const simulation = new Game(initial)
      const brains = initial.players
      for (const brain of brains) {
        if (brain instanceof MCTSPlayer) brain.iterations = 30
        if (brain instanceof RolloutPlayer) brain.samples = 6
        if (brain instanceof AZPlayer) brain.depth = 3
      }
      let moves = 0
      while (!simulation.isGameOver && moves++ < 1200) {
        const actions = simulation.getPossibleActions(
          simulation.players[simulation.token],
        )
        const choice = brains[simulation.token].play(simulation, actions)
        expect(choice).toBeDefined()
        const legal = actions.find(([name]) => actionKey(name) === actionKey(choice![0]))
        expect(legal).toBeDefined()
        legal![1]()
        expect(new Set(allCards(simulation)).size).toBe(24)
        expect(allCards(simulation)).toHaveLength(24)
      }
      expect(simulation.isGameOver, snapshot(simulation)).toBe(true)
      expect(simulation.players.filter(player => player.isPlaying)).toHaveLength(1)
    },
    20000,
  )
})
