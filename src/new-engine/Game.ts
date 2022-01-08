import { Stack } from './Stack'
import { Player } from './Player'
import { Card } from './Card'
import { Deck } from './Deck'
import { SubscribableStore } from './utils'

export class Game extends SubscribableStore {
  stack: Stack = new Stack()
  players: Player[] = []
  token = 0

  constructor(players: Player[]) {
    super()

    this.players = players
    setTimeout(() => {
      this.dealingCards(Deck.shuffle(Deck.generate()))
      // this.gameLoop()
    }, 1000)
  }

  get isGameOver(): boolean {
    return this.players.filter(player => !player.isPlaying).length > 0
  }

  setNextPlayerToken(): void {
    if (this.stack.isPikOnTop) {
      this.token = (this.token + this.players.length - 1) % this.players.length
    } else {
      this.token = (this.token + 1) % this.players.length
    }

    if (!this.players[this.token].isPlaying) {
      this.setNextPlayerToken()
    }
  }

  // getPossibleActions(player: Player): void {
  //   const possibleCards = player.cards.filter(card =>
  //     this.stack.isPossibleToPutCardOnStack(card),
  //   )

  //   const actions = [
  //     ...possibleCards.map(c => () => {
  //       const card = player.pop(c)
  //       if (card) {
  //         this.stack.putCardOnStack(card)
  //         this.setNextPlayerToken()
  //         this.notify()
  //       }
  //     }),
  //   ]

  //   if (this.stack.isPossibleToGetCardFromStack()) {
  //     actions.push(() => {
  //       const cards = this.stack.getFromStack()
  //       cards.forEach(card => player.addCard(card))
  //       this.setNextPlayerToken()
  //       this.notify()
  //     })
  //   }
  // }

  isPossibleToMoveCard(player: Player, card: Card): boolean {
    if (player.id !== this.token) {
      return false
    }

    const possibleCards = player.cards.filter(card =>
      this.stack.isPossibleToPutCardOnStack(card),
    )
    if (!possibleCards.some(c => c.isEqual(card))) {
      return false
    }

    return true
  }

  moveCard(player: Player, card: Card): void {
    if (!this.isPossibleToMoveCard(player, card)) {
      return
    }

    const index = player.cards.findIndex(_card => card.compare(_card) === 0)
    if (index !== -1) {
      player.cards.splice(index, 1)
      this.stack.putCardOnStack(card)
      this.setNextPlayerToken()
      this.notify()
    }
  }

  getFromStack(): void {
    if (!this.stack.isPossibleToGetCardFromStack()) {
      return
    }

    const cards = this.stack.getFromStack()
    cards.forEach(card => this.players[this.token].addCard(card))
    this.setNextPlayerToken()
    this.notify()
  }

  dealingCards(deck: Card[]): void {
    while (deck.length && this.players.length) {
      this.players.forEach((player, index) => {
        const card = deck.pop()
        if (!card) {
          return
        }
        if (card.isStartCard) {
          this.token = index
        }
        player.addCard(card)
        this.notify()
      })
    }
  }
}
