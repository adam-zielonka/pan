import { Stack } from './Stack'
import { Player } from './Player'
import { Card, Figure } from './Card'
import { Deck } from './Deck'
import { SubscribableStore } from './utils'
import { PlayersSelect, PlayerType } from './PlayersSelect'

export type ActionName = Card | 'stack' | 'skip'
export type Action = [ActionName, () => void]

export class Game extends SubscribableStore {
  stack: Stack = new Stack()
  deck: Card[] = []
  players: Player[] = []
  token = 0

  timeout: NodeJS.Timeout | undefined
  playersSelect: PlayersSelect = new PlayersSelect()

  isComboModeRady = false
  isComboMode = false

  constructor(game?: Game) {
    super()

    if (game) {
      this.stack.push(...game.stack)
      this.deck.push(...game.deck)
      this.players = game.players.map(player => player.clone())
      this.token = game.token
      this.isComboModeRady = game.isComboModeRady
      this.isComboMode = game.isComboMode

      return
    }

    this.players = this.playersSelect.getGamePlayers()
    this.deck.push(...Deck.shuffle(Deck.generate()))

    this.timeout = setTimeout(() => {
      this.dealingCards()
      this.notify()
      this.playerPlay()
    }, 100)
  }

  get isGameOver(): boolean {
    return (
      this.players.map(player => player.isPlaying).reduce((p, f) => (f ? ++p : p), 0) < 1
    )
  }

  get isComboPossible(): boolean {
    const card = this.stack[this.stack.length - 1]
    const player = this.players[this.token]
    if (!player) {
      return false
    }

    if (!card) {
      const cards = player.cards.filter(c => c.compareFigures(Figure.f9) === 0)
      return cards.length === 3
    }

    const cards = player.cards.filter(c => c.compareFigures(card.figure) === 0)
    if (this.stack.length === 2 && card.compareFigures(Figure.f9) === 0) {
      return cards.length === 2
    }

    return cards.length === 3
  }

  get comboFigure(): Figure {
    const card = this.stack[this.stack.length - 1]
    if (card) {
      return card.figure
    } else {
      return Figure.f9
    }
  }

  newGame(): void {
    this.timeout && clearTimeout(this.timeout)
    this.isComboModeRady = false
    this.isComboMode = false
    this.stack.slice(0).forEach(card => {
      const index = this.stack.findIndex(_card => card.compare(_card) === 0)
      if (index !== -1) {
        this.deck.push(this.stack.splice(index, 1)[0])
      }
    })
    this.players.forEach(player => {
      player.cards.slice(0).forEach(card => {
        const c = player.popCard(card)
        if (c) {
          this.deck.push(c)
        }
      })
    })
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
    this.players = this.playersSelect.getGamePlayers()
    this.token = 0
    this.dealingCards()
    this.notify()
    this.playerPlay()
  }

  getPossibleActions(player: Player): Action[] {
    const possibleCards = player.cards.filter(card =>
      this.isPossibleToMoveCard(player, card),
    )

    const actions: Action[] = possibleCards.map(card => [
      card,
      () => this.actionMoveCard(player, card),
    ])

    if (this.isComboMode) {
      return actions
    }

    if (this.isComboModeRady) {
      actions.push(['skip', () => this.actionSkipCombo()])
      return actions
    }

    if (this.isPossibleToGetCardFromStack()) {
      actions.push(['stack', () => this.actionStack()])
    }

    return actions
  }

  isPossibleToMoveCard(player: Player, card: Card): boolean {
    if (player.id !== this.token) {
      return false
    }

    const possibleCards = player.cards.filter(card =>
      this.stack.isPossibleToPutCardOnStack(card),
    )

    if (this.isComboModeRady || this.isComboMode) {
      if (card.compareFigures(this.comboFigure) === 0) {
        return true
      }
      return false
    }

    if (!possibleCards.some(c => c.isEqual(card))) {
      return false
    }

    return true
  }

  isPossibleToGetCardFromStack(): boolean {
    if (this.isComboModeRady || this.isComboMode) {
      return false
    }
    return this.stack.isPossibleToGetCardFromStack()
  }

  private actionMoveCard(player: Player, card: Card): void {
    if (!this.isPossibleToMoveCard(player, card)) {
      return
    }

    const index = player.cards.findIndex(_card => card.compare(_card) === 0)
    if (index !== -1) {
      player.cards.splice(index, 1)
      this.stack.putCardOnStack(card)
      if (this.isComboModeRady) {
        this.isComboModeRady = false
        this.isComboMode = true
      }
      if (this.isComboPossible) {
        this.isComboModeRady = true
      }
      if (
        !this.players[this.token].cards.some(
          c => c.compareFigures(this.comboFigure) === 0,
        )
      ) {
        this.isComboMode = false
      }
      this.finishTurn()
    }
  }

  private actionSkipCombo(): void {
    this.isComboMode = false
    this.isComboModeRady = false
    this.finishTurn()
  }

  private actionStack(): void {
    if (!this.isPossibleToGetCardFromStack()) {
      return
    }

    const cards = this.stack.getFromStack()
    cards.forEach(card => this.players[this.token].addCard(card))
    this.finishTurn()
  }

  setNextPlayer(): void {
    if (!this.players.some(player => player.isPlaying)) {
      return
    }

    if (this.isComboMode || this.isComboModeRady) {
      return
    }

    if (this.stack.isPikOnTop) {
      this.token = (this.token + this.players.length - 1) % this.players.length
    } else {
      this.token = (this.token + 1) % this.players.length
    }

    if (!this.players[this.token].isPlaying) {
      this.setNextPlayer()
    }
  }

  private playerPlay(): void {
    if (this.isGameOver) {
      return
    }
    this.timeout && clearTimeout(this.timeout)
    this.timeout = this.players[this.token].playWrapper(this)
  }

  private finishTurn(): void {
    this.setNextPlayer()
    this.notify()
    this.playerPlay()
  }

  private dealingCards(): void {
    while (this.deck.length && this.players.length) {
      for (const player of this.players) {
        if (player.type === PlayerType.None) {
          continue
        }
        const card = this.deck.pop()
        if (!card) {
          return
        }
        if (card.isStartCard) {
          this.token = player.id
        }
        player.addCard(card)
      }
    }
  }
}
