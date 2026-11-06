import { afterEach, beforeEach, it, expect, vi } from 'vitest'
import { Deck } from '../../engine/Deck'
import { Card, Color, Figure } from '../../engine/Card'
import { Game } from '../../engine/Game'
import { PlayerType } from '../../engine/PlayerType'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function expectPrepared(game: Game): void {
  expect(game.players.every(player => player.cards.length === 0)).toBe(true)
  expect(game.deck.map(card => card.text).sort()).toEqual(
    Deck.generate()
      .map(card => card.text)
      .sort(),
  )
  expect(game.stack).toHaveLength(0)
  expect(game.history).toEqual([])
  expect(game.moveCount).toBe(0)
  expect(game.token).toBe(0)
  expect(game.isComboModeRady).toBe(false)
  expect(game.isComboMode).toBe(false)
  expect(game.timeout).toBeUndefined()
  expect(vi.getTimerCount()).toBe(0)
}

it('initializes the complete game module graph and independent cloned state', () => {
  const game = new Game()
  expect(Array.from(game.players, player => player.type)).toEqual([
    PlayerType.Human,
    PlayerType.Simple,
    PlayerType.None,
    PlayerType.MCTS,
    PlayerType.None,
    PlayerType.AZ,
  ])
  expect(game.deck.length).toBe(24)
  const clone = new Game(game)
  expect(clone.isSimulation).toBe(true)
  expect(clone.timeout).toBeUndefined()
  expect(vi.getTimerCount()).toBe(1)
  clone.deck.pop()
  expect(game.deck.length).toBe(24)
  expect(clone.deck.length).toBe(23)
})

it.each([undefined, {}, { autoStart: true }])('autostarts with options %j', options => {
  const game = new Game(undefined, options)
  const notify = vi.fn()
  game.subscribe(notify)
  notify.mockClear()

  expect(game.players.every(player => player.cards.length === 0)).toBe(true)
  expect(vi.getTimerCount()).toBe(1)
  vi.advanceTimersByTime(99)
  expect(game.deck).toHaveLength(24)
  expect(notify).not.toHaveBeenCalled()

  vi.advanceTimersByTime(1)
  expect(game.deck).toHaveLength(0)
  expect(game.players.map(player => player.cards.length)).toEqual([6, 6, 0, 6, 0, 6])
  expect(notify).toHaveBeenCalledExactlyOnceWith(game)
})

it('keeps autoStart:false ready without dealing, playing or notifying after time passes', () => {
  const game = new Game(undefined, { autoStart: false })
  const players = game.players
  const deck = [...game.deck]
  const play = game.players.map(player => vi.spyOn(player, 'play'))
  const notify = vi.fn()
  game.subscribe(notify)
  notify.mockClear()

  expect(game.isSimulation).toBe(false)
  expect(game.players.map(player => player.type)).toEqual([
    PlayerType.Human,
    PlayerType.Simple,
    PlayerType.None,
    PlayerType.MCTS,
    PlayerType.None,
    PlayerType.AZ,
  ])
  expectPrepared(game)
  vi.advanceTimersByTime(60_000)

  expectPrepared(game)
  expect(game.players).toBe(players)
  expect(game.deck).toEqual(deck)
  expect(play.every(spy => spy.mock.calls.length === 0)).toBe(true)
  expect(notify).not.toHaveBeenCalled()
})

it('starts a prepared game with the selected players and only notifies after dealing all 24 cards', () => {
  const game = new Game(undefined, { autoStart: false })
  game.thinkDelay = 1200
  game.playersSelect.splice(
    0,
    game.playersSelect.length,
    PlayerType.Human,
    PlayerType.None,
    PlayerType.Human,
    PlayerType.None,
    PlayerType.None,
    PlayerType.None,
  )
  const notify = vi.fn((value: Game) => value.players.map(player => player.cards.length))
  game.subscribe(notify)
  notify.mockClear()

  game.newGame()

  expect(game.deck).toHaveLength(0)
  expect(game.players.map(player => player.type)).toEqual([...game.playersSelect])
  expect(game.thinkDelay).toBe(1200)
  expect(
    game.players
      .flatMap(player => player.cards)
      .map(card => card.text)
      .sort(),
  ).toEqual(
    Deck.generate()
      .map(card => card.text)
      .sort(),
  )
  expect(notify).toHaveBeenCalledExactlyOnceWith(game)
  expect(notify.mock.results[0].value).toEqual([12, 0, 12, 0, 0, 0])
  expect(game.history).toEqual([])
  expect(game.moveCount).toBe(0)
  expect(game.timeout).toBeUndefined()
  expect(vi.getTimerCount()).toBe(0)
})

it.each([
  { seats: [0, 1, 2, 3, 5], counts: [5, 5, 5, 5, 0, 4] },
  { seats: [0, 1, 2, 3, 4, 5], counts: [4, 4, 4, 4, 4, 4] },
])('deals one complete deck to active seats $seats', ({ seats, counts }) => {
  const game = new Game(undefined, { autoStart: false })
  game.playersSelect.fill(PlayerType.None)
  for (const seat of seats) game.playersSelect.set(seat, PlayerType.Human)

  game.newGame()

  expect(game.deck).toHaveLength(0)
  expect(game.players.map(player => player.cards.length)).toEqual(counts)
  expect(
    game.players
      .flatMap(player => player.cards)
      .map(card => card.text)
      .sort(),
  ).toEqual(
    Deck.generate()
      .map(card => card.text)
      .sort(),
  )
  expect(game.players[game.token].cards.some(card => card.isStartCard)).toBe(true)
  expect(vi.getTimerCount()).toBe(0)

  game.prepareGame()

  expectPrepared(game)
  expect(
    game.players.filter(player => player.type !== PlayerType.None).map(p => p.id),
  ).toEqual(seats)
})

it.each([
  { color: Color.Kier, order: [1, 2, 3, 4, 5, 0], sparseOrder: [4, 5, 0] },
  { color: Color.Pik, order: [5, 4, 3, 2, 1, 0], sparseOrder: [5, 4, 0] },
])(
  'cycles through six seats in the direction of $color, skipping empty seats',
  ({ color, order, sparseOrder }) => {
    const game = new Game(undefined, { autoStart: false })
    game.playersSelect.fill(PlayerType.Human)
    game.newGame()
    game.token = 0
    game.stack.push(new Card(Figure.f9, color))

    for (const seat of order) {
      game.setNextPlayer()
      expect(game.token).toBe(seat)
    }

    for (const seat of [1, 2, 3]) game.players[seat].cards = []
    for (const seat of sparseOrder) {
      game.setNextPlayer()
      expect(game.token).toBe(seat)
    }
    expect(game.isGameOver).toBe(false)

    game.players[4].cards = []
    game.setNextPlayer()
    expect(game.token).toBe(5)
    expect(game.isGameOver).toBe(false)

    game.players[0].cards = []
    expect(game.isGameOver).toBe(true)
  },
)

it('rejects starting with fewer than two selected players without notifying or scheduling', () => {
  const game = new Game(undefined, { autoStart: false })
  game.playersSelect.fill(PlayerType.None)
  game.playersSelect.set(2, PlayerType.Human)
  game.prepareGame()
  const players = game.players
  const deck = game.deck
  const notify = vi.fn()
  game.subscribe(notify)
  notify.mockClear()

  game.newGame()

  expectPrepared(game)
  expect(game.players).toBe(players)
  expect(game.deck).toBe(deck)
  expect(notify).not.toHaveBeenCalled()
})

it('prepareGame cancels the initial dealing timeout and notifies the prepared selection once', () => {
  const game = new Game()
  const oldPlayers = game.players
  const play = oldPlayers.map(player => vi.spyOn(player, 'play'))
  game.thinkDelay = 1800
  const selection = game.playersSelect
  selection.splice(
    0,
    4,
    PlayerType.None,
    PlayerType.Tactical,
    PlayerType.Human,
    PlayerType.None,
  )
  const notify = vi.fn()
  game.subscribe(notify)
  notify.mockClear()
  expect(vi.getTimerCount()).toBe(1)

  game.prepareGame()

  expectPrepared(game)
  expect(game.players).not.toBe(oldPlayers)
  expect(game.players.map(player => player.type)).toEqual([...selection])
  expect(game.players.map(player => player.id)).toEqual([0, 1, 2, 3, 4, 5])
  expect(game.playersSelect).toBe(selection)
  expect(game.thinkDelay).toBe(1800)
  expect(notify).toHaveBeenCalledExactlyOnceWith(game)
  const deck = [...game.deck]
  vi.advanceTimersByTime(60_000)

  expectPrepared(game)
  expect(game.deck).toEqual(deck)
  expect(play.every(spy => spy.mock.calls.length === 0)).toBe(true)
  expect(notify).toHaveBeenCalledTimes(1)
})

it('prepareGame cancels a pending bot move and resets an active game while preserving pace and selection', () => {
  const game = new Game(undefined, { autoStart: false })
  game.thinkDelay = 1500
  game.playersSelect.fill(PlayerType.Simple)
  game.newGame()
  vi.advanceTimersByTime(game.thinkDelay)
  expect(game.moveCount).toBe(1)
  expect(game.stack).toHaveLength(1)
  expect(game.history).toHaveLength(1)
  expect(vi.getTimerCount()).toBe(1)
  const pendingPlayer = game.players[game.token]
  const play = vi.spyOn(pendingPlayer, 'play')
  const selection = game.playersSelect
  selection.set(0, PlayerType.Human)
  selection.set(1, PlayerType.None)
  game.token = 3
  game.isComboMode = true
  game.isComboModeRady = true
  const notify = vi.fn()
  game.subscribe(notify)
  notify.mockClear()

  game.prepareGame()

  expectPrepared(game)
  expect(game.players.map(player => player.type)).toEqual([...selection])
  expect(game.playersSelect).toBe(selection)
  expect(game.thinkDelay).toBe(1500)
  expect(notify).toHaveBeenCalledExactlyOnceWith(game)
  const deck = [...game.deck]
  vi.advanceTimersByTime(60_000)

  expectPrepared(game)
  expect(game.deck).toEqual(deck)
  expect(play).not.toHaveBeenCalled()
  expect(notify).toHaveBeenCalledTimes(1)
})

it.each([true, false])(
  'clones an active simulation independently with autoStart:%s',
  autoStart => {
    const game = new Game(undefined, { autoStart: false })
    game.playersSelect.fill(PlayerType.Human)
    game.newGame()
    const startingPlayer = game.players[game.token]
    const startCard = startingPlayer.cards.find(card => card.isStartCard)!
    startingPlayer.makeAction(game, startCard)
    game.isComboMode = true
    game.isComboModeRady = true
    const notify = vi.fn()
    game.subscribe(notify)
    notify.mockClear()

    const clone = new Game(game, { autoStart })

    expect(clone.isSimulation).toBe(true)
    expect(clone.timeout).toBeUndefined()
    expect(clone.stack).toEqual(game.stack)
    expect(clone.stack).not.toBe(game.stack)
    expect(clone.deck).toEqual(game.deck)
    expect(clone.deck).not.toBe(game.deck)
    expect(clone.token).toBe(game.token)
    expect(clone.moveCount).toBe(game.moveCount)
    expect(clone.isComboMode).toBe(true)
    expect(clone.isComboModeRady).toBe(true)
    for (const [index, player] of clone.players.entries()) {
      expect(player).not.toBe(game.players[index])
      expect(player.cards).toEqual(game.players[index].cards)
      expect(player.cards).not.toBe(game.players[index].cards)
      expect(player.id).toBe(game.players[index].id)
      expect(player.type).toBe(game.players[index].type)
    }
    const originalHand = [...game.players[0].cards]
    clone.players[0].cards.pop()
    clone.stack.pop()
    expect(game.players[0].cards).toEqual(originalHand)
    expect(game.stack).toHaveLength(1)
    vi.advanceTimersByTime(60_000)
    expect(vi.getTimerCount()).toBe(0)
    expect(notify).not.toHaveBeenCalled()
  },
)
