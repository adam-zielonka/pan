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
      this.gameLoop()
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

  gameLoop = (): void => {
    if (!this.isGameOver) {
      this.players[this.token].play(this.stack)
      this.notify()
      this.setNextPlayerToken()
      setTimeout(this.gameLoop, 1000)
    }
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
